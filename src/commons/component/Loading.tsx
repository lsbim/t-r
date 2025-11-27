import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";

const Loading = () => {

    const icons = [
        "/images/loading/hate.png",
        "/images/loading/soso.png",
        "/images/loading/like.png",
        "/images/loading/verylike.png",
    ];

    return (
        <div className="relative flex flex-col justify-center gap-4 min-h-[100.5vh]" > {/* 스크롤을 위한 100.5vh */}
            <HeaderNav />
            <div className="absolute flex items-center gap-x-2 left-1/2 -translate-x-1/2">
                {icons.map((src, index) => (
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