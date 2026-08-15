import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";

const LOADING_ICONS = [
    "/images/loading/hate.png",
    "/images/loading/soso.png",
    "/images/loading/like.png",
    "/images/loading/verylike.png",
];

const Loading = () => {

    return (
        <div className="relative flex flex-col justify-center gap-4 min-h-[100.5vh]" > {/* 스크롤을 위한 100.5vh */}
            <HeaderNav />
            <div className="absolute flex items-center gap-x-2 left-1/2 -translate-x-1/2">
                {LOADING_ICONS.map((src, index) => (
                    <img
                        key={`loading_image_${index}`}
                        src={src}
                        alt="loading"
                        className="w-[30px] h-[30px] object-contain animate-jelly"
                        style={{
                            animationDelay: `${index * 0.15}s`
                        }}
                    />
                ))}
            </div>
            <Footer />
        </div >
    );
}

export default Loading;


export const MiniLoading = () => {

    // 타임라인용 스피너(음식 호감 like 이미지)
    return (
        <div className="absolute w-full h-full flex items-center gap-x-2 inset-0 justify-center z-10 bg-[rgb(124,143,110)] dark:bg-[rgb(24,24,27)]">
            <div className="absolute top-0 left-0 w-full h-[12px] bg-white/10 pointer-events-none" />

            <img
                src={"/images/loading/like.png"}
                alt="loading"
                className="w-[60px] h-[60px] object-contain animate-spin"
            />

            <div className="absolute bottom-0 left-0 w-full h-[12px] bg-black/10 pointer-events-none" />
        </div>
    );
}