type YieldRange = { min: number; max: number };
type YieldLevelData = Record<number, YieldRange>;
export type MaterialYieldTypesData = Record<number, YieldLevelData>;
export const MATERIAL_YIELD_TYPES: MaterialYieldTypesData = {
    1: {
        1: { min: 3, max: 6 },
        2: { min: 4, max: 8 },
        3: { min: 5, max: 10 },
        4: { min: 6, max: 12 },
        5: { min: 7, max: 14 }
    },
    2: {
        1: { min: 2, max: 3 },
        2: { min: 3, max: 5 },
        3: { min: 4, max: 6 },
        4: { min: 5, max: 8 },
        5: { min: 6, max: 10 }
    },
    3: {
        1: { min: 1, max: 2 },
        2: { min: 1, max: 2 },
        3: { min: 1, max: 4 },
        4: { min: 1, max: 5 },
        5: { min: 2, max: 5 }
    },
    4: {
        1: { min: 4, max: 8 },
        2: { min: 5, max: 10 },
        3: { min: 6, max: 12 },
        4: { min: 7, max: 14 },
        5: { min: 8, max: 16 }
    },
    5: {
        1: { min: 4, max: 6 },
        2: { min: 5, max: 7 },
        3: { min: 6, max: 8 },
        4: { min: 7, max: 10 },
        5: { min: 8, max: 12 }
    },
}

interface YieldMaterial {
    name: string;
    yieldType: number;
}

export interface AdventureDetail {
    mainAdvSkill: string;
    advSkills?: string[];
    advLvl: number;
    yieldMaterials: YieldMaterial[];
    advId: number; // 이미지 파일명 찾는데 씀
    frontWidth?: number; // 겹치는 사진의 width%
}
export interface Adventure {
    [key: string]: AdventureDetail
}

export const adventure: Adventure = {

    '코스프레 모델': {
        mainAdvSkill: '미모',
        advSkills: ['애교', '멘탈', '하이텐션'],
        advLvl: 2,
        yieldMaterials: [
            { name: '뻣뻣한 천조각', yieldType: 1 },
            { name: '쪼물딱 점토', yieldType: 2 },
        ],
        advId: 1,
    },
    '엘드 마트 강탈': {
        mainAdvSkill: '암산',
        advSkills: ['잔소리', '뻔뻔함'],
        advLvl: 1,
        yieldMaterials: [
            { name: '만능 소스', yieldType: 1 },
            { name: '과일', yieldType: 2 },
            { name: '쌀', yieldType: 3 },
        ],
        advId: 2,
        frontWidth: 83
    }, '자판기 털기': {
        mainAdvSkill: '민첩',
        advSkills: ['암산', '뻔뻔함', '추진력'],
        advLvl: 10,
        yieldMaterials: [
            { name: '조각조각 기판', yieldType: 2 },
            { name: '반짝 유리', yieldType: 3 },
        ],
        advId: 3
    }, '김장숙 부띠끄 알바': {
        
        mainAdvSkill: '미묘',
        advSkills: ['에교', '말빨', '하이텐션'],
        advLvl: 8,
        yieldMaterials: [
            { name: '커미션 사용권', yieldType: 2 },
            { name: '축축 종이죽', yieldType: 3 },
        ],
        advId: 4
    }, '모에모에빔 주문걸기': {
        mainAdvSkill: '꿀성대',
        advSkills: ['에교', '사교', '멘탈'],
        advLvl: 2,
        yieldMaterials: [
            { name: '설탕', yieldType: 1 },
            { name: '스프링클', yieldType: 2 },
        ],
        advId: 5
    }, '엘프 시청 창문닦이': {
        mainAdvSkill: '결벽증',
        advSkills: [],
        advLvl: 1,
        yieldMaterials: [
            { name: '반짝 유리', yieldType: 1 },
            { name: '조각 보석', yieldType: 2 },
        ],
        advId: 6
    }, '도굴 망보기': {
        mainAdvSkill: '눈치',
        advSkills: ['잔소리'],
        advLvl: 3,
        yieldMaterials: [
            { name: '쪼물딱 점토', yieldType: 4 },
            { name: '스륵스륵 철가루', yieldType: 3 },
        ],
        advId: 7
    }, '닭틀링건 제작': {
        mainAdvSkill: '공대생',
        advSkills: ['문해력', '손기술', '혼자놀기'],
        advLvl: 4,
        yieldMaterials: [
            { name: '바삭바삭 금박', yieldType: 4 },
            { name: '단단한 돌', yieldType: 3 },
        ],
        advId: 8,
        frontWidth: 100
    }, '대관절 양떼목장': {
        mainAdvSkill: '애교',
        advSkills: ['말빨', '하이텐션'],
        advLvl: 5,
        yieldMaterials: [
            { name: '우유', yieldType: 1 },
            { name: '육고기', yieldType: 2 },
            { name: '치즈', yieldType: 3 },
        ],
        advId: 9
    }, 'AI 아트 트레이닝': {
        mainAdvSkill: '공대생',
        advSkills: ['문해력', '직감'],
        advLvl: 1,
        yieldMaterials: [
            { name: '스륵스륵 철가루', yieldType: 1 },
            { name: '무지개 꽃즙', yieldType: 2 },
        ],
        advId: 10
    }, '포션 실험 알바': {
        mainAdvSkill: '오지랖',
        advSkills: ['참을성', '희생정신'],
        advLvl: 1,
        yieldMaterials: [
            { name: '고로쇠 수액', yieldType: 1 },
            { name: '꿀', yieldType: 2 },
        ],
        advId: 11,
        frontWidth: 100
    }, '족제비와 토끼 사료 주기': {
        mainAdvSkill: '사교',
        advSkills: ['관종'],
        advLvl: 1,
        yieldMaterials: [
            { name: '채소', yieldType: 1 },
            { name: '밀가루', yieldType: 2 },
        ],
        advId: 12
    }, '수상한 대표 동상 제작': {
        mainAdvSkill: '카리스마',
        advSkills: ['노예근성', '관종', '허세작열'],
        advLvl: 3,
        yieldMaterials: [
            { name: '말랑한 나무', yieldType: 4 },
            { name: '바삭바삭 금박', yieldType: 3 },
        ],
        advId: 13
    }, '엘리베이터 버튼 장난': {
        mainAdvSkill: '민첩',
        advSkills: ['눈치', '뻔뻔함', '직감'],
        advLvl: 1,
        yieldMaterials: [
            { name: '바삭바삭 금박', yieldType: 1 },
            { name: '스륵스륵 철가루', yieldType: 2 },
        ],
        advId: 14
    }, '동인지 어시': {
        mainAdvSkill: '손기술',
        advSkills: ['참을성', '책임감'],
        advLvl: 1,
        yieldMaterials: [
            { name: '축축 종이죽', yieldType: 1 },
            { name: '가죽나무 잎', yieldType: 2 },
        ],
        advId: 15,
        frontWidth: 100
    }, '마요 집 정리': {
        mainAdvSkill: '결벽증',
        advSkills: [],
        advLvl: 7,
        yieldMaterials: [
            { name: '지구에서 온 납', yieldType: 2 },
            { name: '바삭바삭 금박', yieldType: 3 },
        ],
        advId: 16
    }, '포레스트 레인저': {
        mainAdvSkill: '운동신경',
        advSkills: ['민첩', '집요함', '추진력'],
        advLvl: 10,
        yieldMaterials: [
            { name: '포인트 장식', yieldType: 2 },
            { name: '설탕', yieldType: 3 },
        ],
        advId: 17
    }, '루드짐 트레이너': {
        mainAdvSkill: '운동신경',
        advSkills: ['카리스마', '잔소리'],
        advLvl: 1,
        yieldMaterials: [
            { name: '가죽나무 잎', yieldType: 1 },
            { name: '단단한 돌', yieldType: 2 },
        ],
        advId: 18
    }, '피규어 채색': {
        mainAdvSkill: '손기술',
        advSkills: ['책임감', '집중력'],
        advLvl: 7,
        yieldMaterials: [
            { name: '혼모노의 증표', yieldType: 2 },
            { name: '무지개 꽃즙', yieldType: 3 },
        ],
        advId: 19,
        frontWidth: 100
    }, '윈스타 맛집 설거지': {
        mainAdvSkill: '노예근성',
        advSkills: ['참을성', '희생정신'],
        advLvl: 1,
        yieldMaterials: [
            { name: '검고 딱딱한 열매', yieldType: 1 },
            { name: '고로쇠 수액', yieldType: 2 },
        ],
        advId: 20,
        frontWidth: 100
    }, '크고 길다란 광맥 찾기': {
        mainAdvSkill: '육체노동',
        advSkills: ['공대생', '집요함'],
        advLvl: 9,
        yieldMaterials: [
            { name: '재활용 플라스틱', yieldType: 2 },
            { name: '단단한 돌', yieldType: 3 },
        ],
        advId: 21
    }, '세계수 앞에서 노래부르기': {
        mainAdvSkill: '미모',
        advSkills: ['꿀성대', '관종', '뻔뻔함'],
        advLvl: 9,
        yieldMaterials: [
            { name: 'EGO 블럭', yieldType: 2 },
            { name: '고로쇠 수액', yieldType: 3 },
        ],
        advId: 22
    }, '빼때로에서 초코벗기기': {
        mainAdvSkill: '유유자적',
        advSkills: ['희생정신', '집중력'],
        advLvl: 5,
        yieldMaterials: [
            { name: '초콜릿', yieldType: 1 },
            { name: '밀가루', yieldType: 2 },
            { name: '설탕', yieldType: 3 },
        ],
        advId: 23,
        frontWidth: 100
    }, '가구조립 매뉴얼 읽어주기': {
        mainAdvSkill: '문해력',
        advSkills: ['오지랖', '문해력'],
        advLvl: 6,
        yieldMaterials: [
            { name: '구부리', yieldType: 2 },
            { name: '스륵스륵 철가루', yieldType: 3 },
        ],
        advId: 24,
        frontWidth: 100
    }, '일찍 일어나는 올빼미 조사': {
        mainAdvSkill: '정보력',
        advSkills: ['잡지식', '직감'],
        advLvl: 1,
        yieldMaterials: [
            { name: '새고기', yieldType: 1 },
            { name: '나뭇잎', yieldType: 2 },
        ],
        advId: 25
    }, '타로 카드 해석하기': {
        mainAdvSkill: '눈치',
        advSkills: ['오지랖', '말빨'],
        advLvl: 1,
        yieldMaterials: [
            { name: '조각 보석', yieldType: 1 },
            { name: '축축 종이죽', yieldType: 2 },
        ],
        advId: 26,
        frontWidth: 100
    }, '어제 팔리지 않은 빵 판매': {
        mainAdvSkill: '꿀성대',
        advSkills: ['암산', '말빨', '허세작열'],
        advLvl: 1,
        yieldMaterials: [
            { name: '밀가루', yieldType: 1 },
            { name: '달걀', yieldType: 2 },
        ],
        advId: 27,
        frontWidth: 100
    }, '낚시성 뉴스 제목 짓기': {
        mainAdvSkill: '문해력',
        advSkills: ['멘탈', '잡지식'],
        advLvl: 1,
        yieldMaterials: [
            { name: '뻣뻣한 천조각', yieldType: 1 },
            { name: '물고기', yieldType: 2 },
        ],
        advId: 28
    },
    '에르핀 모험 준비': {
        mainAdvSkill: '운동신경',
        advSkills: ['민첩', '정보력', '잡지식'],
        advLvl: 8,
        yieldMaterials: [
            { name: '구비구비 철사', yieldType: 2 },
            { name: '말랑한 나무', yieldType: 3 },
        ],
        advId: 29
    }, '요정 왕국 마을 보수': {
        mainAdvSkill: '육체노동',
        advSkills: ['노예근성', '책임감'],
        advLvl: 1,
        yieldMaterials: [
            { name: '단단한 돌', yieldType: 1 },
            { name: '말랑한 나무', yieldType: 2 },
        ],
        advId: 30
    }, '수인 미용실': {
        mainAdvSkill: '손기술',
        advSkills: ['사교', '하이텐션'],
        advLvl: 4,
        yieldMaterials: [
            { name: '보송 솜', yieldType: 4 },
            { name: '가죽나무 잎', yieldType: 3 },
        ],
        advId: 31
    }, '극장 세트 제작': {
        mainAdvSkill: '육체노동',
        advSkills: ['노예근성', '추진력'],
        advLvl: 1,
        yieldMaterials: [
            { name: '말랑한 나무', yieldType: 1 },
            { name: '반짝 유리', yieldType: 2 },
        ],
        advId: 32
    }, '인형 분해': {
        mainAdvSkill: '집요함',
        advSkills: ['집중력'],
        advLvl: 1,
        yieldMaterials: [
            { name: '쪼물딱 점토', yieldType: 1 },
            { name: '뻣뻣한 천조각', yieldType: 2 },
        ],
        advId: 33,
        frontWidth: 100
    }, '수력발전소': {
        mainAdvSkill: '육체노동',
        advSkills: ['참을성', '책임감'],
        advLvl: 6,
        yieldMaterials: [
            { name: '뾰족뾰족 태엽', yieldType: 2 },
            { name: '반짝 유리', yieldType: 3 },
        ],
        advId: 34
    }, '연금술 시도하기': {
        mainAdvSkill: '도전 정신',
        advLvl: 9,
        yieldMaterials: [
            { name: '말랑 금속', yieldType: 2 },
        ],
        advId: 35,
        frontWidth: 100
    }, '볼 당긴 횟수 세기': {
        mainAdvSkill: '기억력',
        advLvl: 9,
        yieldMaterials: [
            { name: '윙크 잉크', yieldType: 2 },
        ],
        advId: 36
    }, '교단 가입시키기': {
        mainAdvSkill: '설득력',
        advLvl: 10,
        yieldMaterials: [
            { name: '손도장', yieldType: 2 },
        ],
        advId: 37,
        frontWidth: 100
    }, '대신 기도하기': {
        mainAdvSkill: '꿀잠',
        advLvl: 10,
        yieldMaterials: [
            { name: '수면 안대', yieldType: 2 },
        ],
        advId: 38
    }, '식당 혼쭐 내기': {
        mainAdvSkill: '먹성',
        advLvl: 10,
        yieldMaterials: [
            { name: '동수저', yieldType: 2 },
        ],
        advId: 39,
        frontWidth: 100
    }, '낙엽 위에 점프하기': {
        mainAdvSkill: '호기심',
        advLvl: 8,
        yieldMaterials: [
            { name: '단풍 시럽', yieldType: 2 },
        ],
        advId: 40
    }, '누루링 먹이 주기': {
        mainAdvSkill: '단순함',
        advLvl: 2,
        yieldMaterials: [
            { name: '젤라틴', yieldType: 2 },
        ],
        advId: 41
    }, '우유 배달하기': {
        mainAdvSkill: '근면성실',
        advLvl: 5,
        yieldMaterials: [
            { name: '요구르트', yieldType: 2 },
        ],
        advId: 42
    }, '안마당 나무 털기': {
        mainAdvSkill: '순발력',
        advLvl: 2,
        yieldMaterials: [
            { name: '모둠 견과', yieldType: 2 },
        ],
        advId: 43
    }, '날씨 예측하기': {
        mainAdvSkill: '추리력',
        advLvl: 7,
        yieldMaterials: [
            { name: '무지개 버섯', yieldType: 2 },
        ],
        advId: 44
    }, '첫 단추 끼우기': {
        mainAdvSkill: '신중함',
        advLvl: 6,
        yieldMaterials: [
            { name: '동글동글 단추', yieldType: 2 },
        ],
        advId: 45,
        frontWidth: 100
    }, '폭탄 위장하기': {
        mainAdvSkill: '안목',
        advLvl: 3,
        yieldMaterials: [
            { name: '하늘하늘 레이스', yieldType: 2 },
        ],
        advId: 46,
        frontWidth: 100
    }, '크레페 키 재기': {
        mainAdvSkill: '정확함',
        advLvl: 7,
        yieldMaterials: [
            { name: '15cm 자', yieldType: 2 },
        ],
        advId: 47
    }, '풍선 터트리기': {
        mainAdvSkill: '장난기',
        advLvl: 7,
        yieldMaterials: [
            { name: '뾰족 바늘', yieldType: 2 },
        ],
        advId: 48
    }, '날아가는 원반 잡기': {
        mainAdvSkill: '직감',
        advLvl: 1,
        yieldMaterials: [
            { name: '짤랑짤랑 주머니', yieldType: 2 },
        ],
        advId: 49
    }, '탈옥 시도 후 피드백': {
        mainAdvSkill: '카리스마',
        advSkills: ['신중함', '직감'],
        advLvl: 1,
        yieldMaterials: [
            { name: '같이가자 주머니', yieldType: 2 },
        ],
        advId: 50
    }, '사서들과 역사 점검': {
        mainAdvSkill: '신중함',
        advLvl: 1,
        yieldMaterials: [
            { name: '쑥쑥자라 주머니', yieldType: 2 },
        ],
        advId: 51
    }, '이상한 티타임 가지기': {
        mainAdvSkill: '카리스마',
        advLvl: 1,
        yieldMaterials: [
            { name: '특별한 주머니', yieldType: 2 },
        ],
        advId: 52
    }, '길거리 공연하기': {
        mainAdvSkill: '리듬감',
        advLvl: 1,
        yieldMaterials: [
            { name: '악보', yieldType: 2 },
        ],
        advId: 53
    }, '뜬구름 잡기': {
        mainAdvSkill: '하늘거림',
        advLvl: 1,
        yieldMaterials: [
            { name: '듬성 깃털', yieldType: 2 },
        ],
        advId: 54
    }, '정령 호수 청소하기': {
        mainAdvSkill: '청결함',
        advLvl: 1,
        yieldMaterials: [
            { name: '신선한 플라스틱', yieldType: 5 },
        ],
        advId: 55
    }, '유적 굴착하기': {
        mainAdvSkill: '모험심',
        advLvl: 1,
        yieldMaterials: [
            { name: '어색 자석', yieldType: 5 },
        ],
        advId: 56
    }, '발명품 테스트하기': {
        mainAdvSkill: '깨달음',
        advLvl: 1,
        yieldMaterials: [
            { name: '맑은 구슬', yieldType: 5 },
        ],
        advId: 57
    }, '시장님 점심 메뉴 선정하기': {
        mainAdvSkill: '미식가',
        advLvl: 5,
        yieldMaterials: [
            { name: '과일', yieldType: 1 },
            { name: '설탕', yieldType: 2 },
            { name: '바삭바삭 금박', yieldType: 3 },
        ],
        advId: 58
    }, '만화책 보고 밀키트 만들기': {
        mainAdvSkill: '미식가',
        advLvl: 5,
        yieldMaterials: [
            { name: '육고기', yieldType: 1 },
            { name: '팩 선생 만능 소스', yieldType: 2 },
            { name: '새고기', yieldType: 3 },
        ],
        advId: 59
    },
}