import { debounce } from "es-toolkit";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from "react";
import BlockSlide from "../../commons/component/BlockSlide";
import Slide from "../../commons/rdx/Slide";
import { research } from "../../data/research";
import { ResearchSimRequest } from "../../types/sim/simTypes";

const SimResearchInput = ({ researchInput, setResearchInput }: {
    researchInput: ResearchSimRequest,
    setResearchInput: Dispatch<SetStateAction<ResearchSimRequest>>
}) => {


    const maxTier = parseInt(Object.keys(research).at(-1)!, 10);

    // 연구 단계 변화(tier)
    const handleSlider = useCallback((num: [number, number]) => {
        const [smallVal, bigVal] = num;

        const clampedSmall = Math.max(1, Math.min(smallVal, maxTier));
        const clampedBig = Math.max(1, Math.min(bigVal, maxTier));

        setResearchInput((prev) => {
            const next = { ...prev };

            next.currentTier = clampedSmall;
            next.target.tier = clampedBig;

            if (next.currentStep > research[clampedSmall].maxStep) {
                next.currentStep = research[clampedSmall].maxStep;
            } else if (next.target.step > research[clampedBig].maxStep) {
                next.target.step = research[clampedBig].maxStep;
            }

            return next;
        });

        // 함수 내부에서 상태(or 값이 바뀌는 변수)를 참조하지 않으니 바뀔 이유 X
    }, [setResearchInput]);

    // 연구 주제 변화(step)
    const handleBlock = useCallback((current: number, target: number) => {
        // setX 내부에서 prev를 읽도록 하여 해결
        setResearchInput((prev) => {
            const next = { ...prev };

            const currentMaxStep = research[prev.currentTier].maxStep;
            const targetMaxStep = research[prev.target.tier].maxStep;

            const clampedSmall = Math.max(1, Math.min(current, currentMaxStep));
            const clampedBig = Math.max(1, Math.min(target, targetMaxStep));

            next.currentStep = clampedSmall;
            next.target.step = clampedBig;

            return next;
        });
    }, [setResearchInput])

    return (
        <div className="lg:w-[992px] w-full mx-auto flex flex-col">
            <div className="flex justify-center mb-3 md:ml-[60px] ml-[50px] dark:text-zinc-100 text-[15px] gap-x-20 w-full font-bold">
                <span>
                    현재 단계
                </span>
                <span>
                    목표 단계
                </span>
            </div>
            <div className="flex flex-col">
                <div className="mx-auto w-full flex items-center justify-center md:gap-x-10 gap-x-4">
                    {/* 연구 아이콘 */}
                    <div className="w-[80px] flex justify-center items-center">
                        <div className="bg-[rgb(150,182,97)] rounded-full p-2 w-[60px] min-h-[49.86px] relative flex justify-center items-center">
                            <img src={`/images/lab/lab.png`} />
                            <div
                                style={{
                                    textShadow: '0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255)'
                                }}
                                className="absolute font-bold bottom-[-7px] select-none text-[15px]">
                                연구실
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-start w-[240px] dark:text-zinc-100 min-h-[80px] mb-auto">
                        <div className="min-h-[20px]" />
                        <div className="w-[200px] flex gap-x-10 justify-center mx-auto font-bold text-[16px] mb-2">
                            <div className="w-[30px] flex justify-center">
                                {researchInput.currentTier}
                            </div>
                            <div className="w-[30px] flex justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                            <div className="w-[30px] flex justify-center">
                                {researchInput.target.tier}
                            </div>
                        </div>
                        <Slide
                            max={maxTier}
                            value={[researchInput.currentTier, researchInput.target.tier]}
                            handle={(v) => handleSlider(v)} />
                    </div>
                </div>
                <div className="mx-auto mt-4 w-full flex items-center justify-center md:gap-x-10 gap-x-4">
                    <BlockSlide
                        handle={handleBlock}
                        input={researchInput}
                    />
                </div>
            </div>
        </div>
    );
}

export default React.memo(SimResearchInput);