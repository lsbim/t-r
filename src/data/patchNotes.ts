export const PATCH_CATEGORIES = [
    "character_balance",          // 사도 밸런스 패치

    "invasion_world",             // 침략 월드 개방
    "research_lab",               // 연구실 단계

    "clash_level",                // 차원 대충돌 단계 확장
    "frontier_level",             // 프론티어 단계 확장
    "clash_v2_level",             // 차원 대충돌 2.0 단계 확장

    "gta_dungeon",                // GTA 단계
    "crash_course",               // 단기 속성반 단계
    "secret_bakery_dungeon",      // 비밀의 베이커리 단계
    "clone_factory_dungeon",      // 클론 팩토리 단계
    // "sugar_free_dungeon",      // 슈가 프리 단계
    // "get_your_crayon_dungeon", // 겟츄 크레용 던전 단계

    "gear_rank",                  // 장비 랭크
    "user_max_level",             // 교주 레벨 상한
    "worldtree_relic",            // 세계수 성물 레벨
    "nururing",                   // 누루링 버스터즈 단계
    "dig_base",                   // 세계수 굴착기지
    "kyarot_garden",              // 캬롯의 정원
] as const;

export type PatchCategory = typeof PATCH_CATEGORIES[number];

// 2회 이상 적용된 패치에 카테고리 적용할 것

export interface PatchNote {
    date: string;
    content: string;
    category?: PatchCategory;
}

export const patchNotes: PatchNote[] = [
    // 2023
    { date: "2023-10-05", content: "클론 팩토리 일일 3 → 5회 확장", category: "clone_factory_dungeon" },
    { date: "2023-10-05", content: "신앙심 → 엘시드 교환 시스템 추가" },
    { date: "2023-10-05", content: "세계수 굴착기지 30 → 50단계 확장", category: "dig_base" },
    { date: "2023-10-05", content: "관심사도 2성 → 1~3성까지 확장" },
    { date: "2023-10-05", content: "차원 대충돌 프리시즌 오픈", category: "clash_level" },
    { date: "2023-10-12", content: "침략 16/17 월드 개방", category: "invasion_world" },
    { date: "2023-11-02", content: "루포 리워크 패치", category: "character_balance" },
    { date: "2023-11-16", content: "7랭크 장비 추가", category: "gear_rank" },
    { date: "2023-11-16", content: "침략 18/19/20 월드 개방", category: "invasion_world" },
    { date: "2023-11-23", content: "다야 리워크 패치", category: "character_balance" },
    { date: "2023-11-30", content: "승자의 줘팸터 정규 시즌 오픈" },
    { date: "2023-11-30", content: "보드 초기화 기능 추가" },

    // 2024
    { date: "2024-01-11", content: "침략 21/22 월드 개방", category: "invasion_world" },
    { date: "2024-01-11", content: "생활 스킬 초기화 기능 추가" },
    { date: "2024-01-18", content: "제이드/벨리타 리워크 패치", category: "character_balance" },
    { date: "2024-01-18", content: "교주 75 → 100레벨 상한 해방", category: "user_max_level" },
    { date: "2024-01-18", content: "평일 농장/펫 시스템 추가" },
    { date: "2024-01-25", content: "승자의 줘팸터 주기 2개월 → 4주 변경" },
    { date: "2024-01-25", content: "물리/마법 공격력 보드 통합" },
    { date: "2024-02-01", content: "교주의 방(부동산) 시스템 추가" },
    { date: "2024-02-29", content: "아멜리아 밸런스 패치", category: "character_balance" },
    { date: "2024-02-29", content: "8랭크 장비 추가", category: "gear_rank" },
    { date: "2024-02-29", content: "침략 23/24 월드 개방", category: "invasion_world" },
    { date: "2024-03-07", content: "프리클 리워크 패치", category: "character_balance" },
    { date: "2024-03-07", content: "차원 대충돌 15 → 21단계 확장", category: "clash_level" },
    { date: "2024-03-14", content: "엘리아스 프론티어 BETA 오픈", category: "frontier_level" },
    { date: "2024-03-21", content: "엘레나 밸런스 패치", category: "character_balance" },
    { date: "2024-04-18", content: "침략 25/26 월드 개방", category: "invasion_world" },
    { date: "2024-05-02", content: "복층 성북 대저택(크레페 일괄 청소) 추가" },
    { date: "2024-05-09", content: "기록소[기억조각] 시스템 추가" },
    { date: "2024-05-09", content: "연구실 9/10단계 확장", category: "research_lab" },
    { date: "2024-05-16", content: "실라 밸런스 패치", category: "character_balance" },
    { date: "2024-05-23", content: "애착 아티팩트 시스템 추가" },
    { date: "2024-05-23", content: "오락실 콘텐츠 추가" },
    { date: "2024-05-23", content: "칸나 밸런스 패치", category: "character_balance" },
    { date: "2024-06-06", content: "사복 시스템 추가" },
    { date: "2024-06-06", content: "어사이드 시스템 추가" },
    { date: "2024-06-06", content: "누루링 버스터즈 콘텐츠 추가", category: "nururing" },
    { date: "2024-06-06", content: "펫 심부름 콘텐츠 추가" },
    { date: "2024-06-06", content: "클론 팩토리 일일 5 → 8회 확장", category: "clone_factory_dungeon" },
    { date: "2024-06-13", content: "힐데 밸런스 패치", category: "character_balance" },
    { date: "2024-06-13", content: "엘리아스 프론티어 정규 시즌 오픈" },
    { date: "2024-07-04", content: "단기 속성반 25 → 30단계 확장", category: "crash_course" },
    { date: "2024-07-11", content: "루드/빅우드/마에스트로 2호/에스피/베니/페스타 밸런스 패치", category: "character_balance" },
    { date: "2024-07-18", content: "침략 27/28 월드 개방", category: "invasion_world" },
    { date: "2024-07-18", content: "9랭크 장비 추가", category: "gear_rank" },
    { date: "2024-07-18", content: "비밀의 베이커리 30 → 35단계 확장", category: "secret_bakery_dungeon" },
    { date: "2024-08-01", content: "아르바이트 연출 스킵 추가" },
    { date: "2024-08-01", content: "GTA 던전 20 → 24단계 확장", category: "gta_dungeon" },
    { date: "2024-08-08", content: "시스트/멜루나/힐데/캬롯 밸런스 패치", category: "character_balance" },
    { date: "2024-08-15", content: "레비 밸런스 패치", category: "character_balance" },
    { date: "2024-08-15", content: "교주 100 → 110레벨 상한 해방", category: "user_max_level" },
    { date: "2024-08-29", content: "연구실 11단계 확장", category: "research_lab" },
    { date: "2024-09-05", content: "림/네르/벨벳 밸런스 패치", category: "character_balance" },
    { date: "2024-09-12", content: "침략 29/30 월드 개방", category: "invasion_world" },
    { date: "2024-09-19", content: "드림랜드 컨텐츠 추가" },
    { date: "2024-09-26", content: "겟츄 크레용 던전 10 → 12단계 확장" },
    { date: "2024-09-26", content: "사도의 편지 추가" },
    { date: "2024-10-03", content: "에피카 밸런스 패치", category: "character_balance" },
    { date: "2024-10-10", content: "캬롯 밸런스 패치", category: "character_balance" },
    { date: "2024-10-14", content: "의상실 시스템 추가" },
    { date: "2024-11-14", content: "퀘스트 UI 변경" },
    { date: "2024-11-28", content: "아야 밸런스 패치", category: "character_balance" },
    { date: "2024-12-12", content: "앨리스 밸런스 패치", category: "character_balance" },
    { date: "2024-12-19", content: "침략 31/32 월드 개방", category: "invasion_world" },
    { date: "2024-12-19", content: "10랭크 장비 추가", category: "gear_rank" },
    { date: "2024-12-19", content: "교주 110 → 120레벨 상한 해방", category: "user_max_level" },
    { date: "2024-12-19", content: "연구실 12단계 확장", category: "research_lab" },
    { date: "2024-12-26", content: "세계수 성물 30 → 35레벨 확장", category: "worldtree_relic" },
    { date: "2024-12-26", content: "차원 대충돌 21 → 24단계 확장", category: "clash_level" },
    { date: "2024-12-26", content: "에르핀/시스트/엘레나 어사이드 밸런스 패치", category: "character_balance" },

    // 2025
    { date: "2025-01-01", content: "교주 생일 축하 이벤트 추가" },
    { date: "2025-01-16", content: "슈가 프리 던전 10 → 12단계 확장" },
    { date: "2025-01-16", content: "단기 속성반 30 → 35단계 확장", category: "crash_course" },
    { date: "2025-01-16", content: "세계수 굴착기지 50 → 60단계 확장", category: "dig_base" },
    { date: "2025-01-16", content: "카드 덱 프리셋 기능 추가" },
    { date: "2025-02-06", content: "사복 패스 추가" },
    { date: "2025-02-27", content: "메인 스토리 예고 타이머 추가" },
    { date: "2025-03-13", content: "침략 33/34 월드 개방", category: "invasion_world" },
    { date: "2025-03-20", content: "에피소드 기본/소프트 모드 선택 기능 추가" },
    { date: "2025-03-20", content: "에르핀/리츠/실라 어사이드 밸런스 패치", category: "character_balance" },
    { date: "2025-03-27", content: "꿀밤, 간지럽히기 상호작용 추가" },
    { date: "2025-04-03", content: "엘리아스 프론티어 용암맛 11, 12 스테이지 추가", category: "frontier_level" },
    { date: "2025-04-11", content: "놀이터 BETA 오픈" },
    { date: "2025-04-17", content: "셰럼 어사이드 밸런스 패치", category: "character_balance" },
    { date: "2025-04-24", content: "연구실 13단계 확장", category: "research_lab" },
    { date: "2025-05-08", content: "침략 자동 진행 기능 추가" },
    { date: "2025-05-09", content: "Tasty Table Time BETA 오픈" },
    { date: "2025-05-22", content: "침략 35/36 월드 개방", category: "invasion_world" },
    { date: "2025-05-22", content: "11랭크 장비 추가", category: "gear_rank" },
    { date: "2025-05-22", content: "교주 120 → 130레벨 상한 해방", category: "user_max_level" },
    { date: "2025-06-19", content: "세계수 성물 35 → 40레벨 확장", category: "worldtree_relic" },
    { date: "2025-06-19", content: "아르바이트 일괄 진행 기능 추가" },
    { date: "2025-06-20", content: "WWElias BETA 오픈" },
    { date: "2025-06-26", content: "비밀의 베이커리 35 → 40단계 확장", category: "secret_bakery_dungeon" },
    { date: "2025-06-26", content: "엘리아스 프론티어 전체 스펠 구매 추가" },
    { date: "2025-06-26", content: "엘리아스 프론티어 랭킹 보상 고정 등수제에서 비율(%)로 변경" },
    { date: "2025-07-10", content: "차원 대충돌 자동 진행 추가" },
    { date: "2025-07-10", content: "차원 대충돌 랭킹 보상 고정 등수제에서 비율(%)로 변경" },
    { date: "2025-07-18", content: "현피주의 오락실 BETA 오픈" },
    { date: "2025-08-01", content: "무럭 무럭! 파워 타워! BETA 오픈" },
    { date: "2025-08-07", content: "단기 속성반 35 → 40단계 확장", category: "crash_course" },
    { date: "2025-08-21", content: "모여라 사도 개선" },
    { date: "2025-08-28", content: "GTA 던전 24 → 28단계 확장", category: "gta_dungeon" },
    { date: "2025-08-28", content: "딜:리버리 시스템 추가" },
    { date: "2025-08-28", content: "방어/저항 계열 스탯 수치 반영 구조 개선" },
    { date: "2025-08-28", content: "겟츄크레용 최상급 크레파스 확정 획득 시스템(천장) 추가" },
    { date: "2025-09-04", content: "복층 펫 하우스(펫 선물 일괄 수령) 추가" },
    { date: "2025-09-11", content: "침략 37/38 월드 개방", category: "invasion_world" },
    { date: "2025-09-11", content: "테마극장/침략 빠른 전투 시스템 추가" },
    { date: "2025-09-18", content: "전투 시 고학년 스킬 버튼에 SP 보유량 추가" },
    { date: "2025-09-25", content: "2랭크 이상 장비 도안 요구량 완화" },
    { date: "2025-10-09", content: "뽑기 기록 확인 시스템 추가" },
    { date: "2025-10-24", content: "놀이터 정규 시즌 오픈" },
    { date: "2025-11-06", content: "교단 배경 낮/밤 전환 추가" },
    { date: "2025-11-13", content: "차원 대충돌 2.0 BETA 오픈", category: "clash_v2_level" },
    { date: "2025-11-20", content: "침략 39/40 월드 개방", category: "invasion_world" },
    { date: "2025-11-20", content: "12랭크 장비 추가", category: "gear_rank" },
    { date: "2025-11-20", content: "세계수 성물 40 → 45레벨 확장", category: "worldtree_relic" },
    { date: "2025-11-27", content: "빵주 공방 추가" },
    { date: "2025-12-04", content: "연구실 14단계 확장", category: "research_lab" },
    { date: "2025-12-11", content: "엘리아스 프론티어 보스 우로스 추가" },
    { date: "2025-12-11", content: "누루링 버스터즈 9 → 12단계 확장", category: "nururing" },
    { date: "2025-12-18", content: "침략 대여 가능 3 → 5회 확장" },
    { date: "2025-12-25", content: "차원 대충돌 2.0 18 → 24단계 확장", category: "clash_v2_level" },
    { date: "2025-12-25", content: "시온 더 다크불릿 밸런스 패치", category: "character_balance" },

    // 2026
    { date: "2026-01-01", content: "교주 130 → 140레벨 상한 해방", category: "user_max_level" },
    { date: "2026-01-22", content: "비비 밸런스 패치", category: "character_balance" },
    { date: "2026-01-22", content: "메인 스토리 예고 배너 추가" },
    { date: "2026-01-22", content: "트릭컬 노트 BETA 오픈" },
    { date: "2026-01-29", content: "모여라 사도 프리셋 기능 추가" },
    { date: "2026-02-05", content: "차원 대충돌 2.0 보스 냥만 타워 추가" },
    { date: "2026-02-19", content: "이드/에슈르 밸런스 패치, 셰이디/에슈르 어사이드 밸런스 패치", category: "character_balance" },
    { date: "2026-02-19", content: "차원 대충돌 24 → 27단계 확장", category: "clash_level" },
    { date: "2026-03-05", content: "엘리아스 프론티어 마그맛 13, 14 스테이지 추가", category: "frontier_level" },
    { date: "2026-03-13", content: "트릭다이스 BETA 오픈" },
    { date: "2026-03-19", content: "에피카 밸런스 패치", category: "character_balance" },
    { date: "2026-03-19", content: "빵주 - 캬롯의 정원 콘텐츠 추가", category: "kyarot_garden" },
    { date: "2026-03-26", content: "비밀의 베이커리 40 → 45단계 확장", category: "secret_bakery_dungeon" },
    { date: "2026-03-26", content: "GTA 던전 28 → 32단계 확장", category: "gta_dungeon" },
    { date: "2026-03-26", content: "단기 속성반 40 → 45단계 확장", category: "crash_course" },
    { date: "2026-03-27", content: "Tasty Table Time 정규 시즌 오픈" },
    { date: "2026-04-09", content: "카드 불러오기, 신규 카드 일괄 관리 추가" },
    { date: "2026-04-10", content: "WWElias 정규 시즌 오픈" },
    { date: "2026-04-16", content: "클로에 밸런스 패치", category: "character_balance" },
    { date: "2026-04-23", content: "세계수 굴착기지 고속 운행 기능 추가", category: "dig_base" },
    { date: "2026-05-08", content: "무럭 무럭! 파워 타워! 정규 시즌 오픈" },
    { date: "2026-05-14", content: "란 밸런스 패치", category: "character_balance" },
    { date: "2026-05-14", content: "사도 즐겨찾기 기능 추가" },
    { date: "2026-05-21", content: "어사이드 떡상 시스템 추가" },
    { date: "2026-05-21", content: "누루링 버스터즈 12 → 15단계 확장", category: "nururing" },
    { date: "2026-05-21", content: "엘다인 사도 증명서 월 구매 10 → 15개 상향" },
    { date: "2026-05-21", content: "침략 41/42 월드 개방", category: "invasion_world" },
    { date: "2026-05-28", content: "사복 맘대로 입기 기능 추가" },
    { date: "2026-05-28", content: "자동 전투 중 고학년 스킬 사용 설정 기능 추가" },
    { date: "2026-06-04", content: "사도 최대 친밀 30 → 50레벨 확장" },
    { date: "2026-06-04", content: "윈드차임 추가" },
    { date: "2026-06-04", content: "꽁냥콜 추가" },
    { date: "2026-06-04", content: "만찬장 추가" },
    { date: "2026-06-04", content: "연회장 선택지 자동 선택 기능 추가" },
    { date: "2026-06-11", content: "아야 밸런스 패치", category: "character_balance" },
    { date: "2026-06-11", content: "뚝딱 장비 제작 기능 추가" },
    { date: "2026-07-02", content: "세계수 성물 최대 45 → 50레벨 확장", category: "worldtree_relic" },
    { date: "2026-07-09", content: "우이 밸런스 패치", category: "character_balance" },
    { date: "2026-07-16", content: "캬롯의 정원 개선", category: "kyarot_garden" },
    { date: "2026-07-23", content: "차원 대충돌 2.0 림의 이면세계 24 → 100단계 확장", category: "clash_v2_level" },
    { date: "2026-07-30", content: "침략 43/44 월드 개방", category: "invasion_world" },
    { date: "2026-07-30", content: "13랭크 장비 추가", category: "gear_rank" },
    { date: "2026-07-30", content: "예술의 쩐당 추가" },
    { date: "2026-07-30", content: "친구 최대 인원 30 → 50명 확장" },
];