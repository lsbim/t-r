import { containerDarkBG } from "@/styles/container";
import { TrickcalRaidEn } from "@/types/trickcalTypes";
import { Link } from "react-router-dom";
import { STAT_CONFIG, STAT_CONTENT_ORDER } from "../../utils/raidStatConfig";

// HeaderNav 아래에 붙는 통계 페이지 하위 메뉴
const StatSubNav = ({ type }: { type: TrickcalRaidEn }) => {
    return (
        <nav aria-label="통계 콘텐츠" className={`w-full ${containerDarkBG} border-b border-zinc-300 dark:border-zinc-700`}>
            <div className="lg:w-[992px] w-full mx-auto flex justify-center items-center gap-x-5 font-bold text-[13px] text-gray-800 dark:text-zinc-200">
                {STAT_CONTENT_ORDER.map(key => (
                    <Link
                        key={key}
                        to={STAT_CONFIG[key].path}
                        aria-current={key === type ? "page" : undefined}
                        className={`py-2.5 cursor-pointer hover:text-orange-600 transition duration-200 border-b-2 ${key === type ? "text-orange-600 border-orange-600" : "border-transparent"}`}>
                        {STAT_CONFIG[key].shortLabel}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default StatSubNav;