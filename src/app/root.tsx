import { parseResonanceBaseName } from "@/utils/resonanceFunction";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet, redirect, ScrollRestoration } from "react-router-dom";
import { charInfo } from "../data/trickcalChar";
import Loading from "../layouts/Loading";
import SEO, { CharacterSEO, RaidIndexSEO, RaidSeasonSEO } from "@/components/SEO";

const HomePage = lazy(() => import("../features/home/pages/IndexPage"));

const ClashIndex = lazy(() => import("../features/raid/clash/pages/IndexPage"));
const ClashSeason = lazy(() => import("../features/raid/clash/pages/SeasonPage"));

const ClashV2Index = lazy(() => import("../features/raid/clashV2/pages/ClashV2IndexPage"));
const ClashV2Season = lazy(() => import("../features/raid/clashV2/pages/ClashV2SeasonPage"));

const FrontierIndex = lazy(() => import("../features/raid/frontier/pages/IndexPage"));
const FrontierSeason = lazy(() => import("../features/raid/frontier/pages/SeasonPage"));

const RaidTimelineIndex = lazy(() => import("../features/timeline/pages/IndexPage"));

const CostumeIndex = lazy(() => import("../features/costume/pages/IndexPage"));

const SimIndex = lazy(() => import("../features/sim/pages/SimIndexPage"));

const CharacterIndex = lazy(() => import("../features/character/pages/CharacterPage"));

const ErrorPage = lazy(() => import("./ErrorPage"));

// 추후 HeaderNav랑 Footer 넣어도 됨
const RootLayout = () => {
    return (
        <>
            <Outlet />
            <ScrollRestoration /> {/* 사용자 스크롤 위치를 기억하고 복구 */}
        </>
    );
};

// suspense => 컴포넌트 로딩 전까지(비동기) 보여줄 화면(fallback).
const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <>
                    <SEO />
                    <Suspense fallback={<Loading />}>
                        <HomePage />
                    </Suspense>
                </>,
            },
            {
                path: "clash",
                element: <Suspense fallback={<Loading />}><Outlet /></Suspense>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="v1" replace />
                    },
                    {
                        path: ":season",
                        loader: ({ params }) => {
                            const { season } = params;
                            // 만약 season이 v1, v2가 아니고 숫자라면 v1 주소로 리다이렉트
                            if (season && !isNaN(Number(season))) {
                                return redirect(`/clash/v1/${season}`);
                            }
                            return null;
                        },
                        element: <ErrorPage />
                    },
                    /* 
                        useSuspenseQuery는 데이터 로딩 전까지 렌더링 되지 않으므로
                        SEO를 Suspense 바깥으로 배치
                    */
                    {
                        path: "v1",
                        element: <>
                            <RaidIndexSEO raidType="clash" />
                            <Suspense fallback={<Loading />}>
                                <ClashIndex />
                            </Suspense>
                        </>,
                        errorElement: <ErrorPage />
                    },
                    {
                        path: "v1/:season",
                        element: <>
                            <RaidSeasonSEO raidType="clash" />
                            <Suspense fallback={<Loading />}>
                                <ClashSeason />
                            </Suspense>
                        </>,
                        errorElement: <ErrorPage />
                    },
                    {
                        path: "v2",
                        element: <>
                            <RaidIndexSEO raidType="clashV2" />
                            <Suspense fallback={<Loading />}>
                                <ClashV2Index />
                            </Suspense>
                        </>,
                        errorElement: <ErrorPage />
                    },
                    {
                        path: "v2/:season",
                        element: <>
                            <RaidSeasonSEO raidType="clashV2" />
                            <Suspense fallback={<Loading />}>
                                <ClashV2Season />
                            </Suspense>
                        </>,
                        errorElement: <ErrorPage />
                    },
                ],
                errorElement: <ErrorPage />
            },
            {
                path: "frontier",
                element: <>
                    <RaidIndexSEO raidType="frontier" />
                    <Suspense fallback={<Loading />}>
                        <FrontierIndex />
                    </Suspense></>,
                errorElement: <ErrorPage />
            },
            {
                path: "frontier/:season",
                element: <>
                    <RaidSeasonSEO raidType="frontier" />
                    <Suspense fallback={<Loading />}>
                        <FrontierSeason />
                    </Suspense>
                </>,
                errorElement: <ErrorPage />
            },
            {
                path: "timeline",
                element: <>
                    <SEO
                        title="콘텐츠 출시 타임라인"
                        description="트릭컬 리바이브의 차원 대충돌, 엘리아스 프론티어, 사도 출시일 타임라인을 제공합니다."
                    />
                    <Suspense fallback={<Loading />}>
                        <RaidTimelineIndex />
                    </Suspense>
                </>,
                errorElement: <ErrorPage />
            },
            {
                path: "timeline/raid",
                element: <Navigate to="/timeline" replace />
            },
            {
                path: "costume",
                element: <Suspense fallback={<Loading />}><CostumeIndex /></Suspense>,
                errorElement: <ErrorPage />
            },
            {
                path: "sim",
                element: <Suspense fallback={<Loading />}><SimIndex /></Suspense>,
                errorElement: <ErrorPage />
            },
            {
                path: "character",
                element: <Suspense fallback={<Loading />}><Outlet /></Suspense>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/" replace />
                    },
                    {
                        path: ":charName",
                        loader: ({ params }) => {
                            const { charName } = params;
                            if (!charName || !charInfo[charName] || parseResonanceBaseName(charName)) {
                                throw new Response('해당 사도를 찾을 수 없습니다.', { status: 404 });
                            }
                            return null;
                        },
                        element: <>
                            <CharacterSEO />
                            <Suspense fallback={<Loading />}>
                                <CharacterIndex />
                            </Suspense>
                        </>,
                        errorElement: <ErrorPage />
                    },
                ]
            },
            {
                path: "*",
                loader: () => {
                    throw new Response('페이지를 찾을 수 없습니다.', { status: 404 });
                },
                element: null,
                errorElement: <ErrorPage />
            }
        ]
    },

]
    // , { basename: "/" } github pages에 사용되었음
)

export default router;