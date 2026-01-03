
import { ClashBase } from "./clashTypes";
import { SummaryData } from "./trickcalTypes";

export const clashV2BossList: string[] = ["흑화 영춘"];

// 차원 대충돌 개인 데이터
export interface ClashV2PlayerData {
    rank: number;
    grade: number;
    score: number;
    duration: number;
    sideGrade: number;
    arr: string[];
    sideArr: string[];
    sideSkills?: ClashV2SideSkill[];
}

interface ClashV2Base extends ClashBase {
    maxSideLvl: number; // 림의 이면세계 최대 단계
}

// 차원 대충돌 시즌 데이터
export interface ClashV2SeasonData extends ClashV2Base {
    type: 'season';
    sideSkills?: string[];
    data: ClashV2PlayerData[];
}

// 시즌 데이터를 담아둘 인터페이스
export interface ClashV2Data {
    // key는 해당 시즌 회차
    [seasonNumber: number]: ClashV2SeasonData;
}

export interface ClashV2Summary extends ClashV2Base {
    summary: SummaryData[];
    sideSummary: SummaryData[];
}

export interface ClashV2SideSkill {
    name: 'clashV2Side1' | 'clashV2Side2' | 'clashV2Side3';
    level: number;
}