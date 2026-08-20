import { ClashSeasonData } from "./clashTypes";
import { FrontierSeasonData } from "./frontierTypes";

// 성격
export type Personality = "광기" | "냉정" | "순수" | "우울" | "활발" | "공명";
export const personalityList = ["광기", "냉정", "순수", "우울", "활발", "공명"];
// 레이드 영문명
export type TrickcalRaidEn = "clash" | "frontier" | 'clashV2';
// 성격 시너지용
export interface SynergyItem {
    personality: Personality;
    qty: number;
}
// 범용 배치 라인
export type BaseLine = "전열" | "중열" | "후열";
export type BaseLineEn = "front" | "mid" | "back";
export type AllLine = BaseLine | "모든열";
export const lineList: BaseLine[] = ["후열", "중열", "전열"]; // .map()용 배열
export const lineListEn: BaseLineEn[] = ["back", "mid", "front"]; // .map()용 배열

export const clashV2Category = ['셰이디의 차원', '림의 이면세계'];

export type SeasonDataMap = { // 시즌데이터 맵핑
    frontier: FrontierSeasonData;
    clash: ClashSeasonData;
};

// '순수': { DEFAULT: '#66c17c', dark: '#4fa163' },
// '냉정': { DEFAULT: '#83b9eb', dark: '#6199cf' },
// '광기': { DEFAULT: '#eb839a', dark: '#cf667d' },
// '활발': { DEFAULT: '#ebdb83', dark: '#cfbe62' },
// '우울': { DEFAULT: '#c683ec', dark: '#a766c9' },

const PERSONALITY_COLORS = {
    '순수': { defalut: '#66c17c', dark: '#4fa163' },
    '냉정': { defalut: '#83b9eb', dark: '#6199cf' },
    '광기': { defalut: '#eb839a', dark: '#cf667d' },
    '활발': { defalut: '#ebdb83', dark: '#cfbe62' },
    '우울': { defalut: '#c683ec', dark: '#a766c9' },
    '공명': { defalut: '#DDDDDD', dark: '#BBBBBB' },
};

// 헥스코드 반환
export const getPersonalityColor = (personality: Personality) => {
    return PERSONALITY_COLORS[personality]?.defalut || '#151e51'; // 프론티어 색상
};
// 다크모드용
export const getPersonalityDarkColor = (personality: Personality) => {
    return PERSONALITY_COLORS[personality]?.dark || '#29356b'; // 다크모드용 밝은 프론티어 색상
};

// 요약 데이터 베이스
export interface BaseSummary {
    name: string;
    count: number;
    line: BaseLine;
}
// 내가 수집한 요약 데이터
type PositionIdxs = { [key: string | number]: number; };
type PercentByLine = Record<BaseLine, number>;
export interface SummaryData extends Omit<BaseSummary, "line"> {
    line: AllLine;
    percent: number;
    personality: Personality;
    positions?: PositionIdxs;
    percentByLine: PercentByLine;
}
// 제공받은 요약 데이터
export interface ExternalSummaryData extends Omit<BaseSummary, "line"> {
    line: AllLine;
    percent: number;
    personality: Personality;
}

export type Facility = '생산 랩' | '연회장' | '교단 본부' | '모험회' | '기록실';
export type FacilityEn = 'lab' | 'hall' | 'hq' | 'adv' | 'archives';
export const facilityList: Facility[] = ['생산 랩', '연회장', '교단 본부', '모험회', '기록실'];

export type Race = '정령' | '엘프' | '요정' | '용족' | '마녀' | '유령' | '수인' | '미스틱';
export const races: Race[] = ['요정', '수인', '엘프', '정령', '유령', '용족', '마녀', '미스틱']; // 인게임 종족 정렬 오피셜 순서

export type ResearchIterable = '물리 공격력' | '마법 공격력' | '물리 방어력' | '마법 방어력' | 'HP'
export const researchIterableStep = ['물리 공격력', '마법 공격력', '물리 방어력', '마법 방어력', 'HP'];

export const dimensionIterableStep = ['HP', '물리 공격력', '마법 공격력', '물리 방어력', '마법 방어력', '치명타', '치명 피해', '치명타 저항', '치명 피해 저항'];

export interface CharacterIconInfo {
    tooltip: string;
    src: string;
}