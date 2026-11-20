import { PersonalityEn } from "./trickcalTypes";

export const deepClashBossList: string[] = ["오리카"];

// 성격해역의 성격
export type DeepClashPersonality = Exclude<PersonalityEn, "공명">;

// 보스 or 성격해역
export type DeepClashType = "boss" | DeepClashPersonality;

// 심해 대격돌 성격 해역 데이터
export interface DeepClashPersonalityData {
    depth: number; // 수심
    duration: number; // 클리어 시간
    arr: string[];
    skinArr: (string | null)[];
}

// 심해 대격돌 개인 데이터
export interface DeepClashPlayerData {
    rank: number;
    score: number;
    arr: string[];
    skinArr: (string | null)[];
    personalities: Record<
        DeepClashPersonality,
        DeepClashPersonalityData
    >;
}

export interface DeepClashSeasonData {
    name: string; // 심해 대격돌 보스 이름. "오리카" ...
    startDate: string; // "YYYY-MM-DD" 형식
    endDate: string; // "YYYY-MM-DD" 형식
    data: DeepClashPlayerData[]; // [["비비","벨라"...], [], [], ...]
}