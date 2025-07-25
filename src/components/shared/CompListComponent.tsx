import PersonalityListComponent from "./PersonalityListComponent";
import { ClashSeasonData } from "../../types/clashTypes";
import { FrontierSeasonData } from "../../types/frontierTypes";
import { findPersonalityByName } from "../../utils/function";
import { processCompStat, processSynergyStats } from "../../utils/chartFunction";

const CompListComponent = ({ data, season, userCnt }: { data: ClashSeasonData | FrontierSeasonData, season?: string, userCnt?: number }) => {

    const compData = processCompStat(data?.data).sort((a, b) => a.rank - b.rank);
    // const compCount = compData.reduce((sum, comp) => sum + comp.count, 0);

    const synergyStats = processSynergyStats(data?.data)

    // console.log("comp count: ", compCount)
    // console.log("comp: ", compData)
    // console.log("synergy:", synergyStats)

    // const synergyItems = synergyStats.map(s => s.synergy);

    // console.log(synergyItems)


    return (
        <div id="compList" className="sm:flex justify-center items-start gap-4">

            {/* 조합 */}
            <div className="flex flex-col items-center bg-white p-2 pt-4 mr-4 shadow-md min-w-[300px] w-full sm:w-[350px]">
                <div className="text-xl font-bold mb-2">
                    조합
                </div>
                {compData.map((c, ci) => {
                    // if (c?.count < 2) return;

                    // 조합끼리 y축 gap은 mb-8
                    return (
                        <div key={"clash" + season + "comp" + c?.rank}
                            className={`w-full h-[78px] flex text-[12px] mb-8 sm:mb-4 gap-x-2 font-bold px-4`}>
                            <div className="w-[25%] flex flex-col gap-y-1">
                                {c?.back.map(b => (
                                    <div key={"clash" + season + "comp" + ci + b}
                                        title={b}
                                        className={`w-full bg-${findPersonalityByName(b)} p-1 truncate flex items-center max-h-[23px]`}>
                                        {b === "시온" ? "시온 더 다크불릿" : b}
                                    </div>
                                ))}
                            </div>
                            <div className="w-[25%] flex flex-col gap-y-1">
                                {c?.mid.map(m => (
                                    <div key={"clash" + season + "comp" + ci + m}
                                        title={m}
                                        className={`w-full bg-${findPersonalityByName(m)} p-1 truncate flex items-center max-h-[23px]`}>
                                        {m}
                                    </div>
                                ))}
                            </div>
                            <div className="w-[25%] flex flex-col gap-y-1">
                                {c?.front.map(f => (
                                    <div key={"clash" + season + "comp" + ci + f}
                                        title={f}
                                        className={`w-full bg-${findPersonalityByName(f)} p-1 truncate flex items-center max-h-[23px]`}>
                                        {f}
                                    </div>
                                ))}
                            </div>
                            {userCnt && (
                                <div className={`w-[10%] flex justify-center items-center font-bold text-[14px] ml-3`}>
                                    <span>
                                        {Math.round(c?.count / userCnt * 100 * 10) / 10}%
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                })}

            </div>
            <div id="synergyList" className="flex flex-col items-center bg-white p-2 pt-4 shadow-md min-w-[300px] w-full sm:w-[300px] mt-4 sm:mt-0">
                <div className="text-xl font-bold mb-2">
                    성격
                </div>
                <div>
                    {synergyStats && userCnt && synergyStats.map((per, i) => (
                        <PersonalityListComponent
                            key={"clash_personality" + season + i}
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

export default CompListComponent;