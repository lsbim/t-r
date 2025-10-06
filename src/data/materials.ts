
interface Material {
    name: string;
    grade: number;

    // 제작 재료
    ingredient?: {
        name: string;
        qty: number;
    }[]
}

export const materials: Material[] = [
    {
        name: '무지개 꽃즙',
        grade: 1
    }, {
        name: '축축 종이죽',
        grade: 1
    }, {
        name: '단단한 돌',
        grade: 1
    }, {
        name: '말랑한 나무',
        grade: 1
    }, {
        name: '가죽나무 잎',
        grade: 1
    }, {
        name: '반짝 유리',
        grade: 1
    }, {
        name: '보송 솜',
        grade: 1
    }, {
        name: '바삭바삭 금박',
        grade: 1
    }, {
        name: '뻣뻣한 천조각',
        grade: 1
    }, {
        name: '쪼물딱 점토',
        grade: 1
    }, {
        name: '고로쇠 수액',
        grade: 1
    }, {
        name: '조각 보석',
        grade: 1
    }, {
        name: '스륵스륵 철가루',
        grade: 1
    }, {
        name: '혼모노의 증표',
        grade: 2
    }, {
        name: '커미션 사용권',
        grade: 2,
        ingredient: [
            { name: '축축 종이죽', qty: 6 },
            { name: '무지개 꽃즙', qty: 4 },
        ]
    }, {
        name: '포인트 장식',
        grade: 2,
        ingredient: [
            { name: '뻣뻣한 천조각', qty: 6 },
        ]
    }, {
        name: '구비구비 철사',
        grade: 2,
        ingredient: [
            { name: '가죽나무 잎', qty: 6 },
            { name: '스륵스륵 철가루', qty: 4 },
        ]
    }, {
        name: '조각조각 기판',
        grade: 2,
        ingredient: [
            { name: '바삭바삭 금박', qty: 6 },
        ]
    }, {
        name: '지구에서 온 납',
        grade: 2,
        ingredient: [
            { name: '스륵스륵 철가루', qty: 6 },
        ]
    }, {
        name: '재활용 플라스틱',
        grade: 2,
        ingredient: [
            { name: '반짝 유리', qty: 6 },
        ]
    }, {
        name: '뾰족뾰족 태엽',
        grade: 2,
        ingredient: [
            { name: '단단한 돌', qty: 6 },
        ]
    }, {
        name: 'EGO 블럭',
        grade: 2,
        ingredient: [
            { name: '쪼물딱 점토', qty: 6 },
        ]
    }, {
        name: '구부리',
        grade: 2
    }, {
        name: '말랑 금속',
        grade: 2,
        ingredient: [
            { name: '보송 솜', qty: 4 },
            { name: '반짝 유리', qty: 2 },
        ]
    }, {
        name: '손도장',
        grade: 2,
        ingredient: [
            { name: '말랑한 나무', qty: 4 },
            { name: '무지개 꽃즙', qty: 2 },
        ]
    }, {
        name: '윙크 잉크',
        grade: 2,
        ingredient: [
            { name: '축축 종이죽', qty: 4 },
            { name: '단단한 돌', qty: 2 },
        ]
    }, {
        name: '수면 안대',
        grade: 2,
        ingredient: [
            { name: '뻣뻣한 천조각', qty: 4 },
            { name: '말랑한 나무', qty: 2 },
        ]
    }, {
        name: '동수저',
        grade: 2,
        ingredient: [
            { name: '쪼물딱 점토', qty: 4 },
            { name: '가죽나무 잎', qty: 2 },
        ]
    }, {
        name: 'S전자 반도체',
        grade: 3,
        ingredient: [
            { name: '재활용 플라스틱', qty: 6 },
            { name: '조각조각 기판', qty: 4 },
        ]
    }, {
        name: '배터리 팩',
        grade: 3,
        ingredient: [
            { name: '지구에서 온 납', qty: 6 },
            { name: '조각조각 기판', qty: 4 },
        ]
    }, {
        name: '팅팅탱탱 스프링',
        grade: 3,
        ingredient: [
            { name: '구비구비 철사', qty: 6 },
        ]
    }, {
        name: 'MUSIM 칩',
        grade: 3,
        ingredient: [
            { name: '스륵스륵 철가루', qty: 10 },
            { name: '조각조각 기판', qty: 4 },
        ]
    }, {
        name: '뾰족 못',
        grade: 3,
        ingredient: [
            { name: '뾰족뾰족 태엽', qty: 6 },
            { name: '조각 보석', qty: 4 },
        ]
    }, {
        name: '철야 안대',
        grade: 3,
        ingredient: [
            { name: '재활용 플라스틱', qty: 3 },
            { name: '수면 안대', qty: 8 },
        ]
    }, {
        name: '네온 사인',
        grade: 3,
        ingredient: [
            { name: '구비구비 철사', qty: 3 },
            { name: '윙크 잉크', qty: 8 },
        ]
    }, {
        name: '캐릭터 도장',
        grade: 4,
        ingredient: [
            { name: '팅팅탱탱 스프링', qty: 3 },
            { name: '손도장', qty: 8 },
        ]
    }, {
        name: '금수저',
        grade: 4,
        ingredient: [
            { name: 'LED 전구', qty: 3 },
            { name: '동수저', qty: 8 },
        ]
    }, {
        name: '감성 코어',
        grade: 4,
        ingredient: [
            { name: 'MUSIM 칩', qty: 3 },
            { name: '말랑 금속', qty: 8 },
        ]
    },

    // 꾸미기
    {
        name: '악보',
        grade: 2,
        ingredient: [
            { name: '무지개 꽃즙', qty: 6 },
            { name: '축축 종이죽', qty: 6 },
        ]
    }, {
        name: '어색 자석',
        grade: 2,
        ingredient: [
            { name: '가죽나무 잎', qty: 6 },
            { name: '단단한 돌', qty: 4 },
        ]
    }, {
        name: '듬성 깃털',
        grade: 2,
        ingredient: [
            { name: '축축 종이죽', qty: 3 },
            { name: '보송 솜', qty: 3 },
        ]
    }, {
        name: '신선한 플라스틱',
        grade: 2,
        ingredient: [
            { name: '반짝 유리', qty: 6 },
            { name: '스륵스륵 철가루', qty: 4 },
        ]
    }, {
        name: '맑은 구슬',
        grade: 2,
        ingredient: [
            { name: '혼모노의 증표', qty: 4 },
            { name: '쪼물딱 점토', qty: 4 },
        ]
    }, {
        name: '3W 광택제',
        grade: 2,
        ingredient: [
            { name: '고로쇠 수액', qty: 6 },
        ]
    }, {
        name: '친밀 자석',
        grade: 3,
        ingredient: [
            { name: '어색 자석', qty: 6 },
            { name: '구비구비 철사', qty: 4 },
        ]
    }, {
        name: '반질반질 종이',
        grade: 3,
        ingredient: [
            { name: '축축 종이죽', qty: 6 },
            { name: '재활용 플라스틱', qty: 4 },
            { name: '3W 광택제', qty: 2 },
        ]
    }, {
        name: '고퀄 일러스트',
        grade: 3,
        ingredient: [
            { name: '커미션 사용권', qty: 6 },
            { name: '혼모노의 증표', qty: 4 },
        ]
    }, {
        name: '쭈물럭 점토',
        grade: 3,
        ingredient: [
            { name: '쪼물딱 점토', qty: 6 },
            { name: '혼모노의 증표', qty: 4 },
        ]
    }, {
        name: '부들 천',
        grade: 3,
        ingredient: [
            { name: '뻣뻣한 천조각', qty: 6 },
            { name: '혼모노의 증표', qty: 4 },
        ]
    }, {
        name: '모카솜',
        grade: 3,
        ingredient: [
            { name: '보송 솜', qty: 6 },
            { name: '무지개 꽃즙', qty: 4 },
            { name: '검고 딱딱한 열매', qty: 2 },
        ]
    }, {
        name: '포근 깃털',
        grade: 3,
        ingredient: [
            { name: '듬성 깃털', qty: 6 },
            { name: '구비구비 철사', qty: 4 },
        ]
    }, {
        name: '고순도 플라스틱',
        grade: 3,
        ingredient: [
            { name: '신선한 플라스틱', qty: 6 },
            { name: '3W 광택제', qty: 2 },
        ]
    }, {
        name: '알록달록 구슬',
        grade: 3,
        ingredient: [
            { name: '맑은 구슬', qty: 8 },
            { name: 'EGO 블럭', qty: 6 },
        ]
    }, {
        name: '김덕춘 명인 도안',
        grade: 3,
        ingredient: [
            { name: '반질반질 종이', qty: 4 },
            { name: '혼모노의 증표', qty: 4 },
        ]
    }, {
        name: 'LED 전구',
        grade: 3,
        ingredient: [
            { name: '반짝 유리', qty: 6 },
            { name: '조각조각 기판', qty: 4 },
        ]
    },

    // 음식
    {
        name: '과일',
        grade: 1
    }, {
        name: '설탕',
        grade: 1
    }, {
        name: '밀가루',
        grade: 1
    }, {
        name: '모듬 곡식',
        grade: 1
    }, {
        name: '팩 선생 만능 소스',
        grade: 1
    }, {
        name: '검고 딱딱한 열매',
        grade: 1
    }, {
        name: '꿀',
        grade: 1
    }, {
        name: '나뭇잎',
        grade: 1
    }, {
        name: '채소',
        grade: 1
    }, {
        name: '새고기',
        grade: 1
    }, {
        name: '물고기',
        grade: 1
    }, {
        name: '육고기',
        grade: 1
    }, {
        name: '스프링클',
        grade: 1
    }, {
        name: '쌀',
        grade: 1
    }, {
        name: '달걀',
        grade: 1
    }, {
        name: '초콜릿',
        grade: 1
    }, {
        name: '우유',
        grade: 1
    }, {
        name: '치즈',
        grade: 1
    }, {
        name: '단풍 시럽',
        grade: 2,
        ingredient: [
            { name: '나뭇잎', qty: 4 },
            { name: '설탕', qty: 2 },
        ]
    }, {
        name: '젤라틴',
        grade: 2,
        ingredient: [
            { name: '육고기', qty: 4 },
            { name: '고로쇠 수액', qty: 2 },
        ]
    }, {
        name: '요구르트',
        grade: 2,
        ingredient: [
            { name: '우유', qty: 4 },
            { name: '꿀', qty: 2 },
        ]
    }, {
        name: '모둠 견과',
        grade: 2,
        ingredient: [
            { name: '검고 딱딱한 열매', qty: 4 },
            { name: '모듬 곡식', qty: 2 },
        ]
    }, {
        name: '무지개 버섯',
        grade: 2,
        ingredient: [
            { name: '스프링클', qty: 4 },
            { name: '채소', qty: 2 },
        ]
    },

    // 사복 재료
    {
        name: '동글동글 단추',
        grade: 2,
        ingredient: [
            { name: '보송 솜', qty: 4 },
            { name: '가죽나무 잎', qty: 2 },
        ]
    }, {
        name: '하늘하늘 레이스',
        grade: 2,
        ingredient: [
            { name: '뻣뻣한 천조각', qty: 4 },
            { name: '무지개 꽃즙', qty: 2 },
        ]
    }, {
        name: '15cm 자',
        grade: 2,
        ingredient: [
            { name: '축축 종이죽', qty: 4 },
            { name: '혼모노의 증표', qty: 2 },
        ]
    }, {
        name: '뾰족 바늘',
        grade: 2,
        ingredient: [
            { name: '쪼물딱 점토', qty: 4 },
            { name: '단단한 돌', qty: 2 },
        ]
    }, {
        name: '치명적 레이스',
        grade: 3,
        ingredient: [
            { name: '하늘하늘 레이스', qty: 6 },
            { name: '혼모노의 증표', qty: 4 },
        ]
    }, {
        name: '안전 바늘',
        grade: 3,
        ingredient: [
            { name: '뾰족 바늘', qty: 6 },
            { name: '혼모노의 증표', qty: 4 },
        ]
    }, {
        name: '보석 단추',
        grade: 4,
        ingredient: [
            { name: '모카솜', qty: 3 },
            { name: '동글동글 단추', qty: 4 },
        ]
    }, {
        name: '줄자',
        grade: 4,
        ingredient: [
            { name: '반질반질 종이', qty: 3 },
            { name: '15cm 자', qty: 4 },
        ]
    },
];