import { getSeasonName, translateRaid } from "@/utils/function";
import { useRaidStats } from "../../hooks/useRaidStats";
import { StatsRaidType } from "../../types/statTypes";
import MetaTrendChart from "./MetaTrendChart";
import RankCutChart from "./RankCutChart";
import NewCharPickGrid from "./NewCharPickGrid";
import { STAT_CONFIG } from "../../utils/raidStatConfig";

const RaidStatsComponent = ({ type }: { type: StatsRaidType }) => {
    const view = useRaidStats(type);

    const firstSeason = view.seasons[0];
    const lastSeason = view.seasons[view.seasons.length - 1];
    const months = getApproxMonthsBetween(firstSeason.startDate, lastSeason.endDate);

    return (
        <div className="lg:w-[992px] w-full mx-auto my-8">
            <div className="p-2 mb-2 flex flex-col dark:text-zinc-200">
                <h1 className="text-[20px] font-bold mr-2">
                    {translateRaid(type)} 통계
                </h1>
                <span className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[13px] text-gray-700 dark:text-zinc-400 sm:flex-nowrap">
                    <span className="whitespace-nowrap">
                        {getSeasonName(firstSeason.season)} ~ {getSeasonName(lastSeason.season)}.
                    </span>
                    <span className="whitespace-nowrap">
                        {firstSeason.startDate} ~ {lastSeason.endDate} (약 {months}개월)
                    </span>
                </span>
            </div>

            <div className="flex flex-col gap-y-4">
                <MetaTrendChart view={view} />
                <RankCutChart view={view} metrics={STAT_CONFIG[type].metrics} />
                <NewCharPickGrid view={view} />
            </div>
        </div>
    );
};

export default RaidStatsComponent;

function getApproxMonthsBetween(from: string, to: string) {
    const toUTC = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return Date.UTC(year, month - 1, day);
    };

    const days = (toUTC(to) - toUTC(from)) / 86400000;

    return Math.round(days / 30.4375);
}
