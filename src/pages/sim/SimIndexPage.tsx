import { useCallback, useState } from "react";
import SimFacilityInput from "../../components/sim/SimFacilityInput";
import SimResearchInput from "../../components/sim/SimResearchInput";
import SimResult from "../../components/sim/SimResult";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import TopRemote from "../../layouts/TopRemote";
import { FacilitySimRequest, ResearchSimRequest, SimResponse } from "../../types/sim/simTypes";
import { simFacility } from "../../utils/simFuntions";

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
    // simResult는 통합으로 추후 개발, 시설/연구 결과(상세)는 각각 아코디언에 담을 예정
    const [facilitySimResult, setFacilitySimResult] = useState<SimResponse[]>([]);
    const [researchSimResult, setResearchSimResult] = useState<SimResponse[]>([]);
    const [selectInput, setSelectInput] = useState(0)

    const handleSim = useCallback((simRequestObj?: ResearchSimRequest | FacilitySimRequest) => {
        if (!simRequestObj) return;

        if (simRequestObj.type === 'research') {
            setResearchSimResult(
                simFacility(simRequestObj)
            );
        } else if (simRequestObj.type === 'facility') {
            setFacilitySimResult(
                simFacility(simRequestObj)
            );
        }
    }, [simInputArr]) // 일반 함수면 무한히 계산함

    // console.log(simResult)
    // console.log(simInput)
    
    console.log(researchInput)

    return (
        <div className="flex flex-col justify-center gap-y-4 min-h-[100.5vh] w-full">
            <TopRemote />
            <HeaderNav />
            {/* 소개 */}
            <div className="lg:w-[992px] w-full mx-auto flex flex-col bg-white p-4 shadow-md mt-4 overflow-x-auto">
                <div className="flex flex-col justify-start mb-3">
                    <h1 className="text-[20px] font-bold mr-2">재화계산</h1>
                    <span className="flex text-[14px]">목표에 도달하기 위한 재화를 계산합니다.</span>
                </div>
                <div className="flex items-center mb-2">
                    <div className="flex-col flex">
                        <span className="text-[12px] text-orange-500 font-bold">
                            모험은 2, 3, 4레벨 획득량을 기준
                        </span>
                        <span className="text-[12px] text-orange-500 font-bold">
                            부수재료는 최소 획득량 이월
                        </span>
                    </div>
                </div>
            </div>

            {/* 시설 및 연구단계 입력 */}
            <div className="lg:w-[992px] w-full mx-auto h-[490px] flex flex-col items-center bg-white p-4 shadow-md mt-4">
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
                        handleSim={handleSim}
                        setFacilityInput={setFacilityInput}
                        facilityInput={facilityInput} />
                ) : selectInput === 1 && (
                    <SimResearchInput
                        handleSim={handleSim}
                        setResearchInput={setResearchInput}
                        researchInput={researchInput} />
                )}
            </div>

            {facilitySimResult && facilitySimResult.length > 0 && (
                <div className="lg:w-[992px] w-full mx-auto flex flex-wrap justify-between overflow-x-auto">
                    {facilitySimResult.map((sim) => (
                        <SimResult
                            key={`${sim.krName}-${sim.numlvl}`}
                            simResult={sim}
                            type={sim.name}
                        />
                    ))}
                </div>
            )}
            {researchSimResult && researchSimResult.length > 0 && (
                <div className="lg:w-[992px] w-full mx-auto flex flex-wrap justify-between overflow-x-auto">
                    {researchSimResult.map((sim) => (
                        <SimResult
                            key={`${sim.krName}-${sim.numlvl}`}
                            simResult={sim}
                            type={sim.name}
                        />
                    ))}
                </div>
            )}
            <Footer />
        </div>
    );
}

export default SimIndexPage;