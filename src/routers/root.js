
const { Suspense, lazy } = require("react");
const { createBrowserRouter } = require("react-router-dom");

const ClashIndex = lazy(() => import("../pages/clash/IndexPage"));
const ClashSeason = lazy(() => import("../pages/clash/SeasonPage"));
const FrontierIndex = lazy(() => import("../pages/frontier/IndexPage"));
const FrontierSeason = lazy(() => import("../pages/frontier/SeasonPage"));


// suspense => 컴포넌트 로딩 전까지(비동기) 보여줄 화면(fallback).
const router = createBrowserRouter([
    {
        path: "/",
        element: <Suspense><ClashIndex /></Suspense>

    },
    {
        path: "clash/:season",
        element: <Suspense><ClashSeason /></Suspense>
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
        element: <Suspense><ClashIndex /></Suspense>
    }
]
    // , { basename: "/" } github pages에 사용되었음
)

export default router;