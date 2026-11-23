import { DeepClashPlayerData, DeepClashSeasonData, DeepClashType } from "../../../../types/deepClashTypes";
import { BaseLine } from "../../../../types/trickcalTypes";
import { getLineInComp } from "../../shared/utils/chartFunction";
import type { CompStat } from "../../shared/utils/chartFunction";

// 최대 편성 인원. 보스 9인, 성격해역 6인
export const getPartySize = (type: DeepClashType) => (type === "boss" ? 9 : 6);

// 공용 집계 컴포넌트(PickRateChart, CostumeRank 등) 전용.
export const processDeepClashData = (season: DeepClashSeasonData, type: DeepClashType): DeepClashSeasonData => {
    if (type === "boss") return season;

    return {
        ...season,
        data: season.data.map((player) => {
            const { arr, skinArr } = player.personalities[type];
            return { ...player, arr, skinArr };
        }),
    };
};

// BestComp 전용. processCompStat과 같은 CompStat을 반환한다
export function processFullCompStat(data: DeepClashPlayerData[], partySize: number): CompStat[] {
    const map = new Map<string, { count: number; front: string[]; mid: string[]; back: string[] }>();

    for (const { arr } of data) {
        if (arr.length !== partySize) continue;

        const lines: Record<BaseLine, string[]> = { 전열: [], 중열: [], 후열: [] };
        arr.forEach((name, idx) => lines[getLineInComp(arr, idx)].push(name));

        // 같은 조합이 같은 키가 되도록 열 안에서 정렬
        const front = lines.전열.sort();
        const mid = lines.중열.sort();
        const back = lines.후열.sort();
        const key = JSON.stringify([front, mid, back]);

        const stat = map.get(key);
        if (stat) stat.count += 1;
        else map.set(key, { count: 1, front, mid, back });
    }

    return Array.from(map.values())
        .sort((a, b) => b.count - a.count)
        .map((stat, idx) => ({ rank: idx + 1, ...stat }));
}
