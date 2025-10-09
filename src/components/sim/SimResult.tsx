import React from "react";
import FacilityIcon from "../../commons/icon/FacilityIcon";
import ItemIcon from "../../commons/icon/ItemIcon";
import { SimResponse } from "../../types/sim/simTypes";
import { calculateMaxDepth } from "../../utils/simFuntions";
import SimMaterialPlan from "./SimMaterialPlan";

const SimResult = ({ simResult, type }: { simResult: SimResponse, type: string }) => {
    // console.log(simResult)

    return (
        <div className="lg:w-[49.2%] w-full flex flex-col bg-white p-3 shadow-md mt-4 overflow-x-auto gap-y-2">
            {/* 시설 명 + 소모골드 */}
            <div className="flex gap-x-5 items-center mx-auto border-b-2 pb-4">
                {type !== 'research' ? (
                    <>
                        <div className="">
                            <FacilityIcon name={simResult.name} value={simResult.numlvl} />
                        </div>
                        <div className="flex flex-col items-center gap-y-1">
                            <span className="font-bold">필요 재료</span>
                            <div className="flex gap-x-1">
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
                ) : (
                    <>
                    </>
                )}
            </div>
            {/* 요구 재료 & 계획 */}
            <div className="flex gap-x-3 mx-auto pt-2">
                {(() => {

                    // 최대 깊이 선 계산
                    const allPlanDepths = simResult.result.acquisitionPlans.map(plan =>
                        calculateMaxDepth(plan)
                    );

                    const globalMaxDepth = Math.max(...allPlanDepths);

                    return simResult.result.acquisitionPlans.map((plan, idx) => (
                        <SimMaterialPlan
                            key={`simresult_main_plan_${idx}`}
                            plan={plan}
                            idx={idx}
                            maxDepth={globalMaxDepth} // 전역 최대 깊이 전달
                        />
                    ));
                })()}
            </div>
        </div>
    );
}

export default React.memo(SimResult);