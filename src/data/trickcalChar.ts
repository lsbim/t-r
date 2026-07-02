import { AllLine, Personality, Race } from "../types/trickcalTypes";

// 사도 객체 값
export interface CharInfoDetail {
    grade: number;
    personality: Personality;
    line: AllLine;
    birthdate: string;
    race: Race;
    role: CharRole;
    attackType: CharAttackType;
    eldain?: boolean;
}

export type CharRole = "딜러" | '탱커' | '서포터';

export type CharAttackType = '마법' | '물리';

// 사도 객체 배열
export interface CharInfoType {
    [key: string]: CharInfoDetail
}

export const charInfo: CharInfoType = {
    // 순수
    "비비": { grade: 3, personality: "순수", line: "전열", birthdate: "2023-11-30", role: "탱커", attackType: "마법", race: '용족', eldain: true },
    "다야": { grade: 3, personality: "순수", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "마법", race: '용족' },
    "나이아": { grade: 3, personality: "순수", line: "중열", birthdate: "2023-11-09", role: "서포터", attackType: "마법", race: '정령' },
    "에르핀": { grade: 3, personality: "순수", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "마법", race: '요정' },
    "캬롯": { grade: 3, personality: "순수", line: "후열", birthdate: "2024-04-25", role: "서포터", attackType: "마법", race: '요정' },
    "헤일리": { grade: 3, personality: "순수", line: "중열", birthdate: "2024-07-04", role: "딜러", attackType: "물리", race: '엘프' },
    "셰럼": { grade: 3, personality: "순수", line: "전열", birthdate: "2024-09-12", role: "탱커", attackType: "마법", race: '마녀' },
    "오팔": { grade: 3, personality: "순수", line: "중열", birthdate: "2024-12-19", role: "서포터", attackType: "물리", race: '용족' },
    "란": { grade: 3, personality: "순수", line: "후열", birthdate: "2025-01-02", role: "딜러", attackType: "마법", race: '수인', eldain: true },
    "라이카": { grade: 3, personality: "순수", line: "전열", birthdate: "2025-03-13", role: "딜러", attackType: "물리", race: '정령' },
    "마요(멋짐)": { grade: 3, personality: "순수", line: "중열", birthdate: "2025-05-08", role: "딜러", attackType: "물리", race: '요정' },
    "캐시": { grade: 3, personality: "순수", line: "후열", birthdate: "2025-07-03", role: "딜러", attackType: "물리", race: '엘프' },
    "뮤트": { grade: 3, personality: "순수", line: "후열", birthdate: "2025-09-11", role: "서포터", attackType: "마법", race: '정령' },
    "아일라": { grade: 3, personality: "순수", line: "중열", birthdate: "2025-12-18", role: "서포터", attackType: "마법", race: '정령' },
    "델리아": { grade: 3, personality: "순수", line: "전열", birthdate: "2026-03-12", role: "딜러", attackType: "물리", race: '수인' },
    "에르핀(왕도)": { grade: 3, personality: "순수", line: "중열", birthdate: "2026-03-28", role: "딜러", attackType: "마법", race: '요정', eldain: true },
    "이드(재활)": { grade: 3, personality: "순수", line: "전열", birthdate: "2026-05-21", role: "탱커", attackType: "마법", race: '엘프' },
    "가비아": { grade: 2, personality: "순수", line: "중열", birthdate: "2023-09-27", role: "서포터", attackType: "마법", race: '정령' },
    "로네": { grade: 2, personality: "순수", line: "전열", birthdate: "2023-09-27", role: "탱커", attackType: "물리", race: '엘프' },
    "마고": { grade: 2, personality: "순수", line: "중열", birthdate: "2023-09-27", role: "서포터", attackType: "마법", race: '수인' },
    "빅우드": { grade: 2, personality: "순수", line: "전열", birthdate: "2023-09-27", role: "탱커", attackType: "물리", race: '정령' },
    "스피키": { grade: 2, personality: "순수", line: "후열", birthdate: "2023-09-27", role: "서포터", attackType: "마법", race: '유령' },
    "알레트": { grade: 1, personality: "순수", line: "전열", birthdate: "2023-09-27", role: "탱커", attackType: "물리", race: '엘프' },
    "사리": { grade: 1, personality: "순수", line: "중열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '유령' },
    "큐이": { grade: 1, personality: "순수", line: "중열", birthdate: "2023-09-27", role: "서포터", attackType: "마법", race: '요정' },

    // 냉정
    "이드": { grade: 3, personality: "냉정", line: "전열", birthdate: "2024-03-28", role: "탱커", attackType: "마법", race: '엘프', eldain: true },
    "아야": { grade: 3, personality: "냉정", line: "중열", birthdate: "2023-09-27", role: "딜러", attackType: "마법", race: '마녀', eldain: true },
    "벨벳": { grade: 3, personality: "냉정", line: "전열", birthdate: "2023-09-27", role: "탱커", attackType: "물리", race: '마녀' },
    "엘레나": { grade: 3, personality: "냉정", line: "중열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '엘프' },
    "제이드": { grade: 3, personality: "냉정", line: "중열", birthdate: "2023-09-27", role: "딜러", attackType: "마법", race: '용족' },
    "프리클": { grade: 3, personality: "냉정", line: "중열", birthdate: "2023-09-27", role: "딜러", attackType: "마법", race: '마녀' },
    "실라": { grade: 3, personality: "냉정", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '정령' },
    "멜루나": { grade: 3, personality: "냉정", line: "후열", birthdate: "2023-09-27", role: "서포터", attackType: "마법", race: '정령' },
    "아멜리아": { grade: 3, personality: "냉정", line: "후열", birthdate: "2023-09-27", role: "서포터", attackType: "물리", race: '엘프' },
    "피코라": { grade: 3, personality: "냉정", line: "후열", birthdate: "2024-02-22", role: "서포터", attackType: "마법", race: '마녀' },
    "코미(수영복)": { grade: 3, personality: "냉정", line: "중열", birthdate: "2024-06-06", role: "서포터", attackType: "마법", race: '수인' },
    "바롱": { grade: 3, personality: "냉정", line: "전열", birthdate: "2024-08-01", role: "딜러", attackType: "마법", race: '유령' },
    "그윈": { grade: 3, personality: "냉정", line: "전열", birthdate: "2024-10-24", role: "서포터", attackType: "마법", race: '수인' },
    "아이시아": { grade: 3, personality: "냉정", line: "후열", birthdate: "2025-01-30", role: "딜러", attackType: "마법", race: '엘프' },
    "리코타": { grade: 3, personality: "냉정", line: "전열", birthdate: "2025-04-24", role: "탱커", attackType: "물리", race: '요정' },
    "디아나(왕년)": { grade: 3, personality: "냉정", line: "전열", birthdate: "2025-06-05", role: "딜러", attackType: "물리", race: '수인', eldain: true },
    "시저": { grade: 3, personality: "냉정", line: "중열", birthdate: "2025-08-28", role: "서포터", attackType: "마법", race: '정령' },
    "베니(베니)": { grade: 3, personality: "냉정", line: "후열", birthdate: "2025-11-20", role: "딜러", attackType: "물리", race: '수인' },
    "잉클": { grade: 3, personality: "냉정", line: "후열", birthdate: "2026-02-12", role: "딜러", attackType: "마법", race: '정령' },
    "아라그니아": { grade: 3, personality: "냉정", line: "중열", birthdate: "2026-04-23", role: "서포터", attackType: "마법", race: '용족' },
    "에스피": { grade: 2, personality: "냉정", line: "후열", birthdate: "2023-09-27", role: "서포터", attackType: "마법", race: '유령' },
    "레테": { grade: 2, personality: "냉정", line: "전열", birthdate: "2024-07-04", role: "탱커", attackType: "물리", race: '유령' },
    "칸타": { grade: 2, personality: "냉정", line: "중열", birthdate: "2024-09-12", role: "딜러", attackType: "물리", race: '요정' },
    "파트라": { grade: 1, personality: "냉정", line: "전열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '요정' },
    "레이지": { grade: 1, personality: "냉정", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '엘프' },

    // 광기
    "클로에": { grade: 3, personality: "광기", line: "전열", birthdate: "2023-09-27", role: "탱커", attackType: "마법", race: '요정', eldain: true },
    "리츠": { grade: 3, personality: "광기", line: "전열", birthdate: "2024-02-08", role: "딜러", attackType: "물리", race: '용족' },
    "셰이디": { grade: 3, personality: "광기", line: "전열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '유령' },
    "시스트": { grade: 3, personality: "광기", line: "중열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '용족' },
    "앨리스": { grade: 3, personality: "광기", line: "중열", birthdate: "2024-01-25", role: "딜러", attackType: "마법", race: '유령' },
    "벨리타": { grade: 3, personality: "광기", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "마법", race: '마녀' },
    "네르": { grade: 3, personality: "광기", line: "전열", birthdate: "2023-09-27", role: "서포터", attackType: "마법", race: '요정' },
    "디아나": { grade: 3, personality: "광기", line: "중열", birthdate: "2023-09-27", role: "서포터", attackType: "마법", race: '수인' },
    "롤렛": { grade: 3, personality: "광기", line: "후열", birthdate: "2024-05-09", role: "딜러", attackType: "마법", race: '마녀' },
    "리뉴아": { grade: 3, personality: "광기", line: "중열", birthdate: "2024-06-20", role: "딜러", attackType: "물리", race: '엘프', eldain: true },
    "피라": { grade: 3, personality: "광기", line: "후열", birthdate: "2024-08-29", role: "서포터", attackType: "물리", race: '용족' },
    "폴랑": { grade: 3, personality: "광기", line: "후열", birthdate: "2024-11-07", role: "서포터", attackType: "물리", race: '요정' },
    "림(혼돈)": { grade: 3, personality: "광기", line: "후열", birthdate: "2025-01-16", role: "딜러", attackType: "물리", race: '유령' },
    "네티": { grade: 3, personality: "광기", line: "전열", birthdate: "2025-04-10", role: "탱커", attackType: "물리", race: '용족' },
    "아네트": { grade: 3, personality: "광기", line: "중열", birthdate: "2025-07-17", role: "서포터", attackType: "마법", race: '용족' },
    "티그(영웅)": { grade: 3, personality: "광기", line: "모든열", birthdate: "2025-09-27", role: "딜러", attackType: "물리", race: '수인', eldain: true },
    "하이디": { grade: 3, personality: "광기", line: "후열", birthdate: "2025-12-04", role: "딜러", attackType: "물리", race: '엘프' },
    "다야(퓨어샤인)": { grade: 3, personality: "광기", line: "중열", birthdate: "2026-01-29", role: "서포터", attackType: "마법", race: '용족' },
    "헤일리(멀쩡)": { grade: 3, personality: "광기", line: "전열", birthdate: "2026-04-09", role: "탱커", attackType: "물리", race: '엘프' },
    "실비아": { grade: 3, personality: "광기", line: "전열", birthdate: "2026-06-18", role: "탱커", attackType: "마법", race: '용족', eldain: true },
    "스키아": { grade: 3, personality: "광기", line: "후열", birthdate: "2026-07-02", role: "서포터", attackType: "마법", race: '요정' },
    "마에스트로 2호": { grade: 2, personality: "광기", line: "전열", birthdate: "2023-09-27", role: "탱커", attackType: "물리", race: '엘프' },
    "이프리트": { grade: 2, personality: "광기", line: "전열", birthdate: "2023-09-27", role: "딜러", attackType: "마법", race: '정령' },
    "마요": { grade: 2, personality: "광기", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '요정' },
    "메죵": { grade: 1, personality: "광기", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '요정' },
    "유미미": { grade: 1, personality: "광기", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '요정' },

    // 활발
    "에피카": { grade: 3, personality: "활발", line: "중열", birthdate: "2024-01-04", role: "딜러", attackType: "물리", race: '수인', eldain: true },
    "우이": { grade: 3, personality: "활발", line: "중열", birthdate: "2023-09-27", role: "서포터", attackType: "마법", race: '정령', eldain: true },
    "루드": { grade: 3, personality: "활발", line: "전열", birthdate: "2023-09-27", role: "탱커", attackType: "물리", race: '용족' },
    "셀리네": { grade: 3, personality: "활발", line: "전열", birthdate: "2023-12-21", role: "탱커", attackType: "마법", race: '유령' },
    "티그": { grade: 3, personality: "활발", line: "전열", birthdate: "2023-10-19", role: "딜러", attackType: "물리", race: '수인' },
    "루포": { grade: 3, personality: "활발", line: "중열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '수인' },
    "버터": { grade: 3, personality: "활발", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '수인' },
    "칸나": { grade: 3, personality: "활발", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '엘프' },
    "슈팡": { grade: 3, personality: "활발", line: "후열", birthdate: "2024-04-11", role: "서포터", attackType: "마법", race: '요정' },
    "모모": { grade: 3, personality: "활발", line: "후열", birthdate: "2024-07-18", role: "딜러", attackType: "마법", race: '수인' },
    "스피키(메이드)": { grade: 3, personality: "활발", line: "후열", birthdate: "2024-11-21", role: "딜러", attackType: "마법", race: '유령' },
    "슈로": { grade: 3, personality: "활발", line: "전열", birthdate: "2025-02-27", role: "서포터", attackType: "물리", race: '수인' },
    "벨라": { grade: 3, personality: "활발", line: "전열", birthdate: "2025-03-27", role: "탱커", attackType: "마법", race: '유령', eldain: true },
    "아르코": { grade: 3, personality: "활발", line: "중열", birthdate: "2025-06-19", role: "딜러", attackType: "물리", race: '정령' },
    "마카샤": { grade: 3, personality: "활발", line: "중열", birthdate: "2025-08-14", role: "서포터", attackType: "마법", race: '마녀' },
    "미로": { grade: 3, personality: "활발", line: "전열", birthdate: "2025-10-23", role: "탱커", attackType: "물리", race: '정령' },
    "셰이디(역전)": { grade: 3, personality: "활발", line: "후열", birthdate: "2026-01-15", role: "서포터", attackType: "물리", race: '유령' },
    "네르(빡침)": { grade: 3, personality: "활발", line: "후열", birthdate: "2026-03-26", role: "딜러", attackType: "물리", race: '요정', eldain: true },
    "레비(졸업)": { grade: 3, personality: "활발", line: "전열", birthdate: "2026-05-07", role: "탱커", attackType: "물리", race: '마녀' },
    "마리": { grade: 2, personality: "활발", line: "중열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '요정' },
    "베니": { grade: 2, personality: "활발", line: "전열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '수인' },
    "쥬비": { grade: 2, personality: "활발", line: "중열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '정령' },
    "바나": { grade: 2, personality: "활발", line: "후열", birthdate: "2024-05-09", role: "서포터", attackType: "물리", race: '수인' },
    "밍스": { grade: 1, personality: "활발", line: "전열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '수인' },
    "타이다": { grade: 1, personality: "활발", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '엘프' },
    "카렌": { grade: 1, personality: "활발", line: "후열", birthdate: "2023-09-27", role: "서포터", attackType: "마법", race: '요정' },

    // 우울
    "시온": { grade: 3, personality: "우울", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '유령', eldain: true },
    "코미": { grade: 3, personality: "우울", line: "전열", birthdate: "2023-09-27", role: "탱커", attackType: "물리", race: '수인' },
    "림": { grade: 3, personality: "우울", line: "전열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '유령' },
    "키디언": { grade: 3, personality: "우울", line: "전열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '용족' },
    "블랑셰": { grade: 3, personality: "우울", line: "중열", birthdate: "2024-03-14", role: "딜러", attackType: "마법", race: '정령' },
    "에슈르": { grade: 3, personality: "우울", line: "후열", birthdate: "2023-09-27", role: "딜러", attackType: "마법", race: '요정' },
    "힐데": { grade: 3, personality: "우울", line: "중열", birthdate: "2023-12-14", role: "서포터", attackType: "마법", race: '엘프' },
    "포셔": { grade: 3, personality: "우울", line: "후열", birthdate: "2023-09-27", role: "서포터", attackType: "마법", race: '마녀' },
    "리스티": { grade: 3, personality: "우울", line: "후열", birthdate: "2024-05-23", role: "딜러", attackType: "물리", race: '엘프' },
    "스노키": { grade: 3, personality: "우울", line: "전열", birthdate: "2024-08-15", role: "탱커", attackType: "물리", race: '마녀' },
    "죠안": { grade: 3, personality: "우울", line: "모든열", birthdate: "2024-09-26", role: "서포터", attackType: "물리", race: '요정', eldain: true },
    "리온": { grade: 3, personality: "우울", line: "전열", birthdate: "2024-12-05", role: "탱커", attackType: "물리", race: '수인' },
    "샤샤": { grade: 3, personality: "우울", line: "중열", birthdate: "2025-02-13", role: "딜러", attackType: "마법", race: '요정' },
    "오르": { grade: 3, personality: "우울", line: "후열", birthdate: "2025-05-22", role: "서포터", attackType: "마법", race: '엘프' },
    "로네(시장)": { grade: 3, personality: "우울", line: "중열", birthdate: "2025-07-31", role: "딜러", attackType: "물리", race: '엘프' },
    "아사나": { grade: 3, personality: "우울", line: "전열", birthdate: "2025-11-06", role: "탱커", attackType: "물리", race: '마녀' },
    "요미": { grade: 3, personality: "우울", line: "중열", birthdate: "2026-01-01", role: "딜러", attackType: "마법", race: '미스틱', eldain: true },
    "아멜리아(R41)": { grade: 3, personality: "우울", line: "후열", birthdate: "2026-02-26", role: "서포터", attackType: "마법", race: '엘프' },
    "키샤": { grade: 3, personality: "우울", line: "중열", birthdate: "2026-06-04", role: "서포터", attackType: "마법", race: '유령' },
    "레비": { grade: 2, personality: "우울", line: "중열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '마녀' },
    "실피르": { grade: 2, personality: "우울", line: "중열", birthdate: "2023-11-09", role: "딜러", attackType: "물리", race: '용족' },
    "페스타": { grade: 2, personality: "우울", line: "전열", birthdate: "2023-09-27", role: "서포터", attackType: "물리", race: '엘프' },
    "바리에": { grade: 2, personality: "우울", line: "후열", birthdate: "2024-08-01", role: "서포터", attackType: "마법", race: '마녀' },
    "베루": { grade: 1, personality: "우울", line: "중열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '유령' },
    "쵸피": { grade: 1, personality: "우울", line: "중열", birthdate: "2023-09-27", role: "딜러", attackType: "물리", race: '수인' },

    // 공명
    "우로스": { grade: 3, personality: "공명", line: "후열", birthdate: "2025-09-25", role: "서포터", attackType: "물리", race: '수인', eldain: true },

    "우로스(순수)": { grade: 3, personality: "순수", line: "후열", birthdate: "2025-09-25", role: "서포터", attackType: "물리", race: '수인' },
    "우로스(활발)": { grade: 3, personality: "활발", line: "후열", birthdate: "2025-09-25", role: "서포터", attackType: "물리", race: '수인' },
    "우로스(우울)": { grade: 3, personality: "우울", line: "후열", birthdate: "2025-09-25", role: "서포터", attackType: "물리", race: '수인' },
    "우로스(냉정)": { grade: 3, personality: "냉정", line: "후열", birthdate: "2025-09-25", role: "서포터", attackType: "물리", race: '수인' },
    "우로스(광기)": { grade: 3, personality: "광기", line: "후열", birthdate: "2025-09-25", role: "서포터", attackType: "물리", race: '수인' },
};
// 성격별 우로스처럼 찢어놓은 사도는 타임라인, 사복 목록같은 곳에 나오지 않도록 추가 조정필요
