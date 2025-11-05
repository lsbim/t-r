import { AllLine, Personality, Race } from "../types/trickcalTypes";

// 사도 객체 값
export interface CharInfoDetail {
    grade: number;
    personality: Personality;
    line: AllLine;
    birthdate: string;
    race?: Race;
}
// 사도 객체 배열
export interface CharInfoType {
    [key: string]: CharInfoDetail
}

export const charInfo: CharInfoType = {
    // 순수
    "비비": { grade: 3, personality: "순수", line: "전열", birthdate: "2023-11-30", race: '용족' },
    "다야": { grade: 3, personality: "순수", line: "후열", birthdate: "2023-09-27", race: '용족' },
    "나이아": { grade: 3, personality: "순수", line: "중열", birthdate: "2023-11-09", race: '정령' },
    "에르핀": { grade: 3, personality: "순수", line: "후열", birthdate: "2023-09-27", race: '요정' },
    "캬롯": { grade: 3, personality: "순수", line: "후열", birthdate: "2024-04-25", race: '요정' },
    "헤일리": { grade: 3, personality: "순수", line: "중열", birthdate: "2024-07-04", race: '엘프' },
    "셰럼": { grade: 3, personality: "순수", line: "전열", birthdate: "2024-09-12", race: '마녀' },
    "오팔": { grade: 3, personality: "순수", line: "중열", birthdate: "2024-12-19", race: '용족' },
    "란": { grade: 3, personality: "순수", line: "후열", birthdate: "2025-01-02", race: '수인' },
    "라이카": { grade: 3, personality: "순수", line: "전열", birthdate: "2025-03-13", race: '정령' },
    "마요(멋짐)": { grade: 3, personality: "순수", line: "중열", birthdate: "2025-05-08", race: '요정' },
    "캐시": { grade: 3, personality: "순수", line: "후열", birthdate: "2025-07-03", race: '엘프' },
    "뮤트": { grade: 3, personality: "순수", line: "후열", birthdate: "2025-09-11", race: '정령' },
    "가비아": { grade: 2, personality: "순수", line: "중열", birthdate: "2023-09-27", race: '정령' },
    "로네": { grade: 2, personality: "순수", line: "전열", birthdate: "2023-09-27", race: '엘프' },
    "마고": { grade: 2, personality: "순수", line: "중열", birthdate: "2023-09-27", race: '요정' },
    "빅우드": { grade: 2, personality: "순수", line: "전열", birthdate: "2023-09-27", race: '정령' },
    "스피키": { grade: 2, personality: "순수", line: "후열", birthdate: "2023-09-27", race: '유령' },
    "알레트": { grade: 1, personality: "순수", line: "전열", birthdate: "2023-09-27" },
    "사리": { grade: 1, personality: "순수", line: "중열", birthdate: "2023-09-27" },
    "큐이": { grade: 1, personality: "순수", line: "중열", birthdate: "2023-09-27" },

    // 냉정
    "이드": { grade: 3, personality: "냉정", line: "전열", birthdate: "2024-03-28", race: '엘프' },
    "아야": { grade: 3, personality: "냉정", line: "중열", birthdate: "2023-09-27", race: '마녀' },
    "벨벳": { grade: 3, personality: "냉정", line: "전열", birthdate: "2023-09-27", race: '마녀' },
    "엘레나": { grade: 3, personality: "냉정", line: "중열", birthdate: "2023-09-27", race: '엘프' },
    "제이드": { grade: 3, personality: "냉정", line: "중열", birthdate: "2023-09-27", race: '용족' },
    "프리클": { grade: 3, personality: "냉정", line: "중열", birthdate: "2023-09-27", race: '마녀' },
    "실라": { grade: 3, personality: "냉정", line: "후열", birthdate: "2023-09-27", race: '정령' },
    "멜루나": { grade: 3, personality: "냉정", line: "후열", birthdate: "2023-09-27", race: '정령' },
    "아멜리아": { grade: 3, personality: "냉정", line: "후열", birthdate: "2023-09-27", race: '엘프' },
    "피코라": { grade: 3, personality: "냉정", line: "후열", birthdate: "2024-02-22", race: '마녀' },
    "코미(수영복)": { grade: 3, personality: "냉정", line: "중열", birthdate: "2024-06-06", race: '수인' },
    "바롱": { grade: 3, personality: "냉정", line: "전열", birthdate: "2024-08-01", race: '유령' },
    "그윈": { grade: 3, personality: "냉정", line: "전열", birthdate: "2024-10-24", race: '수인' },
    "아이시아": { grade: 3, personality: "냉정", line: "후열", birthdate: "2025-01-30", race: '엘프' },
    "리코타": { grade: 3, personality: "냉정", line: "전열", birthdate: "2025-04-24", race: '요정' },
    "디아나(왕년)": { grade: 3, personality: "냉정", line: "전열", birthdate: "2025-06-05", race: '수인' },
    "시저": { grade: 3, personality: "냉정", line: "중열", birthdate: "2025-08-28", race: '정령' },
    "에스피": { grade: 2, personality: "냉정", line: "후열", birthdate: "2023-09-27", race: '유령' },
    "레테": { grade: 2, personality: "냉정", line: "전열", birthdate: "2024-07-04", race: '유령' },
    "칸타": { grade: 2, personality: "냉정", line: "중열", birthdate: "2024-09-12", race: '요정' },
    "파트라": { grade: 1, personality: "냉정", line: "전열", birthdate: "2023-09-27" },
    "레이지": { grade: 1, personality: "냉정", line: "후열", birthdate: "2023-09-27" },

    // 광기
    "클로에": { grade: 3, personality: "광기", line: "전열", birthdate: "2023-09-27", race: '요정' },
    "리츠": { grade: 3, personality: "광기", line: "전열", birthdate: "2024-02-08", race: '용족' },
    "셰이디": { grade: 3, personality: "광기", line: "전열", birthdate: "2023-09-27", race: '유령' },
    "시스트": { grade: 3, personality: "광기", line: "중열", birthdate: "2023-09-27", race: '용족' },
    "앨리스": { grade: 3, personality: "광기", line: "중열", birthdate: "2024-01-25", race: '유령' },
    "벨리타": { grade: 3, personality: "광기", line: "후열", birthdate: "2023-09-27", race: '마녀' },
    "네르": { grade: 3, personality: "광기", line: "전열", birthdate: "2023-09-27", race: '요정' },
    "디아나": { grade: 3, personality: "광기", line: "중열", birthdate: "2023-09-27", race: '수인' },
    "롤렛": { grade: 3, personality: "광기", line: "후열", birthdate: "2024-05-09", race: '마녀' },
    "리뉴아": { grade: 3, personality: "광기", line: "중열", birthdate: "2024-06-20", race: '엘프' },
    "피라": { grade: 3, personality: "광기", line: "후열", birthdate: "2024-08-29", race: '용족' },
    "폴랑": { grade: 3, personality: "광기", line: "후열", birthdate: "2024-11-07", race: '요정' },
    "림(혼돈)": { grade: 3, personality: "광기", line: "후열", birthdate: "2025-01-16", race: '유령' },
    "네티": { grade: 3, personality: "광기", line: "전열", birthdate: "2025-04-10", race: '용족' },
    "아네트": { grade: 3, personality: "광기", line: "중열", birthdate: "2025-07-17", race: '용족' },
    "티그(영웅)": { grade: 3, personality: "광기", line: "모든열", birthdate: "2025-09-27", race: '수인' },
    "마에스트로 2호": { grade: 2, personality: "광기", line: "전열", birthdate: "2023-09-27", race: '엘프' },
    "이프리트": { grade: 2, personality: "광기", line: "전열", birthdate: "2023-09-27", race: '정령' },
    "마요": { grade: 2, personality: "광기", line: "후열", birthdate: "2023-09-27", race: '요정' },
    "메죵": { grade: 1, personality: "광기", line: "후열", birthdate: "2023-09-27" },
    "유미미": { grade: 1, personality: "광기", line: "후열", birthdate: "2023-09-27" },

    // 활발
    "에피카": { grade: 3, personality: "활발", line: "중열", birthdate: "2024-01-04", race: '수인' },
    "우이": { grade: 3, personality: "활발", line: "중열", birthdate: "2023-09-27", race: '정령' },
    "루드": { grade: 3, personality: "활발", line: "전열", birthdate: "2023-09-27", race: '용족' },
    "셀리네": { grade: 3, personality: "활발", line: "전열", birthdate: "2023-12-21", race: '유령' },
    "티그": { grade: 3, personality: "활발", line: "전열", birthdate: "2023-10-19", race: '수인' },
    "루포": { grade: 3, personality: "활발", line: "중열", birthdate: "2023-09-27", race: '수인' },
    "버터": { grade: 3, personality: "활발", line: "후열", birthdate: "2023-09-27", race: '수인' },
    "칸나": { grade: 3, personality: "활발", line: "후열", birthdate: "2023-09-27", race: '엘프' },
    "슈팡": { grade: 3, personality: "활발", line: "후열", birthdate: "2024-04-11", race: '요정' },
    "모모": { grade: 3, personality: "활발", line: "후열", birthdate: "2024-07-18", race: '수인' },
    "스피키(메이드)": { grade: 3, personality: "활발", line: "후열", birthdate: "2024-11-21", race: '유령' },
    "슈로": { grade: 3, personality: "활발", line: "전열", birthdate: "2025-02-27", race: '수인' },
    "벨라": { grade: 3, personality: "활발", line: "전열", birthdate: "2025-03-27", race: '유령' },
    "아르코": { grade: 3, personality: "활발", line: "중열", birthdate: "2025-06-19", race: '정령' },
    "마카샤": { grade: 3, personality: "활발", line: "중열", birthdate: "2025-08-14", race: '마녀' },
    "미로": { grade: 3, personality: "활발", line: "전열", birthdate: "2025-10-23", race: '정령' },
    "마리": { grade: 2, personality: "활발", line: "중열", birthdate: "2023-09-27", race: '요정' },
    "베니": { grade: 2, personality: "활발", line: "전열", birthdate: "2023-09-27", race: '수인' },
    "쥬비": { grade: 2, personality: "활발", line: "중열", birthdate: "2023-09-27", race: '정령' },
    "바나": { grade: 2, personality: "활발", line: "후열", birthdate: "2024-05-09", race: '수인' },
    "밍스": { grade: 1, personality: "활발", line: "전열", birthdate: "2023-09-27" },
    "타이다": { grade: 1, personality: "활발", line: "후열", birthdate: "2023-09-27" },
    "카렌": { grade: 1, personality: "활발", line: "후열", birthdate: "2023-09-27" },

    // 우울
    "시온": { grade: 3, personality: "우울", line: "후열", birthdate: "2023-09-27", race: '유령' },
    "코미": { grade: 3, personality: "우울", line: "전열", birthdate: "2023-09-27", race: '수인' },
    "림": { grade: 3, personality: "우울", line: "전열", birthdate: "2023-09-27", race: '유령' },
    "키디언": { grade: 3, personality: "우울", line: "전열", birthdate: "2023-09-27", race: '용족' },
    "블랑셰": { grade: 3, personality: "우울", line: "중열", birthdate: "2024-03-14", race: '정령' },
    "에슈르": { grade: 3, personality: "우울", line: "후열", birthdate: "2023-09-27", race: '요정' },
    "힐데": { grade: 3, personality: "우울", line: "중열", birthdate: "2023-12-14", race: '엘프' },
    "포셔": { grade: 3, personality: "우울", line: "후열", birthdate: "2023-09-27", race: '마녀' },
    "리스티": { grade: 3, personality: "우울", line: "후열", birthdate: "2024-05-23", race: '엘프' },
    "스노키": { grade: 3, personality: "우울", line: "전열", birthdate: "2024-08-15", race: '마녀' },
    "죠안": { grade: 3, personality: "우울", line: "모든열", birthdate: "2024-09-26", race: '요정' },
    "리온": { grade: 3, personality: "우울", line: "전열", birthdate: "2024-12-05", race: '수인' },
    "샤샤": { grade: 3, personality: "우울", line: "중열", birthdate: "2025-02-13", race: '요정' },
    "오르": { grade: 3, personality: "우울", line: "후열", birthdate: "2025-05-22", race: '엘프' },
    "로네(시장)": { grade: 3, personality: "우울", line: "중열", birthdate: "2025-07-31", race: '엘프' },
    "아사나": { grade: 3, personality: "우울", line: "전열", birthdate: "2025-11-06", race: '마녀' },
    "레비": { grade: 2, personality: "우울", line: "중열", birthdate: "2023-09-27", race: '마녀' },
    "실피르": { grade: 2, personality: "우울", line: "중열", birthdate: "2023-11-09", race: '용족' },
    "페스타": { grade: 2, personality: "우울", line: "전열", birthdate: "2023-09-27", race: '엘프' },
    "바리에": { grade: 2, personality: "우울", line: "후열", birthdate: "2024-08-01", race: '마녀' },
    "베루": { grade: 1, personality: "우울", line: "중열", birthdate: "2023-09-27" },
    "쵸피": { grade: 1, personality: "우울", line: "중열", birthdate: "2023-09-27" },

    // 공명
    "우로스": { grade: 3, personality: "공명", line: "후열", birthdate: "2025-09-25", race: '수인' },

    "우로스(순수)": { grade: 3, personality: "순수", line: "후열", birthdate: "2025-09-25" },
    "우로스(활발)": { grade: 3, personality: "활발", line: "후열", birthdate: "2025-09-25" },
    "우로스(우울)": { grade: 3, personality: "우울", line: "후열", birthdate: "2025-09-25" },
    "우로스(냉정)": { grade: 3, personality: "냉정", line: "후열", birthdate: "2025-09-25" },
    "우로스(광기)": { grade: 3, personality: "광기", line: "후열", birthdate: "2025-09-25" },
};
// 성격별 우로스처럼 찢어놓은 사도는 타임라인, 사복 목록같은 곳에 나오지 않도록 추가 조정필요
