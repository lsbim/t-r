import PersonalityIcon from "../../commons/icon/PersonalityIcon";
import { clashV2BossList, ClashV2Summary } from "../../types/clashV2Types";
import LineBarComponent from "../bar/LineBarComponent";

const ClashV2Index = ({ summary }: { summary: ClashV2Summary }) => {
    const contentList = ['셰이디의 차원', '림의 이면세계'];
    // console.log(clashSort)

    return (
        <div className="bg-white w-[1068px] dark:bg-zinc-900 rounded-b-md shadow-lg max-w-full my-8">
            <div className="p-6 mb-2 flex flex-col border-b-4 border-gray-200 dark:border-zinc-800 gap-y-2">
                <div className="flex flex-col justify-start mb-3 dark:text-zinc-200">
                    <h1 className="text-[20px] font-bold mr-2">차원 대충돌 2.0 집계</h1>
                    <span className="flex xs:text-[14px] text-[11px]">막대 차트 클릭 시 해당 시즌의 상세 집계 페이지로 이동합니다.</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                {clashV2BossList.map((bossName: string, i: number) => {
                    // 해당 보스명과 일치하는 모든 데이터 항목을 찾고 시즌 정보도 함께 유지
                    const matchingEntries = Object.entries(summary)
                        .filter(([seasonKey, data]) => data.name === bossName)
                        .sort(([seasonKeyA], [seasonKeyB]) => {
                            const a = Number(seasonKeyA);
                            const b = Number(seasonKeyB);
                            const isBetaA = a > 10000;
                            const isBetaB = b > 10000;

                            if (isBetaA !== isBetaB) {
                                return isBetaA ? 1 : -1;
                            }

                            // 같은 그룹끼리는 내림차순
                            return b - a;
                        })
                        // 시즌 키와 데이터를 모두 유지하는 객체로 변환
                        .map(([seasonKey, data]) => ({
                            season: seasonKey,
                            seasonData: data
                        }));

                    return (
                        <div
                            key={'차원대충돌' + bossName}
                            className={`px-6 py-4 min-w-[500px] ${clashV2BossList.length === i + 1 ? '' : 'border-b-4 border-gray-200 dark:border-zinc-800'}`}>
                            {/* 보스명 헤더 */}
                            <h3 className="text-xl font-bold mb-4 dark:text-zinc-200">{bossName}</h3>

                            {/* 셰이디의 차원, 림의 이면세계 */}
                            {matchingEntries.length !== 0 && (
                                <div className="w-full mb-1 flex items-center">
                                    {/* 왼쪽 여백을 위한 빈 div */}
                                    <div className="mr-2 w-[90px] flex-shrink-0" />
                                    <div
                                        className="flex items-center justify-start text-[13px] gap-x-10 text-gray-600 dark:text-zinc-400">
                                        {contentList.map(c => (
                                            <div
                                                key={`line_text_` + c}
                                                className="xs:w-[430px] w-[280px] ">
                                                {c}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 데이터가 없는 보스의 경우 빈 차트 한 세트만 표시 */}
                            {
                                matchingEntries.length === 0 ? (
                                    <div className="flex gap-8 mb-1 text-[12px] text-gray-600 dark:text-zinc-200">
                                        준비 중입니다.
                                    </div>
                                ) : (
                                    // 데이터가 있는 경우 각 시즌의 바 차트를 세로로 배치
                                    matchingEntries.map((entry, entryIndex) => {
                                        const { season, seasonData } = entry;

                                        const seasonTooltip = seasonData.rules.join("\n");

                                        // console.log("seasonData", seasonData)

                                        return (
                                            <div key={`${bossName}_season_${season}`} className={`flex h-[24px] mt-[-1px]`}>
                                                {/* 시즌 정보 */}
                                                <div className="w-full mb-1 flex items-center h-full">
                                                    {/* 마진 8px + 너비 80px */}
                                                    <div className="min-w-[90px] gap-x-2 flex items-center mr-2 dark:text-zinc-200">
                                                        <div
                                                            data-tooltip-id="my-tooltip"
                                                            data-tooltip-content={`${seasonData?.startDate} ~ ${seasonData?.endDate}`}
                                                            className="hover:text-gray-400 hover:dark:text-zinc-400 whitespace-nowrap w-[24px] flex items-center font-bold text-[14px] cursor-pointer">
                                                            {Number(season) > 10000 && (
                                                                <>
                                                                    B{Number(season) - 10000}
                                                                </>
                                                            )}
                                                            {Number(season) < 10000 && (
                                                                <>
                                                                    S{season}
                                                                </>
                                                            )}
                                                        </div>
                                                        <div
                                                            data-tooltip-id="my-tooltip"
                                                            data-tooltip-content={`${seasonTooltip}`}
                                                            className="hover:text-gray-400 hover:dark:text-zinc-400 relative w-[24px] whitespace-nowrap font-bold text-[13px] cursor-pointer flex items-center">
                                                            규칙
                                                        </div>
                                                        <div
                                                            data-tooltip-id="my-tooltip"
                                                            data-tooltip-content={seasonData?.personality}
                                                            className={`w-[28px] text-[13px] font-bold text-${seasonData?.personality} whitespace-nowrap cursor-pointer`}>
                                                            <PersonalityIcon personality={seasonData?.personality} size={20} />
                                                        </div>
                                                    </div>

                                                    {/* 림의 이면세계 / 셰이디의 차원 요약 바 차트 */}
                                                    <div className={`flex gap-x-10`}>
                                                        <div className="xs:w-[430px] w-[280px] flex">
                                                            <LineBarComponent
                                                                data={seasonData.summary}
                                                                season={Number(season)}
                                                                type="clashV2"
                                                            />
                                                        </div>
                                                        <div className="xs:w-[430px] w-[280px] flex">
                                                            <LineBarComponent
                                                                data={seasonData.sideSummary}
                                                                season={Number(season)}
                                                                type="clashV2"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )
                            }
                        </div>
                    )
                })}
            </div>
        </div >
    );
}

export default ClashV2Index;