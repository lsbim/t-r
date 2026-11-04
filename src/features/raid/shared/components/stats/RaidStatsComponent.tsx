import { TrickcalRaidEn } from "@/types/trickcalTypes";
import { translateRaid } from "@/utils/function";
import { useRaidStats } from "../../hooks/useRaidStats";

const RaidStatsComponent = ({ type }: { type: TrickcalRaidEn }) => {
    const { seasons } = useRaidStats(type);

    // console.log(seasons)

    return (
        <div className="w-[992px] max-w-full my-8">
            <div className="p-2 mb-2 flex flex-col dark:text-zinc-200">
                <h1 className="text-[20px] font-bold mr-2">
                    {translateRaid(type)} 통계
                </h1>
                <span className="mt-1 text-[13px] text-gray-600 dark:text-zinc-400">
                    최근 {seasons.length}시즌 / 상위 300위 기준
                </span>
            </div>
        </div>
    );
};

export default RaidStatsComponent;