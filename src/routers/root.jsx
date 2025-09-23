import { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

const HomePage = lazy(() => import("../pages/home/IndexPage"));
const ClashIndex = lazy(() => import("../pages/clash/IndexPage"));
const ClashSeason = lazy(() => import("../pages/clash/SeasonPage"));
const FrontierIndex = lazy(() => import("../pages/frontier/IndexPage"));
const FrontierSeason = lazy(() => import("../pages/frontier/SeasonPage"));
const Character = lazy(() => import("../pages/characters/CharacterPage"));
const RaidTimelineIndex = lazy(() => import("../pages/timeline/raid/IndexPage"));
const CostumeIndex = lazy(() => import("../pages/costume/IndexPage"));
const LabSimIndex = lazy(() => import("../pages/sim/lab/LabIndexPage"));


// suspense => 컴포넌트 로딩 전까지(비동기) 보여줄 화면(fallback).
const router = createBrowserRouter([
    {
        path: "/",
        element: <Suspense><HomePage /></Suspense>
    },
    {
        path: "clash",
        element: <Suspense><ClashIndex /></Suspense>
    },
    {
        path: "clash/:season",
        element: <Suspense><ClashSeason /></Suspense>
    },
    {
        path: "character/:character",
        element: <Suspense><Character /></Suspense>
    },
    {
        path: "frontier",
        element: <Suspense><FrontierIndex /></Suspense>
    },
    {
        path: "frontier/:season",
        element: <Suspense><FrontierSeason /></Suspense>
    },
    {
        path: "timeline",
        element: <Suspense><Outlet /></Suspense>,
        children: [
            {
                path: "raid",
                element: <RaidTimelineIndex />
            },
        ]
    },
    {
        path: "costume",
        element: <CostumeIndex />
    },
    {
        path: "sim",
        element: <Suspense><Outlet /></Suspense>,
        children: [
            {
                path: "lab",
                element: <LabSimIndex />
            },
        ]
    },
    {
        path: "*",
        element: <Suspense><HomePage /></Suspense>
    }
]
    // , { basename: "/" } github pages에 사용되었음
)

export default router;