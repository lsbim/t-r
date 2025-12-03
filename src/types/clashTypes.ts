import { externalData } from "./frontierTypes";
import { Personality, SummaryData } from "./trickcalTypes";

export const clashBossList: string[] = ["릴1리", "크르브르스", "크레용사용"];

// 차원 대충돌 개인 데이터
export interface ClashPlayerData {
    rank: number;
    grade: number;
    duration: number;
    arr: string[];
}

export interface ClashBase {
    personality: Personality; // 성격. "광기" | "냉정" ...
    name: string; // 대충돌 몬스터 이름. "릴1리", "크르브르스" ...
    startDate: string; // "YYYY-MM-DD" 형식
    endDate: string; // "YYYY-MM-DD" 형식
    rules: string[]; // 시즌 규칙. "물리 피해량 25% 증가" ...
    maxLvl: number; // 시즌 최대 단계
}

// 차원 대충돌 시즌 데이터
export interface ClashSeasonData extends ClashBase {
    type: 'season';
    data: ClashPlayerData[]; // [["비비","벨라"...], [], [], ...]
}

// 차원 대충돌 제보받아 하드코딩한 데이터
export interface ClashExternalData extends ClashBase {
    type: 'external';
    data: externalData[]; // [{"name": "벨라", count: 51, line: "전열"}, {}, ...]
}

// 시즌 데이터를 담아둘 인터페이스
export interface ClashData {
    // key는 해당 시즌 회차
    [seasonNumber: number]: ClashSeasonData;
}

export interface ClashSummary extends ClashBase {
    summary: SummaryData[];
}