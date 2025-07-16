import { Link, useLocation } from "react-router-dom";

const HeaderNav = () => {

    const { pathname } = useLocation();

    return (
        <div className={`bg-white py-4 flex justify-center items-center font-bold border-b-2 w-full `}>
            <div className="lg:w-[992px] w-full mx-auto flex justify-center">
                <div className="flex justify-center items-center gap-x-4">
                    <Link to={"/"} className="h-[26px] w-[26px] mr-4 flex" >
                        <img loading="lazy" decoding="async" src={`/logo.png`} />
                    </Link>
                    <Link to={"/clash"} className={`cursor-pointer hover:text-gray-700 transition duration-300 ${pathname.startsWith("/clash") ? "" : "text-gray-400"}`}>
                        차원 대충돌
                    </Link>
                    <Link to={"/frontier"} className={`cursor-pointer hover:text-gray-700 transition duration-300 ${pathname.startsWith("/frontier") ? "" : "text-gray-400"}`}>
                        엘리아스 프론티어
                    </Link>
                </div>
            </div>
            {/* <Link to={"/stat/clash"} className={`cursor-pointer hover:text-gray-700 transition duration-300 ${pathname.startsWith("/frontier") ? "" : "text-gray-400"}`}>
                test
            </Link> */}
        </div>
    );
}

export default HeaderNav;