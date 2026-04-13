import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchSummaryData } from "../hooks/useRaidData";
import { TrickcalRaidEn } from "../types/trickcalTypes";

const PRELOAD_MAP = {
    'clash': {
        chunk: () => import('../pages/clash/IndexPage'),
        url: '/data/clash/summaries.json',
    },
    'clashV2': {
        chunk: () => import('../pages/clashV2/ClashV2IndexPage'),
        url: '/data/clash_v2/summaries.json',
    },
    'frontier': {
        chunk: () => import('../pages/frontier/IndexPage'),
        url: '/data/frontier/summaries.json',
    },
}

const HeaderNav = () => {

    const { pathname } = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const queryClient = useQueryClient();

    const handleToggle = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleMouseEnter = (path: 'clash' | 'clashV2' | 'frontier') => {
        const preloadData = PRELOAD_MAP[path];
        if (!preloadData) return;

        // 이미 브라우저에서 다운로드된 청크면 재 다운로드 X
        preloadData.chunk();

        // 프리로드+해당페이지 동시성 걱정 X
        queryClient.prefetchQuery({
            queryKey: [path, 'summary', undefined],
            queryFn: async () => await fetchSummaryData(path as TrickcalRaidEn, 'summary'),
            staleTime: 60 * 60 * 1000, // 1시간
        });
    };

    return (
        <header id="top" className={`bg-white dark:bg-zinc-900 py-4 flex justify-center items-center font-bold border-b-2 dark:border-zinc-700 w-full `}>
            <div className="lg:w-[992px] w-full mx-auto flex justify-center">
                <div className="flex items-center md:gap-x-3 gap-x-2 w-full justify-between lg:justify-center px-4">
                    {/* 로고 */}
                    <Link to="/" className="h-[26px] w-[26px] flex-shrink-0">
                        <img loading="lazy" decoding="async" src="/logo.png" className="min-w-[26px]" alt="Logo" />
                    </Link>

                    {/* PC 환경 메뉴 */}
                    <nav className="hidden lg:flex text-[16px] items-center text-gray-800 dark:text-zinc-200">
                        <Link to="/clash/v1"
                            onMouseEnter={() => handleMouseEnter('clash')}
                            onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/clash/v1") ? "text-orange-500" : ""}`}>차원 대충돌</Link>
                        <Link to="/clash/v2"
                            onMouseEnter={() => handleMouseEnter('clashV2')}
                            onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/clash/v2") ? "text-orange-500" : ""}`}>차원 대충돌 2.0</Link>
                        <Link to="/frontier"
                            onMouseEnter={() => handleMouseEnter('frontier')}
                            onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/frontier") ? "text-orange-500" : ""}`}>엘리아스 프론티어</Link>
                        <Link to="/timeline/raid" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/timeline") ? "text-orange-500" : ""}`}>타임라인</Link>
                        <Link to="/costume" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/costume") ? "text-orange-500" : ""}`}>사복</Link>
                        <Link to="/sim" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/sim") ? "text-orange-500" : ""}`}>교단 계산</Link>
                    </nav>

                    {/* 햄버거 버튼 */}
                    <button
                        onClick={handleToggle}
                        className="lg:hidden relative h-6 w-7 hover:text-orange-600 dark:text-white transition-colors duration-200 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>

                {/* 햄버거 메뉴 */}
                <nav
                    className={`flex flex-col text-[18px] lg:hidden fixed top-0 right-0 h-full w-64 bg-white dark:bg-zinc-900 text-gray-800 dark:text-white shadow-xl z-50 transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <Link to="/" className="h-[26px] w-[26px] flex-shrink-0 my-4 ml-4">
                        <img loading="lazy" decoding="async" src="/logo.png" className="min-w-[26px]" alt="Logo" />
                    </Link>
                    <Link to="/clash/v1" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/clash/v1") ? "text-orange-500" : ""}`}>차원 대충돌</Link>
                    <Link to="/clash/v2" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/clash/v2") ? "text-orange-500" : ""}`}>차원 대충돌 2.0</Link>
                    <Link to="/frontier" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/frontier") ? "text-orange-500" : ""}`}>엘리아스 프론티어</Link>
                    <Link to="/timeline/raid" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/timeline") ? "text-orange-500" : ""}`}>타임라인</Link>
                    <Link to="/costume" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/costume") ? "text-orange-500" : ""}`}>사복</Link>
                    <Link to="/sim" onClick={() => setIsMenuOpen(false)} className={`px-4 py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/sim") ? "text-orange-500" : ""}`}>교단 계산</Link>
                </nav>

                {/* 햄버거 오픈 시 배경 어둡게 */}
                <div
                    onClick={handleToggle}
                    // inset-0 = top: 0; right: 0; bottom: 0; left: 0;. 부모의 모든 가장자리에 붙어 전 화면을 덮음
                    className={`lg:hidden fixed inset-0  bg-black/30 z-40 transition-opacity duration-300 ease-in-out ${isMenuOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"}`}
                />
            </div>
        </header>
    );
}

export default HeaderNav;