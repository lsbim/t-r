import AdvIcon from "../../commons/icon/AdvIcon";
import ItemIcon from "../../commons/icon/ItemIcon";
import { AdventureRequirement, MaterialAcquisitionPlan } from "../../types/sim/simTypes";
import { calculateMaxDepth } from "../../utils/simFuntions";

type SimMaterialPlanProps = {
    plan: MaterialAcquisitionPlan | null;
    idx: number;
    maxDepth: number;
    currentDepth?: number;
};


const SimMaterialPlan: React.FC<SimMaterialPlanProps> = ({
    plan,
    idx,
    maxDepth,
    currentDepth = 0
}) => {

    if (!plan) return;

    // 현재 노드의 실제 깊이 계산
    const nodeDepth = calculateMaxDepth(plan);

    // 이 노드가 차지해야 할 공백
    const remainingDepth = maxDepth - currentDepth - nodeDepth;

    // console.log(calculatedMaxDepth, nodeDepth, remainingDepth)

    return (
        <div className={`flex flex-col gap-y-5 py-1 text-[10px]`}>
            <div className="flex flex-col items-center">
                <ItemIcon name={plan.material} value={plan.quantity} />
            </div>

            {/* 하위 재료가 있는 경우 */}
            {plan?.craftingMaterials ? (
                <div className="flex gap-x-1">
                    {plan.craftingMaterials.map((subPlan, index) => (
                        <SimMaterialPlan
                            key={`simresult_sub_plan_${idx}_sub_plan_${index}`}
                            plan={subPlan}
                            idx={index}
                            maxDepth={maxDepth}
                            currentDepth={currentDepth + 1}
                        />
                    ))}
                </div>
            ) : (
                <>
                    {/* 리프 노드까지의 여백 추가 - 이 부분이 핵심! */}
                    {remainingDepth > 0 && (
                        <div style={{ height: `${remainingDepth * 60}px`, marginBottom: `${(remainingDepth - 1) * 24}px` }} />
                    )}

                    {/* 최종 획득 방법 표시 */}
                    {plan?.method === 'inventory' ? (
                        <div className="w-[110px] h-[160px] flex flex-col items-center justify-center border-4 border-[rgb(226,220,200)] bg-[rgb(248,253,242)] rounded-lg text-[16px] font-bold text-[rgb(93,61,48)]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                            </svg>
                            획득 완료
                        </div>
                    ) : plan?.method === 'impossible' ? (
                        <div className="w-[110px] h-[160px] flex flex-col items-center justify-center border-4 border-[rgb(226,220,200)] bg-[rgb(248,253,242)] rounded-lg text-[16px] font-bold text-[rgb(93,61,48)]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                            획득 불가
                        </div>
                    ) : plan?.adventures && plan.adventures.length > 0 ? (
                        <div className="flex flex-col gap-y-2">
                            {plan.adventures.map((adv, index) => (
                                <div key={`adv_${index}`}>
                                    {adventureMat(adv)}
                                </div>
                            ))}
                        </div>
                    ) : null}
                </>
            )}

        </div>
    )
}

const adventureMat = (adventure: AdventureRequirement) => {
    if (!adventure) return;

    const advText = adventure.estimatedRuns.max === adventure.estimatedRuns.min
        ? `${adventure.estimatedRuns.max}회`
        : `${adventure.estimatedRuns.max}~${adventure.estimatedRuns.min}회`

    {/* max는 최대 획득량 수급 시 모험 수행횟수이다. 값이 더 낮음 */ }
    return (
        <AdvIcon name={adventure.adventureName} text={advText} />
    )
}

export default SimMaterialPlan;