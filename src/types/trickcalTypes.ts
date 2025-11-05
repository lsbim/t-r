import { ClashSeasonData } from "./clashTypes";
import { FrontierSeasonData } from "./frontierTypes";

// 성격
export type Personality = "광기" | "냉정" | "순수" | "우울" | "활발" | "공명";
export const personalityList = ["광기", "냉정", "순수", "우울", "활발", "공명"];
// 레이드 영문명
export type TrickcalRaidEn = "clash" | "frontier";
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
    '공명': '#ffffff',
};

// 헥스코드 반환
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

export type Facility = '생산 랩' | '연회장' | '교단 본부' | '모험회' | '기록실';
export type FacilityEn = 'lab' | 'hall' | 'hq' | 'adv' | 'archives';
export const facilityList: Facility[] = ['생산 랩', '연회장', '교단 본부', '모험회', '기록실'];

export type Race = '정령' | '엘프' | '요정' | '용족' | '마녀' | '유령' | '수인';
export const races: Race[] = ['요정', '수인', '엘프', '정령', '유령', '용족', '마녀']; // 인게임 종족 정렬 오피셜 순서

export type ResearchIterable = '물리 공격력' | '마법 공격력' | '물리 방어력' | '마법 방어력' | 'HP'
export const researchIterableStep = ['물리 공격력', '마법 공격력', '물리 방어력', '마법 방어력', 'HP'];

// 재료 이름을 유니온 타입으로
export type MaterialName =
    | '무지개 꽃즙'
    | '축축 종이죽'
    | '단단한 돌'
    | '말랑한 나무'
    | '가죽나무 잎'
    | '반짝 유리'
    | '보송 솜'
    | '바삭바삭 금박'
    | '뻣뻣한 천조각'
    | '쪼물딱 점토'
    | '고로쇠 수액'
    | '조각 보석'
    | '스륵스륵 철가루'

    // 2렙
    | '혼모노의 증표'
    | '커미션 사용권'
    | '포인트 장식'
    | '구비구비 철사'
    | '조각조각 기판'
    | '지구에서 온 납'
    | '재활용 플라스틱'
    | '뾰족뾰족 태엽'
    | 'EGO 블럭'
    | '구부리'
    | '말랑 금속'
    | '손도장'
    | '윙크 잉크'
    | '수면 안대'
    | '동수저'

    // 3렙
    | 'S전자 반도체'
    | '배터리 팩'
    | '팅팅탱탱 스프링'
    | 'MUSIM 칩'
    | '뾰족 못'
    | '철야 안대'
    | '네온 사인'

    // 4ㄹ
    | '캐릭터 도장'
    | '금수저'
    | '감성 코어'

    // 꾸미기 재료
    | '악보'
    | '어색 자석'
    | '듬성 깃털'
    | '신선한 플라스틱'
    | '맑은 구슬'
    | '3W 광택제'
    | '친밀 자석'
    | '반질반질 종이'
    | '고퀄 일러스트'
    | '쭈물럭 점토'
    | '부들 천'
    | '모카솜'
    | '포근 깃털'
    | '고순도 플라스틱'
    | '알록달록 구슬'
    | '김덕춘 명인 도안'
    | 'LED 전구'

    // 음식 재료 1ㄹ
    | '과일'
    | '설탕'
    | '밀가루'
    | '모듬 곡식'
    | '팩 선생 만능 소스'
    | '검고 딱딱한 열매'
    | '꿀'
    | '나뭇잎'
    | '채소'
    | '새고기'
    | '물고기'
    | '육고기'
    | '스프링클'
    | '쌀'
    | '달걀'
    | '초콜릿'
    | '우유'
    | '치즈'

    // 음식 재료 2ㄹ
    | '단풍 시럽'
    | '젤라틴'
    | '요구르트'
    | '모둠 견과'
    | '무지개 버섯'

    // 사복 재료
    | '동글동글 단추'
    | '하늘하늘 레이스'
    | '15cm 자'
    | '뾰족 바늘'
    | '치명적 레이스'
    | '안전 바늘'
    | '보석 단추'
    | '줄자';