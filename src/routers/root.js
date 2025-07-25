
const { Suspense, lazy } = require("react");
const { createBrowserRouter } = require("react-router-dom");

const HomePage = lazy(() => import("../pages/home/IndexPage"));
const ClashIndex = lazy(() => import("../pages/clash/IndexPage"));
const ClashSeason = lazy(() => import("../pages/clash/SeasonPage"));
const FrontierIndex = lazy(() => import("../pages/frontier/IndexPage"));
const FrontierSeason = lazy(() => import("../pages/frontier/SeasonPage"));
const Character = lazy(() => import("../pages/characters/CharacterPage"));


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
        path: "*",
        element: <Suspense><HomePage /></Suspense>
    }
]
    // , { basename: "/" } github pages에 사용되었음
)

export default router;