import { AllLine, BaseLine, Personality } from "../../../../types/trickcalTypes";

export interface PickRankData {
    name: string;
    rates: number[];
    weightScore: number;
}
export type PickRank = {
    [k in BaseLine]: PickRankData[]
}

export type SelectChara = {
    name: string;
    line: AllLine
}

// ------------- 통계 페이지용 -----------------

// 순위별 기록 차트에서 비교하는 기록 지표(클리어 시간, 점수, 실체의 코인)
export type RecordMetric = "duration" | "score" | "coin";

// 순위별 기록으로 뽑는 순위 컷
export type RankCutRank = 1 | 10 | 100 | 300;

// 순위 컷별 기록 값(해당 순위 기록이 없으면 null)
export type RankCuts = Record<RankCutRank, number | null>;

// 시즌의 열별 사도 사용 횟수 (공명 사도는 본체명으로 통합)
export interface RaidStatRate {
    name: string;
    line: BaseLine;
    count: number;
}

export interface RaidStatSeason {
    season: number;
    name: string;
    startDate: string;
    endDate: string;
    personality?: Personality;
    maxLvl: number | string;
    userTotalCount: number;
    rates: RaidStatRate[];
    cuts: Partial<Record<RecordMetric, RankCuts>>;
    comboCounts: number[];
    top1Arr: string[]; // 1위의 조합
}

// stats.json
export interface RaidStatsFile {
    seasons: RaidStatSeason[];
}

// 기록 지표 메타
export interface RecordMetricMeta {
    label: string;
    better: "lower" | "higher"; // lower: 작을수록 좋음(시간)
    ratioUnit: "배" | "%";
}

// 콘텐츠별 통계 설정
export interface RaidStatConfig {
    label: string; 
    shortLabel: string; 
    path: string;
    metrics: RecordMetric[];
}

// ----------------------------- 통계 계산 결과 -----------------

// 메타 변화량 (%): 직전 시즌과 비교해 다른 사도로 바뀐 자리의 비율
export interface MetaChange {
    total: number; // 세 열의 평균
    lines: Record<BaseLine, number>;
}

// 필수 사도 (기준 이상 사용된 사도)
export interface EssentialChar {
    name: string;
    rate: number; // 사용률 %
}

// 신규 사도 출전율: rates는 입력 시즌 순서와 같고, null은 출시 전 시즌
export interface NewCharRate {
    name: string;
    birthdate: string;
    rates: (number | null)[];
}

// 사도 구성 비율 속성 (공격 타입/역할/종족)
export type CompositionKey = "attackType" | "role" | "race";