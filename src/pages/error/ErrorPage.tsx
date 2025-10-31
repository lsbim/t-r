import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import SEO from "../../commons/component/SEO";

const ErrorPage = () => {

    const error = useRouteError();
    // console.log(error)


    if (isRouteErrorResponse(error)) {
        let errorTitle: string = 'ERROR';
        let errorMsg: string;
        let errorData: string = '';

        if (error.status === 404) {
            errorTitle += " 404";
            errorMsg = "페이지를 찾을 수 없습니다."
            errorData = ""
        } else {
            errorTitle + " " + error.status;
            errorMsg = error.statusText
            errorData = error.data
        }

        return (
            <div className="flex flex-col justify-center gap-4 min-h-[100.5vh]">
                <SEO />
                <HeaderNav />
                <div className=" flex items-center justify-center flex-col mt-16">
                    <span className="text-[48px] font-bold text-gray-400 dark:text-zinc-200">
                        {errorTitle}
                    </span>
                    <span className="font-bold dark:text-zinc-100">
                        {errorMsg}
                    </span>
                    {errorData && (
                        <span className="font-bold dark:text-zinc-100">
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
        <div className="flex flex-col justify-center gap-4 min-h-[100.5vh]">
            <SEO />
            <HeaderNav />
            <div className=" flex items-center justify-center flex-col mt-16">
                <span className="text-[48px] font-bold text-gray-400 dark:text-zinc-100">
                    ERROR
                </span>
                <span className="font-bold dark:text-zinc-100">
                    {error instanceof Error
                        ? error.message
                        : "알 수 없는 오류"}
                </span>
                {process.env.NODE_ENV === 'development' && error instanceof Error && (
                    <span className="dark:text-zinc-100">
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