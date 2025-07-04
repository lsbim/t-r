import { SummaryData } from "./trickcalTypes";

export const frontierBossList: string[] = ["M.E.O.W", "R41-리뉴아", "크레용사용"];

// 엘리아스 프론티어 개인 데이터
export interface FrontierPlayerData {
    rank: number;
    score: number;
    coin: number;
    grade: string;
    duration: number;
    arr: string[];
}

interface FrontierBase {
    name: string; // 프론티어 몬스터 이름. "릴1리", "크르브르스" ...
    startDate: string; // "YYYY-MM-DD" 형식
    endDate: string; // "YYYY-MM-DD" 형식
    power: string[]; // 권능. 날먹 보호막, 명치 꽂기, 애착 담요 ...
    maxGrade: string; // 시즌 최대 단계. 용암맛2 ...
}

// 엘리아스 프론티어 시즌 데이터
export interface FrontierSeasonData extends FrontierBase {
    data: FrontierPlayerData[]; // [["비비","벨라"...], [], [], ...]
}

// 시즌 데이터를 담아둘 인터페이스
export interface FrontierData {
    // key는 해당 시즌 회차
    [season: string]: FrontierSeasonData;
}

export interface FrontierSummary extends FrontierBase {
    summary: SummaryData[];
}