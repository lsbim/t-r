import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../commons/component/ThemeToggle";
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
    const queryClient = useQueryClient();

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
        <header id="top" className={`relative bg-white dark:bg-zinc-900 h-[48px] flex justify-center items-center font-bold border-b border-zinc-300 dark:border-zinc-700 w-full `}>
            <div className="lg:w-[992px] w-full mx-auto flex justify-center">
                {/* overflow-x-auto와 justify-center 같이 쓰지 X */}
                <div className="flex lg:justify-center items-center lg:pl-0 lg:pr-0 pl-[30px] pr-[50px] gap-x-5 w-full overflow-x-auto scrollbar-hide min-w-0 whitespace-nowrap">

                    <div className="pointer-events-none absolute inset-y-0 left-0 w-[30px] z-10 bg-gradient-to-r from-white to-transparent dark:from-zinc-900" />

                    {/* 로고 */}
                    <div className="lg:flex-1 flex">
                        <Link to="/" className="h-[26px] w-[26px]">
                            <img loading="lazy" decoding="async" src="/logo.png" className="min-w-[26px]" alt="Logo" />
                        </Link>
                    </div>

                    {/* PC 환경 메뉴 */}
                    <nav className="flex gap-x-4 text-[14px] items-center text-gray-800 dark:text-zinc-200 lg:flex mx-auto">
                        <Link to="/clash/v1"
                            onMouseEnter={() => handleMouseEnter('clash')}
                            className={` py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/clash/v1") ? "text-orange-500" : ""}`}>
                            차원 대충돌</Link>
                        <Link to="/clash/v2"
                            onMouseEnter={() => handleMouseEnter('clashV2')}
                            className={` py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/clash/v2") ? "text-orange-500" : ""}`}>
                            차원 대충돌 2.0</Link>
                        <Link
                            to="/frontier"
                            onMouseEnter={() => handleMouseEnter('frontier')}
                            className={` py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/frontier") ? "text-orange-500" : ""}`}>
                            엘리아스 프론티어
                        </Link>
                        <Link
                            to="/timeline/raid"
                            className={` py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/timeline") ? "text-orange-500" : ""}`}>
                            타임라인
                        </Link>
                        <Link
                            to="/costume"
                            className={` py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/costume") ? "text-orange-500" : ""}`}>
                            사복
                        </Link>
                        <Link
                            to="/sim"
                            className={` py-3 cursor-pointer hover:text-orange-400 transition duration-300 ${pathname.startsWith("/sim") ? "text-orange-500" : ""}`}>
                            교단 계산
                        </Link>
                    </nav>

                    <div className="lg:flex-1 flex items-center justify-end">
                        <ThemeToggle />
                    </div>

                    <div className="pointer-events-none absolute inset-y-0 right-0 w-[50px] z-10 bg-gradient-to-l from-white to-transparent dark:from-zinc-900" />
                </div>
            </div>
        </header>
    );
}

export default HeaderNav;