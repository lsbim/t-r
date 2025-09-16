import { ClashSeasonData } from "./clashTypes";
import { FrontierSeasonData } from "./frontierTypes";

// 성격
export type Personality = "광기" | "냉정" | "순수" | "우울" | "활발";
export const personalityList = ["광기", "냉정", "순수", "우울", "활발"];
// 레이드 영문명
export type TrickcalRaidEn = "clash" | "frontier";
// 성격 시너지용
export interface SynergyItem {
    personality: Personality;
    qty: number;
}
// 범용 배치 라인
export type BaseLine = "전열" | "중열" | "후열";
export type AllLine = BaseLine | "모든열";
export const lineList: BaseLine[] = ["후열", "중열", "전열"]; // .map()용 배열

export type SeasonDataMap = { // 시즌데이터 맵핑
    frontier: FrontierSeasonData;
    clash: ClashSeasonData;
};

const personalityColors = {
    '순수': '#66c17c',
    '냉정': '#83b9eb',
    '광기': '#eb839a',
    '활발': '#ebdb83',
    '우울': '#c683ec',
};

export const getPersonalityColor = (personality: Personality) => {
    return personalityColors[personality] || '#gray'; // 기본값 설정
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
    positions: PositionIdxs;
    percentByLine: PercentByLine;
}
// 제공받은 요약 데이터
export interface ExternalSummaryData extends Omit<BaseSummary, "line"> {
    line: AllLine;
    percent: number;
    personality: Personality;
}