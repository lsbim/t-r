import { Link } from "react-router-dom";
import { LatestSummary } from "../../../types/latestTypes";

const HomeDeepClashCard = ({ data }: { data: LatestSummary }) => {
    const seasonLabel = Number(data.seasonNumber) >= 10000
        ? `베타 시즌${Number(data.seasonNumber) - 10000}`
        : `시즌${data.seasonNumber}`;

    return (
        <Link
            to={`/deep/${data.seasonNumber}`}
            className="relative flex min-h-[150px] w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#1259ad] via-[#123f82] to-[#2d3045] text-white shadow-sm will-change-transform"
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_52%_130%,rgba(5,20,55,0.75)_0%,rgba(5,20,55,0)_48%)]" />
            <div className="pointer-events-none absolute bottom-[-92px] left-[56%] h-[230px] w-[230px] -translate-x-1/2 rounded-full border border-white/15 bg-gradient-to-br from-white/25 via-white/10 to-white/5 shadow-[0_0_24px_rgba(170,205,255,0.2)]" />
            <img
                src={`/images/boss/${data.name}.webp`}
                alt={data.name}
                className="pointer-events-none absolute bottom-[-18px] left-[56%] z-[1] h-[164px] w-[164px] -translate-x-1/2 object-contain drop-shadow-xl sm:h-[184px] sm:w-[184px]"
            />
            <div className="relative z-10 flex w-full shrink-0 flex-col justify-center gap-y-2 p-4 sm:p-5">
                <span className="text-[20px] font-bold leading-tight sm:text-[24px]">
                    심해 대격돌
                </span>
                <span className="text-[12px] font-semibold">
                    {seasonLabel} {data.name}
                </span>
                <span className="w-fit rounded-md bg-zinc-900/50 px-2.5 py-1 text-[10px] font-medium text-zinc-200 sm:text-[11px]">
                    {data.startDate} ~ {data.endDate}
                </span>
            </div>
        </Link>
    );
};

export default HomeDeepClashCard;
