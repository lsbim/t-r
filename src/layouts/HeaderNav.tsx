import { Link, useLocation } from "react-router-dom";

const HeaderNav = () => {

    const { pathname } = useLocation();

    return (
        <div className={`bg-white py-4 flex items-center justify-center gap-8 font-bold border-b-4 w-full ${pathname.startsWith("/clash") || pathname === "/" ? "border-yellow-300" : "border-emerald-300"}`}>
            <Link to={"/"} className={`cursor-pointer hover:text-gray-700 transition duration-300 ${pathname.startsWith("/clash") || pathname === "/" ? "" : "text-gray-400"}`}>
                차원 대충돌
            </Link>
            <Link to={"/frontier"} className={`cursor-pointer hover:text-gray-700 transition duration-300 ${pathname.startsWith("/frontier") ? "" : "text-gray-400"}`}>
                엘리아스 프론티어
            </Link>
        </div>
    );
}

export default HeaderNav;