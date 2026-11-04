import { TrickcalRaidEn } from "../../../../types/trickcalTypes";
import { RaidStatConfig, RankCutRank, RecordMetric, RecordMetricMeta } from "../types/statTypes";

// 통계에 사용하는 최근 시즌 수
// stats.json에는 비교 기준 시즌 1개가 더 들어 있음
export const STAT_SEASON_WINDOW = 10;

// 순위별 기록으로 뽑는 순위 컷
export const RANK_CUT_RANKS: RankCutRank[] = [1, 10, 100, 300];

// 기록 지표 메타
export const METRIC_META: Record<RecordMetric, RecordMetricMeta> = {
    duration: { label: "클리어 시간", better: "lower", ratioUnit: "배" },
    score: { label: "점수", better: "higher", ratioUnit: "%" },
    coin: { label: "실체의 코인", better: "higher", ratioUnit: "%" },
};

// 콘텐츠별 통계 설정
export const STAT_CONFIG: Record<TrickcalRaidEn, RaidStatConfig> = {
    clash: {
        shortLabel: "대충돌",
        path: "/stats/clash/v1",
        metrics: ["duration"],
    },
    clashV2: {
        shortLabel: "대충돌 2.0",
        path: "/stats/clash/v2",
        metrics: ["duration"],
    },
    frontier: {
        shortLabel: "프론티어",
        path: "/stats/frontier",
        metrics: ["score", "coin"],
    },
};

// nav 하위 메뉴/드롭다운 표시 순서
export const STAT_CONTENT_ORDER: TrickcalRaidEn[] = ["clash", "clashV2", "frontier"];