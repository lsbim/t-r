import { useCallback, useEffect, useMemo, useState } from "react";
import SimFacilityInput from "../../components/sim/SimFacilityInput";
import SimResearchInput from "../../components/sim/SimResearchInput";
import SimResult from "../../components/sim/SimResult";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import TopRemote from "../../layouts/TopRemote";
import { FacilitySimRequest, ResearchSimRequest, SimResponse } from "../../types/sim/simTypes";
import { createIntegratedPlan, simFacility, simResearch } from "../../utils/simFuntions";
import MyAccordion from "../../commons/rdx/MyAccordion";
import { debounce } from "es-toolkit";
import ItemIcon from "../../commons/icon/ItemIcon";
import useTitle from "../../hooks/useTitle";
import MaterialBag from "../../components/shared/MaterialBag";

const simInputArr = ['교단 시설', '연구실']

const initSimFacilityInput: FacilitySimRequest = {
    type: 'facility',
    currentLab: 1,
    currentHall: 1,
    currentHq: 1,
    currentAdv: 1,
    target: {
        lab: 1,
        hall: 1,
        hq: 1,
        adv: 1,
    }
}
const initResearch: ResearchSimRequest = {
    type: 'research',
    currentTier: 1,
    currentStep: 1,
    target: {
        tier: 1,
        step: 1,
    }
}

const SimIndexPage = () => {
    // simInput으로 input을 통합할 시 모든 자식이 새로 마운트 되면서 슬라이더에 버벅임이 발생함
    const [facilityInput, setFacilityInput] = useState<FacilitySimRequest>(initSimFacilityInput);
    const [researchInput, setResearchInput] = useState<ResearchSimRequest>(initResearch)
    const [facilitySimResult, setFacilitySimResult] = useState<SimResponse[]>([]);
    const [researchSimResult, setResearchSimResult] = useState<SimResponse[]>([]);
    const [selectInput, setSelectInput] = useState(0)
    const [inventory, setInventory] = useState<Map<string, number>>(new Map());
    const [bagOpen, setBagOpen] = useState(false);
    useTitle("교단 시설 및 연구 재화 계산");

    // console.log(facilityInput)

    // 통합 sim 함수
    const debouncedAllSims = useMemo(() => {
        return debounce((
            facilityReq: FacilitySimRequest,
            researchReq: ResearchSimRequest,
            initialInventory: Map<string, number>
        ) => {

            let currentInventory = new Map(initialInventory || []);
            let facilityResult: SimResponse[] = [];
            let researchResult: SimResponse[] = [];

            const facilitySimOutput = simFacility(facilityReq, currentInventory);
            if (facilitySimOutput) {
                facilityResult = facilitySimOutput.result;
                currentInventory = facilitySimOutput.remainingInventory || new Map();
            }

            const researchSimOutput = simResearch(
                { ...researchReq, currentAdv: facilityReq.currentAdv },
                currentInventory
            );
            if (researchSimOutput) {
                researchResult = researchSimOutput;
            }

            setFacilitySimResult(facilityResult);
            setResearchSimResult(researchResult);

        }, 300);
    }, []);

    // input과 인벤토리가 바뀌면 sim 함수 동작
    useEffect(() => {
        if (facilityInput !== initSimFacilityInput || researchInput !== initResearch || inventory.size > 0) {
            debouncedAllSims(facilityInput, researchInput, inventory);
        }
    }, [facilityInput, researchInput, inventory]);

    // 언마운트 시 디바운스 취소
    useEffect(() => {
        return () => {
            if (typeof (debouncedAllSims as any).cancel === 'function') {
                (debouncedAllSims as any).cancel();
            }
        };
    }, [debouncedAllSims]);

    // 시설 결과 + 연구 결과 통합
    const allResult: SimResponse | null = useMemo(() => {
        const allMatMap = new Map();

        facilitySimResult?.forEach(fsr => {
            fsr?.result?.acquisitionPlans?.forEach(plan => {
                if (allMatMap.has(plan?.material)) {
                    allMatMap.set(plan?.material, allMatMap.get(plan?.material) + plan?.quantity);
                } else {
                    allMatMap.set(plan?.material, plan?.quantity);
                }
            })
            if (fsr.gold) {
                allMatMap.set('gold', (allMatMap.get('gold') || 0) + fsr.gold);
            }
        })
        researchSimResult?.forEach(rsr => {
            rsr?.result?.acquisitionPlans?.forEach(plan => {
                if (allMatMap.has(plan?.material)) {
                    allMatMap.set(plan?.material, allMatMap.get(plan?.material) + plan?.quantity);
                } else {
                    allMatMap.set(plan?.material, plan?.quantity);
                }
            })
            if (rsr.gold) {
                allMatMap.set('gold', (allMatMap.get('gold') || 0) + rsr.gold);
            }
        })

        if (allMatMap.size < 1) return null;

        const plans = createIntegratedPlan(facilityInput.currentAdv, allMatMap, inventory);

        return {
            gold: allMatMap.get('gold'),
            name: '종합',
            result: plans
        };
    }, [facilitySimResult, researchSimResult])

    const items = useMemo(() => {
        return [
            {
                id: 'sim_result_2',
                header: (
                    <div className="font-bold">
                        시설 레벨별
                    </div>
                ),
                content: facilitySimResult && facilitySimResult.length > 0 ? (
                    <div className="lg:w-[992px] w-full mx-auto flex flex-wrap gap-y-4 justify-between overflow-x-auto bg-gray-200">
                        {facilitySimResult.map((sim) => (
                            <SimResult
                                key={`${sim.krName}-${sim.numlvl}`}
                                simResult={sim}
                                type={sim.name}
                            />
                        ))}
                    </div>
                ) : null // jsx 반환 시 &&로 false 반환 보단 null이 더 낫다고 함
            }, {
                id: 'sim_result_1',
                header: (
                    <div className="font-bold">
                        연구 단계별
                    </div>
                ),
                content: researchSimResult && researchSimResult.length > 0 ? (
                    <div className="lg:w-[992px] w-full mx-auto flex flex-wrap gap-y-4 justify-between overflow-x-auto bg-gray-200">
                        {researchSimResult.map((sim) => (
                            <SimResult
                                key={`${sim.krName}-${sim.numlvl}`}
                                simResult={sim}
                                type={sim.name}
                            />
                        ))}
                    </div>
                ) : null
            }
        ];
    }, [facilitySimResult, researchSimResult])

    const handleBagOpen = useCallback(() => {
        setBagOpen((prev) => (!prev));
    }, [])

    const handleInventory = useCallback((name: string, value?: number) => {
        setInventory((prev) => {

            if (name === 'clear') {
                return new Map();
            }

            const next = new Map(prev);
            const newQty = value ?? 1;


            if (newQty <= 0) {
                next.delete(name)
            }
            else {
                next.set(name, newQty)
            }

            return next;
        })
    }, []);

    return (
        // 하위 요소가 너비를 뚫어 빈 공간이 생기므로 overflow-hidden 적용
        <div className="flex flex-col justify-center gap-y-4 min-h-[100.5vh] w-full overflow-hidden">
            <TopRemote />
            <HeaderNav />
            {/* 소개 */}
            <div className="lg:w-[992px] w-full mx-auto flex flex-col xs:flex-row bg-white p-4 shadow-md mt-4">
                <div className="flex flex-col">
                    <div className="flex flex-col justify-start mb-3">
                        <h1 className="text-[20px] font-bold mr-2">교단 재화 계산</h1>
                        <span className="flex text-[14px]">교단의 시설 레벨업 및 연구 목표에 도달하기 위한 재화를 계산합니다.</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <div className="flex-col flex gap-y-1">
                            <span className="text-[12px] text-orange-500 font-bold">
                                모험은 2, 3, 4레벨 획득량을 기준
                            </span>
                            <span className="text-[12px] text-orange-500 font-bold">
                                부수재료는 최소 획득량 이월
                            </span>
                            <span className="text-[12px] text-orange-500 font-bold">
                                모험회 현재 레벨에 수행이 가능한 모험만 소개
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex mt-2 relative xs:ml-auto">
                    <div className="flex flex-col items-center justify-end">
                        <div className="text-[12px] text-orange-500 font-bold mb-1">
                            가방
                        </div>
                        <div
                            className="cursor-pointer"
                            onClick={handleBagOpen}>
                            {bagOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                </svg>
                            )}
                        </div>
                        {bagOpen && (
                            <MaterialBag
                                inventory={inventory}
                                handleInventory={handleInventory}
                                handleBagOpen={handleBagOpen}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* 시설 및 연구단계 입력 */}
            <div className="lg:w-[992px] w-full mx-auto h-[490px] flex flex-col items-center bg-white p-4 shadow-md">
                <div className="flex items-center justify-between w-full mb-8">
                    {simInputArr.map((sel, idx) => (
                        <div
                            className={`mx-auto w-[50%] flex justify-center font-bold cursor-pointer ${idx === 0 && 'border-r-2 border-gray-400'} ${selectInput === idx && 'text-orange-500'}`}
                            onClick={() => {
                                if (selectInput === idx) return null;
                                setSelectInput(idx)
                            }}
                            key={`sim_select_${sel}`}>
                            {sel}
                        </div>
                    ))}
                </div>
                {selectInput === 0 ? (
                    <SimFacilityInput
                        setFacilityInput={setFacilityInput}
                        facilityInput={facilityInput} />
                ) : selectInput === 1 && (
                    <SimResearchInput
                        setResearchInput={setResearchInput}
                        researchInput={researchInput} />
                )}
            </div>
            <div className="lg:w-[992px] mx-auto flex text-[13px] text-gray-800 w-full min-h-[569px]">
                {allResult ? (
                    <SimResult
                        simResult={allResult}
                        type={'all'}
                    />
                ) : (
                    <div className="w-full gap-x-3 bg-white flex items-center justify-center text-[18px] font-bold text-gray-700">
                        <img src={`images/item/gold.png`} className="aspect-square object-center w-[60px] grayscale select-none" />
                        <span>
                            선택된 시설 또는 연구 정보가 없습니다.
                        </span>
                    </div>
                )}
            </div>
            <div className="lg:w-[992px] mx-auto flex text-[13px] text-gray-800 w-full mb-8">
                <MyAccordion
                    items={items}
                />
            </div>
            <Footer />
        </div>
    );
}

export default SimIndexPage;