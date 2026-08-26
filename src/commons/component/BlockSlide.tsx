import { dimensionResearch, research } from "../../data/research";
import { ResearchSimRequest } from "../../types/sim/simTypes";
import { getResearchStep } from "../../utils/researchFuntion";

interface BlockSliderProps {
    input: ResearchSimRequest;
    handle: (current: number, target: number) => void;
    blockType: 'research' | 'dimension'
}

const BlockSlide = ({
    handle,
    input,
    blockType
}: BlockSliderProps) => {

    // 범위의 시작과 끝을 추적합니다
    // const [rangeMin, setRangeMin] = useState<number>(input.currentStep);
    // const [rangeMax, setRangeMax] = useState<number>(input.target.step);
    const rangeMin = input.currentStep;
    const rangeMax = input.target.step;

    const sameTier = input.currentTier === input.target.tier; // 범위로 잡은 두 연구 단계가 같은지

    const currentTierMax = maxResearchStep(input.currentTier, blockType);
    const targetTierMax = maxResearchStep(input.target.tier, blockType);

    const handleBlockMin = (blockNum: number) => {
        if (blockNum === rangeMin) return;

        const newMin = Math.min(blockNum, currentTierMax);
        let newMax = rangeMax;

        if (sameTier && newMin > newMax) {
            // min이 max보다 커지면 스왑
            newMax = newMin;
            handle(rangeMax, newMin);
        } else {
            handle(newMin, newMax);
        }
    };
    // console.log(input)

    const handleBlockMax = (blockNum: number) => {
        if (blockNum === rangeMax) return;

        const newMax = Math.min(blockNum, targetTierMax);
        let newMin = rangeMin;

        if (sameTier && newMax < newMin) {
            // max가 min보다 작아지면 스왑
            newMin = newMax;
            handle(newMax, rangeMin);
        } else {
            handle(newMin, newMax);
        }
    };

    const isMinActive = (blockNum: number) => {
        if (!sameTier) {
            // 단계가 다르면 왼쪽은 선택한 칸부터 max까지 색칠
            return blockNum >= rangeMin && blockNum <= currentTierMax;
        } else {
            // 같으면 current ~ target까지만 색칠
            const start = Math.min(rangeMin, rangeMax);
            const end = Math.max(rangeMin, rangeMax);
            return blockNum >= start && blockNum <= end;
        }
    };

    const isMaxActive = (blockNum: number) => {
        if (!sameTier) {
            // 단계가 다르면 오른쪽은 1부터 선택한 칸까지 색칠
            return blockNum >= 1 && blockNum <= rangeMax;
        } else {
            // 같으면 current ~ target까지만 색칠
            const start = Math.min(rangeMin, rangeMax);
            const end = Math.max(rangeMin, rangeMax);
            return blockNum >= start && blockNum <= end;
        }
    };

    const isMinBoundary = (blockNum: number) => blockNum === rangeMin;

    const blockTailwindClassName = (idx: number, type: 'left' | 'right') => {
        const blockNum = idx + 1;
        const active = type === 'left' ? isMinActive(blockNum) : type === 'right' && isMaxActive(blockNum);
        const boundary = type === 'left' ? isMinBoundary(blockNum) : false;

        const cls = active
            ? boundary
                ? "bg-white border-[rgb(110,142,67)] shadow-sm dark:shadow-white"
                : "bg-[rgb(150,182,97)] border-none"
            : "bg-gray-200 hover:bg-gray-300";

        return cls;
    }

    return (
        <div className="flex flex-col items-center gap-[2px]">
            {/* 오름차순 */}
            <div className="flex flex-col gap-y-2 mt-4">
                {/* min */}
                <div className="grid grid-flow-row sm:grid-cols-[repeat(25,minmax(0,auto))] grid-cols-[repeat(15,minmax(0,auto))] gap-x-1 gap-y-2">
                    {Array.from({ length: currentTierMax }, (_, index) => (
                        <div
                            key={`block_start_${index + 1}`}
                            onClick={() => handleBlockMin(index + 1)}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={getResearchStep(input.currentTier, index + 1, blockType)!.name}
                            className={`${blockTailwindClassName(index, 'left')} w-5 h-4 transition-all duration-150 cursor-pointer border-2 rounded`}
                        />
                    ))}
                </div>

                {/* 현재 선택된 범위 표시 */}
                <div className="my-2 text-sm font-semibold text-gray-700 dark:text-zinc-200 flex flex-col items-center justify-center min-h-[60px]">
                    <span>
                        {getResearchStep(input.currentTier, input.currentStep, blockType)?.name}
                    </span>
                    <div>
                        ↓
                    </div>
                    <span>
                        {getResearchStep(input.target.tier, input.target.step, blockType)?.name}
                    </span>
                </div>

                {/* max */}
                <div className="grid grid-flow-row sm:grid-cols-[repeat(25,minmax(0,auto))] grid-cols-[repeat(15,minmax(0,auto))] gap-x-1 gap-y-2">
                    {Array.from({ length: targetTierMax }, (_, index) => (
                        <div
                            key={`block_end_${index}`}
                            onClick={() => handleBlockMax(index + 1)}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={getResearchStep(input.target.tier, index + 1, blockType)!.name}
                            className={`${blockTailwindClassName(index, 'right')} w-5 h-4 transition-all duration-150 cursor-pointer border-2 rounded`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// tier가 아닌 max step
function maxResearchStep(tier: number, blockType: 'research' | 'dimension'): number {

    const researchInfo = blockType === 'research' ? research[tier] : dimensionResearch[tier];
    if (!researchInfo) return 0;

    return researchInfo.maxStep;
}

export default BlockSlide;