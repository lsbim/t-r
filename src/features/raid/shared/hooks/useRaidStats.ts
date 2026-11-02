import { charInfo } from "@/data/trickcalChar";
import { useRaidData } from "@/hooks/useRaidData";
import { TrickcalRaidEn } from "@/types/trickcalTypes";
import { useMemo } from "react";
import { CompositionKey, RaidStatsFile, RaidStatsView, RankCutRatios, RecordMetric } from "../types/statTypes";
import { STAT_CONFIG } from "../utils/raidStatConfig";
import { calcComboDiversity, calcComposition, calcEssentialChars, calcMetaChange, calcNewCharRates, calcRankCutRatio, diffTop1Comp, selectSeasonWindow } from "../utils/raidStats";

const COMPOSITION_KEYS: CompositionKey[] = ["attackType", "role", "race"];

export const useRaidStats = (type: TrickcalRaidEn): RaidStatsView => {
    const { data } = useRaidData<RaidStatsFile>(type, "stats");

    return useMemo(() => {
        const seasons = selectSeasonWindow(data.seasons);

        const compositions = {} as Record<CompositionKey, Record<string, number>[]>;
        COMPOSITION_KEYS.forEach(key => {
            compositions[key] = seasons.map(season => calcComposition(season, charInfo, key));
        });

        const rankCutRatios: Partial<Record<RecordMetric, RankCutRatios[]>> = {};
        STAT_CONFIG[type].metrics.forEach(metric => {
            rankCutRatios[metric] = seasons.map(season => calcRankCutRatio(season.cuts[metric], metric));
        });

        return {
            seasons,
            metaChanges: seasons.map((season, i) => (i === 0 ? null : calcMetaChange(seasons[i - 1], season))),
            essentials: seasons.map(season => calcEssentialChars(season)),
            newChars: calcNewCharRates(seasons, charInfo),
            compositions,
            diversities: seasons.map(season => calcComboDiversity(season)),
            rankCutRatios,
            top1Diffs: seasons.map((season, i) => (i === 0 ? null : diffTop1Comp(seasons[i - 1], season))),
        };
    }, [data, type]);
};