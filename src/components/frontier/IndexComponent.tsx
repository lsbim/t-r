import { frontierBossList, FrontierSummary } from "../../types/frontierTypes";
import LineBarComponent from "../bar/LineBarComponent";

const IndexComponent = ({ summary }: { summary: FrontierSummary }) => {
    const lines = ["후열", "중열", "전열"];
    const lineGap = 10;

    return (
        <div className="bg-white rounded-b-md shadow-lg max-w-full overflow-x-auto my-8">
            {frontierBossList.map((bossName, i) => {
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
                        key={'엘리아스프론티어' + bossName}
                        className={`p-6 min-w-[500px] ${frontierBossList.length === i + 1 ? '' : 'border-b-4 border-gray-200'}`}>
                        {/* 보스명 */}
                        <h3 className="text-xl font-bold mb-4">{bossName}</h3>

                        {/* 후열, 중열, 전열 */}
                        {matchingEntries.length !== 0 && (
                            <div className="w-full mb-1 flex items-center">
                                {/* 왼쪽 여백을 위한 빈 div */}
                                <div className="mr-2 w-[90px] flex-shrink-0" />

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
                        {matchingEntries.length === 0 ? (
                            <div className="flex gap-8 mb-1 text-[12px] text-gray-600">
                                준비 중입니다.
                            </div>
                        ) : (
                            // 데이터가 있는 경우 각 시즌의 바 차트를 세로로 배치
                            matchingEntries.map((entry, entryIndex) => {
                                const { season, seasonData } = entry;

                                const seasonTooltip = seasonData.power.join("\n");

                                // console.log("seasonData", seasonData)

                                return (
                                    <div key={`${bossName}_season_${season}`} className={`flex h-[24px] mt-[-1px]`}>
                                        {/* 시즌 정보 */}
                                        <div className="w-full mb-1 flex items-center h-full">
                                            {/* 마진 8px + 너비 90px */}
                                            <div className="mr-2 gap-x-1 flex items-center min-w-[90px] whitespace-nowrap">
                                                <div
                                                    data-tooltip={`${seasonData?.startDate} ~ ${seasonData?.endDate}`}
                                                    className="text-[13px] font-bold cursor-pointer w-[24px]">
                                                    S{season}
                                                </div>
                                                <div
                                                    data-tooltip={`${seasonTooltip}`}
                                                    className="relative w-[64px] whitespace-nowrap font-bold text-[13px] cursor-pointer">
                                                    교주의권능
                                                </div>
                                            </div>

                                            {/* 열 별 요약 바 차트 */}
                                            <div style={{ gap: lineGap }} className={`flex`}>
                                                {lines.map((line) => (
                                                    <div
                                                        key={`${line}_season_${season}`}
                                                        className="w-[28vw] lg:w-[300px] flex flex-shrink-0 flex-grow-0"
                                                    >
                                                        <LineBarComponent
                                                            data={seasonData.summary}
                                                            line={line}
                                                            season={Number(season)}
                                                            type={"frontier"}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default IndexComponent;