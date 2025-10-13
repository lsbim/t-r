import React from "react";
import FacilityIcon from "../../commons/icon/FacilityIcon";
import ItemIcon from "../../commons/icon/ItemIcon";
import { SimResponse } from "../../types/sim/simTypes";
import { calculateMaxDepth } from "../../utils/simFuntions";
import SimMaterialPlan from "./SimMaterialPlan";

const SimResult = ({ simResult, type }: { simResult: SimResponse, type: string }) => {

    // console.log(simResult)

    return (
        <div className="w-full flex flex-col bg-white p-3 shadow-md overflow-x-hidden">
            {/* 시설 명 + 소모골드 */}
            <div className="flex mx-auto gap-x-5 pb-4">
                {type !== 'research' ? (
                    <>
                        <div className="">
                            <FacilityIcon name={simResult.name} value={simResult.numlvl} />
                        </div>
                        <div className="flex flex-col items-center gap-y-2">
                            <span className="font-bold text-[16px]">필요 재료</span>
                            <div className="grid grid-flow-row sm:grid-cols-[repeat(8,minmax(0,auto))] grid-cols-[repeat(4,minmax(0,auto))] gap-1">
                                {simResult.gold && (
                                    <ItemIcon name="gold" value={simResult.gold} />
                                )}
                                {simResult.result.acquisitionPlans.map((matObj, idx) => (
                                    <ItemIcon
                                        key={`${simResult.krName}_${simResult.numlvl}_mainMaterial_${idx}`}
                                        name={matObj?.material!}
                                        value={matObj?.quantity} />
                                ))}
                            </div>
                        </div>
                    </>
                ) : type === 'research' && (
                    <>
                        <div className="w-[80px] flex justify-center items-center">
                            <div className="bg-[rgb(150,182,97)] rounded-full p-2 w-[60px] min-h-[49.86px] relative flex justify-center items-center">
                                <img src={`/images/lab/lab.png`} />
                                <div
                                    style={{
                                        textShadow: '0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255)'
                                    }}
                                    className="absolute font-bold bottom-[-7px] select-none text-[15px] left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                                    {simResult?.krName}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-y-2">
                            <span className="font-bold text-[16px]">필요 재료</span>
                            <div className="grid grid-flow-row grid-cols-[repeat(4,minmax(0,auto))] gap-1">
                                {simResult.gold && (
                                    <ItemIcon name="gold" value={simResult.gold} />
                                )}
                                {simResult.result.acquisitionPlans.map((matObj, idx) => (
                                    <ItemIcon
                                        key={`${simResult.krName}_${simResult.numlvl}_mainMaterial_${idx}`}
                                        name={matObj?.material!}
                                        value={matObj?.quantity} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* 요구 재료 & 계획 */}
            <div className="flex w-full overflow-x-auto border-t-2">
                <div className="flex mx-auto">
                    {(() => {

                        // 최대 깊이 선 계산
                        const allPlanDepths = simResult.result.acquisitionPlans.map(plan =>
                            calculateMaxDepth(plan)
                        );

                        const globalMaxDepth = Math.max(...allPlanDepths);

                        return simResult.result.acquisitionPlans.map((plan, idx) => (
                            <div
                                key={`simresult_main_plan_wrapper_${idx}`}
                                className={`pt-3 pb-4 px-3 ${idx % 2 === 0 ? '' : 'bg-gray-100'}`}
                            >
                                <SimMaterialPlan
                                    plan={plan}
                                    idx={idx}
                                    maxDepth={globalMaxDepth}
                                />
                            </div>
                        ));
                    })()}
                </div>
            </div>
        </div>
    );
}

export default React.memo(SimResult);