import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";

const Loading = () => {
    return (
        <div className="flex flex-col justify-center gap-4 min-h-[100.5vh]" > {/* 스크롤을 위한 100.5vh */}
            <HeaderNav />
            <div />
            <Footer />
        </div >
    );
}

export default Loading;