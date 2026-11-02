import { CharInfoType } from "../../../../data/trickcalChar";
import { BaseLine, lineList } from "../../../../types/trickcalTypes";
import { parseResonanceBaseName } from "../../../../utils/resonanceFunction";
import { ComboDiversity, CompositionKey, EssentialChar, MetaChange, NewCharRate, RaidStatRate, RaidStatSeason, RankCutRatios, RankCuts, RecordMetric, Top1CompDiff } from "../types/statTypes";
import { METRIC_META, RANK_CUT_RANKS, STAT_SEASON_WINDOW } from "./raidStatConfig";

// 필수 사도로 보는 사용률 기준 %
const ESSENTIAL_THRESHOLD = 90;

// 사도별 전체 사용 팀 수 (모든 열 합)
const getNameTotals = (rates: RaidStatRate[]): Map<string, number> => {
    const totals = new Map<string, number>();
    for (const { name, count } of rates) {
        totals.set(name, (totals.get(name) ?? 0) + count);
    }
    return totals;
};

// 한 열의 사도별 점유율: 사용 횟수 / 그 열의 사용 횟수 합계
const getLineShares = (rates: RaidStatRate[], line: BaseLine): Map<string, number> => {
    const lineRates = rates.filter(rate => rate.line === line);
    const total = lineRates.reduce((sum, rate) => sum + rate.count, 0);

    const shares = new Map<string, number>();
    if (total === 0) return shares;

    for (const { name, count } of lineRates) {
        shares.set(name, count / total);
    }
    return shares;
};

// 한 열에서 다른 사도로 바뀐 자리의 비율 (%)
// 두 시즌의 사도별 점유율 차이의 절댓값 합을 2로 나눈 값 (0 = 똑같음, 100 = 바뀜)
const calcLineChange = (prevRates: RaidStatRate[], currRates: RaidStatRate[], line: BaseLine): number => {
    const prev = getLineShares(prevRates, line);
    const curr = getLineShares(currRates, line);
    if (prev.size === 0 || curr.size === 0) return 0;

    const names = new Set<string>(Array.from(prev.keys()).concat(Array.from(curr.keys())));
    let diff = 0;
    names.forEach(name => {
        diff += Math.abs((curr.get(name) ?? 0) - (prev.get(name) ?? 0));
    });

    return (diff / 2) * 100;
};

// 메타 변화량: 직전 시즌 대비 사도 자리 교체율 (열별, 전체는 세 열의 평균)
export const calcMetaChange = (prev: RaidStatSeason, curr: RaidStatSeason): MetaChange => {
    const lines = { 전열: 0, 중열: 0, 후열: 0 } as Record<BaseLine, number>;
    lineList.forEach(line => {
        lines[line] = calcLineChange(prev.rates, curr.rates, line);
    });

    const total = lineList.reduce((sum, line) => sum + lines[line], 0) / lineList.length;

    return { total, lines };
};

// 필수 사도: 전체 팀 중 기준 이상(기본 90%) 사용된 사도
export const calcEssentialChars = (season: RaidStatSeason, threshold: number = ESSENTIAL_THRESHOLD): EssentialChar[] => {
    if (season.userTotalCount === 0) return [];

    const result: EssentialChar[] = [];
    getNameTotals(season.rates).forEach((count, name) => {
        const rate = (count / season.userTotalCount) * 100;
        if (rate >= threshold) result.push({ name, rate });
    });

    return result.sort((a, b) => b.rate - a.rate || (a.name < b.name ? -1 : 1));
};

// 신캐 출전율: 조회 구간 중에 출시된 사도의 시즌별 사용률(%)
// 출시일이 콘텐츠별 첫 시즌 시작일보다 뒤인 사도만 대상
export const calcNewCharRates = (seasons: RaidStatSeason[], info: CharInfoType): NewCharRate[] => {
    if (seasons.length === 0) return [];

    const firstStart = seasons[0].startDate;
    const nameTotals = seasons.map(season => getNameTotals(season.rates));
    const result: NewCharRate[] = [];

    Object.keys(info).forEach(name => {
        if (parseResonanceBaseName(name)) return; // 공명 사도의 성격 변형은 본체와 별개 행으로 만들지 않음

        const { birthdate } = info[name];
        if (birthdate <= firstStart) return;

        const rates = seasons.map((season, i) => {
            if (birthdate > season.startDate) return null;

            return season.userTotalCount === 0 ? 0 : ((nameTotals[i].get(name) ?? 0) / season.userTotalCount) * 100;
        });

        if (rates.some(rate => rate !== null)) {
            result.push({ name, birthdate, rates });
        }
    });

    return result.sort((a, b) =>
        a.birthdate < b.birthdate ? -1 : a.birthdate > b.birthdate ? 1 : a.name < b.name ? -1 : 1
    );
};

// 사도 구성 비율(%): 모든 팀의 사도 중 속성(공격 타입/역할/종족)별 비율. 합계는 100
// 사도 정보가 없는 이름은 제외
export const calcComposition = (
    season: RaidStatSeason,
    info: CharInfoType,
    key: CompositionKey
): Record<string, number> => {
    const counts = new Map<string, number>();
    let total = 0;

    for (const { name, count } of season.rates) {
        const value = info[name]?.[key];
        if (!value) continue;

        counts.set(value, (counts.get(value) ?? 0) + count);
        total += count;
    }

    const result: Record<string, number> = {};
    if (total === 0) return result;

    counts.forEach((count, value) => {
        result[value] = (count / total) * 100;
    });

    return result;
};

// 조합 다양성: 조합별 사용 팀 수(comboCounts)로 고유 조합 수, 유효 조합 수, 1위 조합 점유율 계산
export const calcComboDiversity = (season: RaidStatSeason): ComboDiversity => {
    const total = season.comboCounts.reduce((sum, count) => sum + count, 0);
    if (total === 0) return { uniqueCount: 0, effectiveCount: 0, top1Share: 0 };

    // 점유율 제곱합의 역수 (역심슨 지수)
    const squareSum = season.comboCounts.reduce((sum, count) => sum + (count / total) ** 2, 0);

    return {
        uniqueCount: season.comboCounts.length,
        effectiveCount: 1 / squareSum,
        top1Share: (Math.max(...season.comboCounts) / total) * 100,
    };
};

// 순위 컷별 1위 대비 비율
export const calcRankCutRatio = (cuts: RankCuts | undefined, metric: RecordMetric): RankCutRatios => {
    const base = cuts?.[1];
    const multiplier = METRIC_META[metric].ratioUnit === "%" ? 100 : 1;

    const ratios: RankCutRatios = {};
    RANK_CUT_RANKS.forEach(rank => {
        if (rank === 1) return;

        const value = cuts?.[rank] ?? null;
        ratios[rank] = base && value !== null ? (value / base) * multiplier : null;
    });

    return ratios;
};

// 1위 조합의 직전 시즌 대비 변화 (새로 들어온/빠진/유지된 사도)
export const diffTop1Comp = (prev: RaidStatSeason, curr: RaidStatSeason): Top1CompDiff => {
    const prevSet = new Set(prev.top1Arr);
    const currSet = new Set(curr.top1Arr);

    return {
        added: curr.top1Arr.filter(name => !prevSet.has(name)),
        removed: prev.top1Arr.filter(name => !currSet.has(name)),
        kept: curr.top1Arr.filter(name => prevSet.has(name)),
    };
};

// 최근 N시즌만 남김
export const selectSeasonWindow = <T>(seasons: T[], size: number = STAT_SEASON_WINDOW): T[] =>
    seasons.slice(-size);