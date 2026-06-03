import { Personality } from "../trickcalTypes";

// 열별 순위 정보
export interface LineRank {
    line: string;
    rank: number;
    count: number;
}

// 1위 달성 시즌
export interface TopSeasonStat {
    seasonNumber: number;
    name: string | null;
    personality: string | null;
    startDate: string | null;
    endDate: string | null;
    pickCount: number;
    pickRate: number;
    isOverall: boolean; // 종합 1위인지
    line: string | null; // 1위 달성한 열

    // 모든열 사도 전용
    linePickCount?: number;
    linePickRate?: number;
}

// 컨텐츠 별 최근 성적
export interface RecentSeasonStat {
    seasonNumber: number;
    name: string | null;
    personality: Personality | null;
    startDate: string | null;
    endDate: string | null;
    pickCount: number;
    pickRate: number;
    overallRank: number | null;
    lineRanks: LineRank[]; // 모든열 사도 대비 배열로
    totalEntries: number;
}

// 최근 사용한 사복top3
export interface RecentSkin {
    skinName: string;
    count: number;
}

// 1위 달성 시즌
export interface ContentTopSeasons {
    clash: TopSeasonStat[];
    frontier: TopSeasonStat[];
    clashV2: TopSeasonStat[];
}

// 컨텐츠 별 최근 성적
export interface ContentRecentStats {
    clash: RecentSeasonStat[];
    frontier: RecentSeasonStat[];
    clashV2: RecentSeasonStat[];
}

export interface CharacterStatsData {
    birthdate: string;
    line: string;
    personality: string | null;
    topSeasons: ContentTopSeasons;
    recentStats: ContentRecentStats;
    recentSkins: RecentSkin[];
}