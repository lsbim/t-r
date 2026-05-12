import LineBarComponent from "../../components/bar/LineBarComponent";
import { clashBossList, ClashSummary } from "../../types/clashTypes";
import { clashV2BossList, ClashV2Summary } from "../../types/clashV2Types";
import { frontierBossList, FrontierSummary } from "../../types/frontierTypes";
import { clashV2Category, lineList, personalityList } from "../../types/trickcalTypes";
import BossProfile from "../icon/BossProfile";
import PersonalityIcon from "../icon/PersonalityIcon";

const Summary = ({
    summary,
    type,
    sort = 'boss'
}: {
    summary: ClashSummary | ClashV2Summary | FrontierSummary,
    type: 'clash' | 'clashV2' | 'frontier',
    sort?: 'boss' | 'pers'
}) => {

    const sortData = type === 'clash' && sort === 'pers'
        ? personalityList.filter(p => p !== '공명')
        : type === 'clash'
            ? clashBossList
            : type === 'clashV2'
                ? clashV2BossList
                : frontierBossList;

    const TYPE_CONFIG = {
        'clash': { lineList: lineList, lineWidth: 'xs:w-[275px] w-[200px]', lineBarWidth: 'xs:w-[275px] w-[200px]' },
        'clashV2': { lineList: clashV2Category, lineWidth: 'xs:w-[400px] w-[280px]', lineBarWidth: 'xs:w-[398.5px] w-[280px]' },
        'frontier': { lineList: lineList, lineWidth: 'xs:w-[275px] w-[200px]', lineBarWidth: 'xs:w-[275px] w-[200px]' },
    }

    return (
        <div className="overflow-x-auto">
            {sortData.map((category: string, i: number) => {
                // 해당 보스명/성격과 일치하는 모든 데이터 항목을 찾고 시즌 정보도 함께 유지
                const matchingEntries = Object.entries(summary)
                    .filter(([seasonKey, data]) => {
                        const sortFilter = sort === 'boss'
                            ? data.name
                            : data.personality
                        return sortFilter === category
                    })
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
                        key={`summary_${type}_${category}`}
                        className={`px-6 py-4 min-w-[500px] ${sortData.length === i + 1 ? '' : 'border-b-4 border-gray-200 dark:border-zinc-800'}`}>
                        {/* 보스명 헤더 */}
                        {sort === 'boss' && (
                            <div className="relative flex items-center mb-4">
                                <h3 className="absolute z-20 text-xl font-bold dark:text-zinc-200">{category}</h3>
                                <BossProfile
                                    name={category}
                                    personality={
                                        category === '흑화 영춘' ? '광기'
                                            : category === '냥만 타워' ? '순수'
                                                : category === '릴1리' ? '순수'
                                                    : category === '크르브르스' ? '활발'
                                                        : (category === '크레용사용' && type === 'clash') ? '냉정'
                                                            : undefined
                                    }
                                />
                            </div>
                        )}
                        {sort === 'pers' && (
                            <div className="flex gap-x-2">
                                <div
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content={category}
                                    className={`w-[28px] text-[13px] font-bold text-${category} whitespace-nowrap cursor-pointer`}>
                                    <PersonalityIcon personality={category} size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-4 dark:text-zinc-200">
                                    {category}
                                </h3>
                            </div>
                        )}

                        {/* 셰이디의 차원, 림의 이면세계 / 후열 중열 전열 */}
                        {matchingEntries.length !== 0 && (
                            <div className="w-full mb-1 flex items-center">
                                {/* 왼쪽 여백을 위한 빈 div */}
                                <div className={`${type === 'clashV2' && 'mr-2'} w-[90px] flex-shrink-0`} />
                                <div
                                    className={`flex items-center justify-start text-[13px] text-gray-600 dark:text-zinc-400 ${type === 'clashV2' ? 'gap-x-10' : 'gap-x-[10px]'}`}>
                                    {TYPE_CONFIG[type].lineList.map(c => (
                                        <div
                                            key={`line_text_` + c}
                                            className={`${TYPE_CONFIG[type].lineWidth}`}>
                                            {c}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 데이터가 없는 보스의 경우 빈 차트 한 세트만 표시 */}
                        {matchingEntries.length === 0 ? (
                            <div className="flex gap-8 mb-1 text-[12px] text-gray-600 dark:text-zinc-200">
                                준비 중입니다.
                            </div>
                        ) : (
                            // 데이터가 있는 경우 각 시즌의 바 차트를 세로로 배치
                            matchingEntries.map((entry, entryIndex) => {
                                const { season, seasonData } = entry;

                                const seasonTooltip = (seasonData.rules ?? seasonData.power ?? []).join("\n");

                                // console.log("seasonData", seasonData)

                                return (
                                    <div key={`${category}_season_${season}`} className={`flex h-[24px] mt-[-1px]`}>
                                        {/* 시즌 정보 */}
                                        <div className="w-full mb-1 flex items-center h-full">
                                            {/* 마진 8px + 너비 80px */}
                                            <div className={`min-w-[90px] flex items-center dark:text-zinc-200 ${type === 'frontier' ? 'gap-x-1' : 'gap-x-2'} ${type === 'clashV2' && 'mr-2'}`}>
                                                <div
                                                    data-tooltip-id="my-tooltip"
                                                    data-tooltip-content={`${seasonData?.startDate} ~ ${seasonData?.endDate}`}
                                                    className="hover:text-gray-400 hover:dark:text-zinc-400 whitespace-nowrap min-w-[24px] w-[24px] flex items-center font-bold text-[14px] cursor-pointer">
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
                                                {type === 'frontier' && (
                                                    <div
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content={`${seasonTooltip}`}
                                                        className="hover:text-gray-400 w-[64px] min-w-[64px] whitespace-nowrap font-bold text-[13px] cursor-pointer">
                                                        교주의권능
                                                    </div>
                                                )}
                                                {(type === 'clash' || type === 'clashV2') && (
                                                    <div
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content={`${seasonTooltip}`}
                                                        className="hover:text-gray-400 hover:dark:text-zinc-400 relative min-w-[24px] w-[24px] whitespace-nowrap font-bold text-[13px] cursor-pointer flex items-center">
                                                        규칙
                                                    </div>
                                                )}
                                                {type === 'clashV2' ? (
                                                    <div
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content={seasonData?.personality}
                                                        className={`min-w-[28px] w-[28px] text-[13px] font-bold text-${seasonData?.personality} whitespace-nowrap cursor-pointer`}>
                                                        <PersonalityIcon personality={seasonData?.personality} size={20} />
                                                    </div>
                                                ) : type === 'clash' ? (
                                                    sort === 'boss' ? (
                                                        <div data-tooltip-id="my-tooltip" data-tooltip-content={seasonData?.personality}
                                                            className={`min-w-[28px] w-[28px] text-[13px] font-bold text-${seasonData?.personality} whitespace-nowrap cursor-pointer`}>
                                                            <PersonalityIcon personality={seasonData?.personality} size={20} />
                                                        </div>
                                                    ) : (
                                                        <div data-tooltip-id="my-tooltip" data-tooltip-content={seasonData?.name}
                                                            className="min-w-[28px] w-[28px] text-[12px] hover:text-gray-400 hover:dark:text-zinc-400 font-bold whitespace-nowrap cursor-pointer break-all overflow-hidden">
                                                            {seasonData?.name === "크레용사용" ? '용사' : seasonData?.name.slice(0, 2)}
                                                        </div>
                                                    )
                                                ) : (<></>)}
                                            </div>

                                            {/* 림의 이면세계/셰이디의 차원, 전/중/후열 라인바차트 */}
                                            {type === 'clashV2' ? (
                                                <div className={`flex gap-x-10`}>
                                                    <div className={`${TYPE_CONFIG[type].lineBarWidth} flex`}>
                                                        <LineBarComponent
                                                            data={seasonData.summary}
                                                            season={Number(season)}
                                                            type="clashV2"
                                                        />
                                                    </div>
                                                    <div className={`${TYPE_CONFIG[type].lineBarWidth} flex`}>
                                                        <LineBarComponent
                                                            data={seasonData.sideSummary}
                                                            season={Number(season)}
                                                            type="clashV2"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`flex gap-x-[10px]`}>
                                                    {TYPE_CONFIG[type].lineList.map((l) => (
                                                        <div
                                                            key={`${l}_season_${season}`}
                                                            className={`${TYPE_CONFIG[type].lineBarWidth} flex flex-shrink-0 flex-grow-0`}
                                                        >
                                                            <LineBarComponent
                                                                data={seasonData.summary}
                                                                line={l}
                                                                season={Number(season)}
                                                                type={type as "clash" | "frontier"}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )
            })}
        </div>
    );
}

export default Summary;