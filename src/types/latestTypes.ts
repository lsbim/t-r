import { Personality, SummaryData } from "./trickcalTypes";


export interface LatestBase {
    seasonNumber: number; // 시즌 번호
    personality?: Personality; // 성격. "광기" | "냉정" ...
    name: string; // 대충돌 몬스터 이름. "릴1리", "크르브르스" ...
    startDate: string; // "YYYY-MM-DD" 형식
    endDate: string; // "YYYY-MM-DD" 형식
}

export interface LatestSummary extends LatestBase {
    summary: SummaryData[];
}

export interface LatestData {
    clash: LatestSummary;
    frontier: LatestSummary;
    clashV2: LatestSummary;
}