import { Costume, costumes } from "../data/costumes";
import { ClashSeasonData } from "../types/clashTypes";
import { FrontierSeasonData } from "../types/frontierTypes";

export interface CostumeStat {
    charName: string;
    cosName: string;
    lvl: string;
    cosUsedCount: number;
    charTotalCount: number;
    rate: number;
}

export interface ProcessedCostumeData {
    all: CostumeStat[];
    normal: CostumeStat[];
    pretty: CostumeStat[];
};

export const processCostumeData = (
    data: ClashSeasonData | FrontierSeasonData,
    type?: 'side'
): ProcessedCostumeData => {

    const costumeMasterMap = new Map<string, Costume>(); // 사복명: 사도명,사복명,출시일,사복등급
    costumes.forEach(c => costumeMasterMap.set(c.cosName, c));

    const charCountMap = new Map<string, number>(); // 사도 출전 횟수
    const skinCountMap = new Map<string, number>(); // '사도|사복' 사용 횟수

    const playerData = data?.data;

    playerData.forEach((user: any) => {
        const charList = type === 'side' && 'sideArr' in user ? user?.sideArr : user?.arr;
        const skinList = type === 'side' && 'sideSkinArr' in user ? user?.sideSkinArr : user?.skinArr;

        if (!charList || !skinList) return;

        charList.forEach((charN: string, idx: number) => {
            const charName = charN.startsWith('우로스') ? '우로스' : charN
            charCountMap.set(charName, (charCountMap.get(charName) || 0) + 1);

            const skinName = skinList[idx];
            if (!skinName) return;

            const costumeInfo = costumeMasterMap.get(skinName);

            if (costumeInfo?.charName !== charName) {
                if (import.meta.env.DEV) console.log(`[ERROR] 사도 '${charName}' 위치에 '${costumeInfo?.charName}'의 사복 '${skinName}' 적용됨.`);
            }

            const skinKey = `${charName}|${skinName}`;
            skinCountMap.set(skinKey, (skinCountMap.get(skinKey) || 0) + 1);
        });
    });


    const processedCostumes: CostumeStat[] = Array.from(skinCountMap.entries()).map(([key, cosUsedCount]) => {

        const [charName, cosName] = key.split('|'); // 란|교단 행동 대장
        const costumeInfo = costumeMasterMap.get(cosName);

        const lvl = costumeInfo ? costumeInfo.lvl : 'normal'
        const charTotalCount = charCountMap.get(charName) || 1;
        const rate = Math.round((cosUsedCount / charTotalCount) * 100 * 10) / 10;

        return { charName, cosName, lvl, cosUsedCount, charTotalCount, rate };
    });


    const sortByCount = (a: CostumeStat, b: CostumeStat) => b.cosUsedCount - a.cosUsedCount;

    const result = {
        all: [...processedCostumes].sort(sortByCount).slice(0, 3),
        normal: processedCostumes.filter(s => s.lvl === 'normal').sort(sortByCount).slice(0, 3),
        pretty: processedCostumes.filter(s => s.lvl === 'pretty').sort(sortByCount).slice(0, 3),
    };

    return result;
}