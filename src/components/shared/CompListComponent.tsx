import PersonalityListComponent from "./PersonalityListComponent";
import { ClashSeasonData } from "../../types/clashTypes";
import { FrontierSeasonData } from "../../types/frontierTypes";
import { findPersonalityByName } from "../../utils/function";
import { processCompStat, processSynergyStats } from "../../utils/chartFunction";
import React from "react";
import { Virtuoso } from "react-virtuoso";

const CompListComponent = ({
    data,
    season,
    userCnt
}: {
    data: ClashSeasonData | FrontierSeasonData,
    season?: string,
    userCnt?: number
}) => {

    const compData = processCompStat(data?.data).sort((a, b) => a.rank - b.rank);
    // const compCount = compData.reduce((sum, comp) => sum + comp.count, 0);

    const synergyStats = processSynergyStats(data?.data)

    // console.log("comp count: ", compCount)
    // console.log("comp: ", compData)
    // console.log("synergy:", synergyStats)

    // const synergyItems = synergyStats.map(s => s.synergy);

    // console.log(synergyStats.length)


    return (
        <div id="compList" className="sm:flex justify-center items-start gap-4">

            {/* 조합 */}
            <div className="flex flex-col items-center bg-white dark:bg-zinc-900 dark:text-zinc-200 p-2 pt-4 mr-4 shadow-md min-w-[300px] w-full sm:w-[350px]">
                <div className="text-xl font-bold mb-2">
                    조합
                </div>
                <Virtuoso
                    style={{
                        height: "auto", // useWindowScroll 사용 시 auto 가능
                        width: "100%"
                    }}
                    useWindowScroll // 브라우저 스크롤
                    totalCount={compData.length}
                    data={compData}
                    fixedItemHeight={96}
                    itemContent={(ci, c) => {

                        return (
                            <div key={season + "_comp_" + c?.rank}
                                className={`text-[12px] font-bold px-4 pb-4`}>
                                <div className="flex w-full h-[78px] gap-x-2 text-zinc-950 dark:brightness-90">
                                    <div className="w-[25%] flex flex-col gap-y-1">
                                        {c?.back.map(b => (
                                            <div key={"back_" + season + "_comp_" + ci + b}
                                                title={b}
                                                className={`w-full bg-${findPersonalityByName(b)} p-1 flex items-center max-h-[23px]`}>
                                                <span className="truncate">
                                                    {b === "시온" ? "시온 더 다크불릿" : b}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-[25%] flex flex-col gap-y-1">
                                        {c?.mid.map(m => (
                                            <div key={"mid_" + season + "_comp_" + ci + m}
                                                title={m}
                                                className={`w-full bg-${findPersonalityByName(m)} p-1 flex items-center max-h-[23px]`}>
                                                <span className="truncate">
                                                    {m}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-[25%] flex flex-col gap-y-1">
                                        {c?.front.map(f => (
                                            <div key={"front_" + season + "_comp_" + ci + f}
                                                title={f}
                                                className={`w-full bg-${findPersonalityByName(f)} p-1 flex items-center max-h-[23px]`}>
                                                <span className="truncate">
                                                    {f}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    {userCnt && (
                                        <div className={`w-[10%] dark:text-zinc-200 flex justify-center items-center font-bold text-[14px] ml-3`}>
                                            <span>
                                                {Math.round(c?.count / userCnt * 100 * 10) / 10}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }}
                />
            </div>
            <div id="synergyList" className="flex flex-col items-center bg-white dark:bg-zinc-900 dark:text-zinc-200 p-2 pt-4 shadow-md min-w-[300px] w-full sm:w-[300px] mt-4 sm:mt-0">
                <div className="text-xl font-bold mb-2">
                    성격
                </div>
                <div>
                    {synergyStats && userCnt && synergyStats.map((per, i) => (
                        <PersonalityListComponent
                            key={"comp_personality" + season + i}
                            data={per.synergy}
                            count={per.count}
                            userCnt={userCnt}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(CompListComponent);