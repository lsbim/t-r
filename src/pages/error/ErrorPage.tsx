import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import SEO from "../../commons/component/SEO";
import { pageRootContainer } from "../../styles/container";
import { useEffect } from "react";

const ErrorPage = () => {

    const error = useRouteError();
    // console.log(error)

    // 새 버전 배포 중 예전 데이터를 호출하면 생기는 오류
    const isOldChunkLoadError = error instanceof Error && (
        error.message.includes('Failed to fetch dynamically imported module') ||
        error.message.includes('error loading dynamically imported module') ||
        error.message.includes('Importing a module script failed')
    );

    useEffect(() => {
        if (!isOldChunkLoadError) return;

        const lastReloadAt = Number(sessionStorage.getItem('old_chunk_reload_at') ?? 0);
        if (Date.now() - lastReloadAt < 10000) return

        sessionStorage.setItem('old_chunk_reload_at', String(Date.now()));
        window.location.reload();
    }, [isOldChunkLoadError]);


    if (isRouteErrorResponse(error)) {
        let errorTitle: string = 'ERROR';
        let errorMsg: string;
        let errorData: string = '';

        if (error.status === 404) {
            errorTitle += " 404";
            errorMsg = error.data || "페이지를 찾을 수 없습니다.";
            errorData = ""
        } else {
            errorTitle + " " + error.status;
            errorMsg = error.statusText
            errorData = error.data
        }

        return (
            <div className={`${pageRootContainer} gap-4 min-h-[100.5vh]`}>
                <SEO noindex={true} />
                <HeaderNav />
                <div className=" flex items-center justify-center flex-col mt-24">
                    <img
                        src={`/images/action/yc_sad.webp`}
                        className="aspect-square object-center w-[100px] grayscale"
                    />
                    <span className="text-[48px] font-bold text-gray-400 dark:text-zinc-200">
                        {errorTitle}
                    </span>
                    <span className="font-bold dark:text-zinc-200">
                        {errorMsg}
                    </span>
                    {errorData && (
                        <span className="font-bold dark:text-zinc-200">
                            {errorData}
                        </span>
                    )}
                    <Link to={"/"} className="p-2 round-sm text-orange-600 font-bold underline mt-4">
                        HOME
                    </Link>
                </div>
                <Footer />
            </div >
        )
    }

    return (
        <div className={`${pageRootContainer} gap-4 min-h-[100.5vh]`}>
            <SEO noindex={true} />
            <HeaderNav />
            <div className=" flex items-center justify-center flex-col mt-24">
                <img
                    src={`/images/action/yc_sad.webp`}
                    className="aspect-square object-center w-[100px] grayscale"
                />
                <span className="text-[48px] font-bold text-gray-400 dark:text-zinc-200">
                    ERROR
                </span>
                <span className="font-bold dark:text-zinc-200">
                    {error instanceof Error
                        ? error.message
                        : "알 수 없는 오류"}
                </span>
                {import.meta.env.DEV && error instanceof Error && (
                    <span className="dark:text-zinc-200">
                        {error.stack}
                    </span>
                )}
                <Link to={"/"} className="p-2 round-sm text-orange-600 font-bold underline mt-4">
                    HOME
                </Link>
            </div>
            <Footer />
        </div >
    );
}

export default ErrorPage;