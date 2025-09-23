import LabInput from "../../../components/sim/lab/LabInput";
import Footer from "../../../layouts/Footer";
import HeaderNav from "../../../layouts/HeaderNav";

const LabIndexPage = () => {
    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <HeaderNav />
            {/* 소개 */}
            <div className="lg:w-[992px] w-full mx-auto flex flex-col bg-white p-4 shadow-md mt-4 overflow-x-auto">
                <div className="flex flex-col justify-start">
                    <h1 className="text-[20px] font-bold mr-2 mb-1">연구 재화계산</h1>
                    <span className="flex text-[14px]">목표 연구에 도달하기 위한 재화를 계산합니다</span>
                </div>
            </div>
            <LabInput />
            <Footer />
        </div>
    );
}

export default LabIndexPage;