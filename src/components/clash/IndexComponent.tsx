import PersonalityIcon from "../../commons/PersonalityIcon";
import { clashBossList, ClashSummary } from "../../types/clashTypes";
import LineBarComponent from "../bar/LineBarComponent";

const IndexComponent = ({ summary }: { summary: ClashSummary }) => {
    const lines = ["후열", "중열", "전열"];
    const lineGap = 10;

    return (
        <div className="bg-white rounded-b-md shadow-lg max-w-full overflow-x-auto my-8">
            {clashBossList.map((bossName, i) => {
                // 해당 보스명과 일치하는 모든 데이터 항목을 찾고 시즌 정보도 함께 유지
                const matchingEntries = Object.entries(summary)
                    .filter(([seasonKey, data]) => data.name === bossName)
                    .sort(([seasonKeyA], [seasonKeyB]) => {
                        // 키가 이미 숫자이므로 직접 비교 (내림차순 정렬)
                        return Number(seasonKeyB) - Number(seasonKeyA);
                    })
                    // 시즌 키와 데이터를 모두 유지하는 객체로 변환
                    .map(([seasonKey, data]) => ({
                        season: seasonKey,
                        seasonData: data
                    }));

                // 보스명을 키로 하는 전체 섹션을 반환합니다
                return (
                    <div
                        key={'차원대충돌' + bossName}
                        className={`p-6 min-w-[500px] ${clashBossList.length === i + 1 ? '' : 'border-b-4 border-gray-200'}`}>
                        {/* 보스명 헤더 */}
                        <h3 className="text-xl font-bold mb-4">{bossName}</h3>

                        {/* 후열, 중열, 전열 */}
                        {matchingEntries.length !== 0 && (
                            <div className="w-full mb-1 flex items-center">
                                {/* 왼쪽 여백을 위한 빈 div */}
                                <div className="mr-2 w-[80px] flex-shrink-0" />

                                <div
                                    style={{ gap: lineGap }}
                                    className="flex items-center justify-start text-[13px] text-gray-600">
                                    {lines.map(line => (
                                        <div key={`line_text_` + line} className="lg:w-[300px] w-[28vw]">
                                            {line}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 데이터가 없는 보스의 경우 빈 차트 한 세트만 표시 */}
                        {
                            matchingEntries.length === 0 ? (
                                <div className="flex gap-8 mb-1 text-[12px] text-gray-600">
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
                                                <div className="w-[80px] gap-x-1 flex items-center mr-2">
                                                    <div
                                                        data-tooltip={`${seasonData?.startDate} ~ ${seasonData?.endDate}`}
                                                        className="whitespace-nowrap flex items-center font-bold text-[14px] cursor-pointer">
                                                        S{season}
                                                    </div>
                                                    <div
                                                        data-tooltip={`${seasonTooltip}`}
                                                        className="relative w-[24px] whitespace-nowrap font-bold text-[13px] cursor-pointer flex items-center">
                                                        규칙
                                                    </div>
                                                    <div data-tooltip={seasonData?.personality}
                                                        className={`w-[28px] text-[13px] font-bold text-${seasonData?.personality} whitespace-nowrap cursor-pointer`}>
                                                        <PersonalityIcon personality={seasonData?.personality} />
                                                    </div>
                                                </div>

                                                {/* 열 별 요약 바 차트 */}
                                                <div style={{ gap: lineGap }} className={`flex`}>
                                                    {lines.map((line) => (
                                                        <div
                                                            key={`${line}_season_${season}`}
                                                            className="w-[28vw] lg:w-[300px] flex"
                                                        >
                                                            <LineBarComponent
                                                                data={seasonData.summary}
                                                                line={line}
                                                                season={Number(season)}
                                                                type="clash"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        }
                    </div>
                );
            })}
        </div >
    );
}

export default IndexComponent;