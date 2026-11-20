import { charInfo } from "../../../../data/trickcalChar";
import { DeepClashPlayerData, DeepClashSeasonData, DeepClashType } from "../../../../types/deepClashTypes";
import { BaseLine } from "../../../../types/trickcalTypes";
import { CompStat } from "../../shared/utils/chartFunction";

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

// 사도 한 명이 속한 열. 9인은 인덱스가 곧 위치, 그 외에는 사도 정보의 열을 따른다
function getLineInComp(arr: string[], idx: number): BaseLine {
    if (arr.length === 9) return idx <= 2 ? "전열" : idx <= 5 ? "중열" : "후열";

    const line = charInfo[arr[idx]]?.line;
    if (line && line !== "모든열") return line;

    // 모든열 사도(죠안, 티그(영웅))는 열을 알 수 없어 arr(전열 -> 후열 순)의 앞 사도 열을 따른다
    return idx > 0 ? getLineInComp(arr, idx - 1) : "전열";
}

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