import SEO from "../../commons/component/SEO";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";

const ClashStatsIndex = () => {
    return (
        <div className="flex flex-col items-center min-h-[100.5vh]">
            <SEO
                title="차원 대충돌 통계"
                description="트릭컬 리바이브의 차원 대충돌 통계 자료를 제공합니다."
            />
            <HeaderNav />

            <Footer />
        </div>
    );
}

export default ClashStatsIndex;