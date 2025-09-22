import { Link, useLocation } from "react-router-dom";
import CharacterSearch from "./CharacterSearch";

const HeaderNav = () => {

    const { pathname } = useLocation();

    return (
        <div id="top" className={`bg-white py-4 flex justify-center items-center font-bold border-b-2 w-full `}>
            <div className="lg:w-[992px] w-full mx-auto flex justify-center">
                <div className="flex justify-center items-center gap-x-3">
                    <Link
                        to={"/"}
                        className="h-[26px] w-[26px] mx-3 md:mr-1 flex" >
                        <img loading="lazy" decoding="async" src={`/logo.png`} className="min-w-[26px]" />
                    </Link>
                    <Link
                        to={"/clash"}
                        className={`text-[14px] md:text-[16px] cursor-pointer hover:text-gray-800 transition duration-300 ${pathname.startsWith("/clash") ? "" : "text-gray-400"}`}>
                        {/* <span className="hidden xs:inline">
                            차원 대충돌
                        </span>
                        <span className="xs:hidden">
                            대충돌
                        </span> */}
                        차원 대충돌
                    </Link>
                    <Link
                        to={"/frontier"}
                        className={`text-[14px] md:text-[16px] cursor-pointer hover:text-gray-800 transition duration-300 ${pathname.startsWith("/frontier") ? "" : "text-gray-400"}`}>
                        {/* <span className="hidden xs:inline">
                            엘리아스 프론티어
                        </span>
                        <span className="xs:hidden">
                            프론티어
                        </span> */}
                        엘리아스 프론티어
                    </Link>
                    <Link
                        to={"/timeline/raid"}
                        className={`text-[14px] md:text-[16px] cursor-pointer hover:text-gray-800 transition duration-300 ${pathname.startsWith("/timeline/raid") ? "" : "text-gray-400"}`}>
                        타임라인
                    </Link>
                    <Link
                        to={"/costume"}
                        className={`text-[14px] md:text-[16px] cursor-pointer hover:text-gray-800 transition duration-300 ${pathname.startsWith("/costume") ? "" : "text-gray-400"}`}>
                        사복
                    </Link>
                    {/* <CharacterSearch /> */}
                </div>
            </div>
            {/* <Link to={"/stat/clash"} className={`cursor-pointer hover:text-gray-700 transition duration-300 ${pathname.startsWith("/frontier") ? "" : "text-gray-400"}`}>
                test
            </Link> */}
        </div>
    );
}

export default HeaderNav;