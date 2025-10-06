import { useCallback, useState } from "react";
import Sim from "../../components/sim/Sim";
import SimResult from "../../components/sim/SimResult";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import { SimRequest, SimResponse } from "../../types/sim/simTypes";
import { simFacility } from "../../utils/simFuntions";
import TopRemote from "../../layouts/TopRemote";

const SimIndexPage = () => {

    const [simResult, setSimResult] = useState<SimResponse[]>([])

    const handleSim = useCallback((simRequestObj?: SimRequest) => {
        if (!simRequestObj) return;

        setSimResult(
            simFacility(simRequestObj)
        );
    }, []) // 일반 함수면 무한히 계산함

    // console.log(simResult)

    return (
        <div className="flex flex-col justify-center gap-4 min-h-[100.5vh]">
            <TopRemote />
            <HeaderNav />
            {/* 소개 */}
            <div className="lg:w-[992px] w-full mx-auto flex flex-col bg-white p-4 shadow-md mt-4 overflow-x-auto">
                <div className="flex flex-col justify-start mb-3">
                    <h1 className="text-[20px] font-bold mr-2">재화계산</h1>
                    <span className="flex text-[14px]">목표에 도달하기 위한 재화를 계산합니다.</span>
                </div>
                <div className="flex gap-x-4 items-center mb-2">
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

            <Sim handleSim={handleSim} />

            {simResult && simResult.length > 0 && (
                <div className="lg:w-[992px] w-full mx-auto flex flex-wrap justify-between overflow-x-auto">
                    {simResult.map((sim) => (
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