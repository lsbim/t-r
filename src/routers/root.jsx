import { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Loading from "../commons/component/Loading";

const HomePage = lazy(() => import("../pages/home/IndexPage"));
const ClashIndex = lazy(() => import("../pages/clash/IndexPage"));
const ClashSeason = lazy(() => import("../pages/clash/SeasonPage"));
const FrontierIndex = lazy(() => import("../pages/frontier/IndexPage"));
const FrontierSeason = lazy(() => import("../pages/frontier/SeasonPage"));
const Character = lazy(() => import("../pages/characters/CharacterPage"));
const RaidTimelineIndex = lazy(() => import("../pages/timeline/raid/IndexPage"));
const CostumeIndex = lazy(() => import("../pages/costume/IndexPage"));
const SimIndex = lazy(() => import("../pages/sim/SimIndexPage"));


// suspense => 컴포넌트 로딩 전까지(비동기) 보여줄 화면(fallback).
const router = createBrowserRouter([
    {
        path: "/",
        element: <Suspense fallback={<Loading />}><HomePage /></Suspense>
    },
    {
        path: "clash",
        element: <Suspense fallback={<Loading />}><ClashIndex /></Suspense>
    },
    {
        path: "clash/:season",
        element: <Suspense fallback={<Loading />}><ClashSeason /></Suspense>
    },
    {
        path: "character/:character",
        element: <Suspense fallback={<Loading />}><Character /></Suspense>
    },
    {
        path: "frontier",
        element: <Suspense fallback={<Loading />}><FrontierIndex /></Suspense>
    },
    {
        path: "frontier/:season",
        element: <Suspense fallback={<Loading />}><FrontierSeason /></Suspense>
    },
    {
        path: "timeline",
        element: <Suspense fallback={<Loading />}><Outlet /></Suspense>,
        children: [
            {
                path: "raid",
                element: <RaidTimelineIndex />
            },
        ]
    },
    {
        path: "costume",
        element: <Suspense fallback={<Loading />}><CostumeIndex /></Suspense>
    },
    {
        path: "sim",
        element: <Suspense fallback={<Loading />}><SimIndex /></Suspense>,
    },
    {
        path: "*",
        element: <Suspense fallback={<Loading />}><HomePage /></Suspense>
    }
]
    // , { basename: "/" } github pages에 사용되었음
)

export default router;