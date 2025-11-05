import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../commons/component/ThemeToggle";

const HeaderNav = () => {

    const { pathname } = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleToggle = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <div id="top" className={`bg-white dark:bg-zinc-900 py-4 flex justify-center items-center font-bold border-b-2 dark:border-zinc-700 w-full `}>
            <div className="lg:w-[992px] w-full mx-auto flex justify-center">
                <div className="flex items-center md:gap-x-3 gap-x-2 w-full justify-between lg:justify-center px-4">
                    {/* 로고 */}
                    <Link to="/" className="h-[26px] w-[26px] flex-shrink-0">
                        <img loading="lazy" decoding="async" src="/logo.png" className="min-w-[26px]" alt="Logo" />
                    </Link>
                    <ThemeToggle />

                    {/* PC 환경 메뉴 */}
                    <div className="hidden lg:flex text-[14px] md:text-[16px] items-center text-gray-800 dark:text-zinc-200">
                        <Link to="/clash" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/clash") ? "text-orange-500" : ""}`}>차원 대충돌</Link>
                        <Link to="/frontier" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/frontier") ? "text-orange-500" : ""}`}>엘리아스 프론티어</Link>
                        <Link to="/timeline/raid" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/timeline") ? "text-orange-500" : ""}`}>타임라인</Link>
                        <Link to="/costume" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/costume") ? "text-orange-500" : ""}`}>사복</Link>
                        <Link to="/sim" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/sim") ? "text-orange-500" : ""}`}>교단 계산</Link>
                    </div>

                    {/* 햄버거 버튼 */}
                    <div
                        onClick={handleToggle}
                        className="lg:hidden relative h-6 w-7 hover:text-orange-600 dark:text-white transition-colors duration-200 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </div>
                </div>

                {/* 햄버거 메뉴 */}
                <div
                    className={`flex flex-col text-[18px] lg:hidden fixed top-0 right-0 h-full w-64 bg-white dark:bg-zinc-900 text-gray-800 dark:text-white shadow-xl z-50 transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <Link to="/" className="h-[26px] w-[26px] flex-shrink-0 my-4 ml-4">
                        <img loading="lazy" decoding="async" src="/logo.png" className="min-w-[26px]" alt="Logo" />
                    </Link>
                    <Link to="/clash" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/clash") ? "text-orange-500" : ""}`}>차원 대충돌</Link>
                    <Link to="/frontier" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/frontier") ? "text-orange-500" : ""}`}>엘리아스 프론티어</Link>
                    <Link to="/timeline/raid" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/timeline") ? "text-orange-500" : ""}`}>타임라인</Link>
                    <Link to="/costume" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/costume") ? "text-orange-500" : ""}`}>사복</Link>
                    <Link to="/sim" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/sim") ? "text-orange-500" : ""}`}>교단 계산</Link>
                </div>

                {/* 햄버거 오픈 시 배경 어둡게 */}
                <div
                    onClick={handleToggle}
                    // inset-0 = top: 0; right: 0; bottom: 0; left: 0;. 부모의 모든 가장자리에 붙어 전 화면을 덮음
                    className={`lg:hidden fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ease-in-out ${isMenuOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"}`}
                />
            </div>
        </div>
    );
}

export default HeaderNav;