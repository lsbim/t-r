import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate, Outlet, redirect } from "react-router-dom";
import Loading from "../commons/component/Loading";
import { charInfo } from "../data/trickcalChar";

const HomePage = lazy(() => import("../pages/home/IndexPage"));
const ClashIndex = lazy(() => import("../pages/clash/IndexPage"));
const ClashSeason = lazy(() => import("../pages/clash/SeasonPage"));
const ClashV2Index = lazy(() => import("../pages/clashV2/ClashV2IndexPage"));
const ClashV2Season = lazy(() => import("../pages/clashV2/ClashV2SeasonPage"));
const FrontierIndex = lazy(() => import("../pages/frontier/IndexPage"));
const FrontierSeason = lazy(() => import("../pages/frontier/SeasonPage"));
const Character = lazy(() => import("../pages/characters/CharacterPage"));
const RaidTimelineIndex = lazy(() => import("../pages/timeline/raid/IndexPage"));
const CostumeIndex = lazy(() => import("../pages/costume/IndexPage"));
const SimIndex = lazy(() => import("../pages/sim/SimIndexPage"));

const ErrorPage = lazy(() => import("../pages/error/ErrorPage"));


// suspense => 컴포넌트 로딩 전까지(비동기) 보여줄 화면(fallback).
const router = createBrowserRouter([
    {
        path: "/",
        element: <Suspense fallback={<Loading />}><HomePage /></Suspense>,
        errorElement: <ErrorPage />
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
                element: null
            },
            {
                path: "v1",
                element: <Suspense fallback={<Loading />}><ClashIndex /></Suspense>,
                errorElement: <ErrorPage />
            },
            {
                path: "v1/:season",
                element: <Suspense fallback={<Loading />}><ClashSeason /></Suspense>,
                errorElement: <ErrorPage />
            },
            {
                path: "v2",
                element: <Suspense fallback={<Loading />}><ClashV2Index /></Suspense>,
                errorElement: <ErrorPage />
            },
            {
                path: "v2/:season",
                element: <Suspense fallback={<Loading />}><ClashV2Season /></Suspense>,
                errorElement: <ErrorPage />
            },
        ],
        errorElement: <ErrorPage />
    },
    {
        path: "frontier",
        element: <Suspense fallback={<Loading />}><FrontierIndex /></Suspense>,
        errorElement: <ErrorPage />
    },
    {
        path: "frontier/:season",
        element: <Suspense fallback={<Loading />}><FrontierSeason /></Suspense>,
        errorElement: <ErrorPage />
    },
    {
        path: "character/:character",
        element: <Suspense fallback={<Loading />}><Character /></Suspense>,
        errorElement: <ErrorPage />,
        // 존재하지 않는 사도명이 패스파라미터에 들어오면 404 에러페이지로
        loader: async ({ params }) => {
            const charaName = params.character;
            const info = charInfo[charaName]
            if (!info) {
                throw new Response("Not Found Character", { status: 404 });
            }
        }
    },
    {
        path: "timeline",
        element: <Suspense fallback={<Loading />}><Outlet /></Suspense>,
        children: [
            {
                index: true,
                element: <Navigate to="raid" replace />
            },
            {
                path: "raid",
                element: <RaidTimelineIndex />
            },
        ],
        errorElement: <ErrorPage />
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
    }
    // ,
    // {
    //     path: "*",
    //     element: <Suspense fallback={<Loading />}><HomePage /></Suspense>
    // }
]
    // , { basename: "/" } github pages에 사용되었음
)

export default router;