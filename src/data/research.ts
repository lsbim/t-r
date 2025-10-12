export interface ResearchStep {
    [step: number]: {
        name: string;
        cost: {
            name: string;
            qty: number;
        }[];
        gold: number;
        time: number;
    };
    iterable: {
        name: string;
        cost: {
            name: string;
            qty: number;
        }[];
        gold: number;
        time: number;
    };
}
export interface Research {
    [tier: number]: {
        maxStep: number;
        step: ResearchStep
    }
}
// 단계 tier 주제 step

export const labStatCategories = [
    { name: '공격력', v: [23, 45, 68, 91, 113, 136, 159, 181, 204, 227, 238, 238, 238] },
    { name: '방어력', v: [45, 45, 136, 181, 227, 272, 317, 363, 408, 453, 476, 476, 476] },
    { name: 'HP', v: [453, 907, 1360, 1813, 2267, 2720, 3173, 3627, 4080, 4533, 4760, 4760, 4760] },
]

export const research: Research = {
    1: {
        maxStep: 41,
        step: {
            1: {
                name: '공물량 10% 증가',
                cost: [{
                    name: '지구에서 온 납',
                    qty: 3,
                }],
                gold: 50000,
                time: 3600
            }, 2: {
                name: '공물 최대 누적시간 60분 증가',
                cost: [{
                    name: '재활용 플라스틱',
                    qty: 3,
                }],
                gold: 20000,
                time: 1800
            }, 3: {
                name: '개당 생산 시간 5% 감소',
                cost: [{
                    name: '조각조각 기판',
                    qty: 3,
                }],
                gold: 10000,
                time: 1800
            }, 4: {
                name: '생산 슬롯 1개 증가',
                cost: [{
                    name: '뾰족뾰족 태엽',
                    qty: 3,
                }],
                gold: 20000,
                time: 1800
            }, 5: {
                name: '모험회 성공 확률 2% 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 1,
                }],
                gold: 5000,
                time: 1800
            }, 'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 3,
                }],
                gold: 3000,
                time: 300
            }, 41: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 3,
                }],
                gold: 10000,
                time: 1800
            },
        },
    }, 2: {
        maxStep: 41,
        step: {
            1: {
                name: '공물량 10% 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 4,
                }],
                gold: 100000,
                time: 7200 // 2:00:00
            },
            2: {
                name: '공물 최대 누적시간 60분 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 4,
                }],
                gold: 40000,
                time: 3600 // 1:00:00
            },
            3: {
                name: '개당 생산 시간 5% 감소',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 4,
                }],
                gold: 20000,
                time: 3600
            },
            4: {
                name: '모험회 일일 최대 횟수 1 증가',
                cost: [{
                    name: '팅팅탱탱 스프링',
                    qty: 4,
                }],
                gold: 40000,
                time: 3600
            },
            5: {
                name: '모험회 성공 확률 2% 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 4,
                }],
                gold: 10000,
                time: 3600
            },
            'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 4,
                }],
                gold: 6000, // 210000 / 35 = 6000
                time: 600 // 5:50:00 / 35 = 약 10분
            },
            41: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 4,
                }],
                gold: 20000,
                time: 3600
            }
        }
    }, 3: {
        maxStep: 42, // 6개 고유 + 35개 반복 + 1개 마지막
        step: {
            1: {
                name: '공물량 10% 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 5,
                }],
                gold: 150000,
                time: 10800 // 3:00:00
            },
            2: {
                name: '공물 최대 누적시간 60분 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 5,
                }],
                gold: 60000,
                time: 5400 // 1:30:00
            },
            3: {
                name: '개당 생산 시간 5% 감소',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 5,
                }],
                gold: 10000,
                time: 5400
            },
            4: {
                name: '표시되는 태스크 1개 추가',
                cost: [{
                    name: '배터리 팩',
                    qty: 5,
                }],
                gold: 60000,
                time: 5400
            },
            5: {
                name: '모험회 성공 확률 2% 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 5,
                }],
                gold: 15000,
                time: 5400
            },
            6: {
                name: '연회장 주방 화구 1 증가',
                cost: [{
                    name: 'LED 전구',
                    qty: 5,
                }],
                gold: 60000,
                time: 5400
            },
            'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 5,
                }],
                gold: 9000, // 315000 / 35 = 9000
                time: 900 // 8:45:00 / 35 = 15분
            },
            42: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 5,
                }],
                gold: 30000,
                time: 3600
            }
        }
    },
    4: {
        maxStep: 41, // 5개 고유 + 35개 반복 + 1개 마지막
        step: {
            1: {
                name: '공물량 10% 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 6,
                }],
                gold: 200000,
                time: 21600 // 6:00:00
            },
            2: {
                name: '공물 최대 누적시간 60분 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 6,
                }],
                gold: 80000,
                time: 10800 // 3:00:00
            },
            3: {
                name: '개당 생산 시간 5% 감소',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 6,
                }],
                gold: 40000,
                time: 10800
            },
            4: {
                name: '생산 슬롯 1개 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 6,
                }],
                gold: 80000,
                time: 10800
            },
            5: {
                name: '모험회 성공 확률 2% 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 6,
                }],
                gold: 20000,
                time: 10800
            },
            'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 6,
                }],
                gold: 12000, // 420000 / 35 = 12000
                time: 1800 // 17:30:00 / 35 = 30분
            },
            41: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 6,
                }],
                gold: 40000,
                time: 10800
            }
        }
    },
    5: {
        maxStep: 41, // 5개 고유 + 35개 반복 + 1개 마지막
        step: {
            1: {
                name: '공물량 10% 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 7,
                }],
                gold: 250000,
                time: 43200 // 12:00:00
            },
            2: {
                name: '공물 최대 누적시간 60분 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 7,
                }],
                gold: 100000,
                time: 21600 // 6:00:00
            },
            3: {
                name: '개당 생산 시간 5% 감소',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 7,
                }],
                gold: 50000,
                time: 21600
            },
            4: {
                name: '모험회 일일 최대 횟수 1 증가',
                cost: [{
                    name: '팅팅탱탱 스프링',
                    qty: 7,
                }],
                gold: 100000,
                time: 21600
            },
            5: {
                name: '모험회 성공 확률 2% 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 7,
                }],
                gold: 25000,
                time: 21600
            },
            'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 7,
                }],
                gold: 15000, // 525000 / 35 = 15000
                time: 3600 // 35:00:00 / 35 = 1시간
            },
            41: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 7,
                }],
                gold: 50000,
                time: 21600
            }
        }
    },
    6: {
        maxStep: 42, // 6개 고유 + 35개 반복 + 1개 마지막
        step: {
            1: {
                name: '공물량 10% 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 8,
                }],
                gold: 300000,
                time: 43200 // 12:00:00
            },
            2: {
                name: '공물 최대 누적시간 60분 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 8,
                }],
                gold: 120000,
                time: 21600 // 6:00:00
            },
            3: {
                name: '개당 생산 시간 5% 감소',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 8,
                }],
                gold: 60000,
                time: 21600
            },
            4: {
                name: '생산 슬롯 1개 증가',
                cost: [{
                    name: '뾰족 못',
                    qty: 8,
                }],
                gold: 120000,
                time: 21600
            },
            5: {
                name: '모험회 성공 확률 2% 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 8,
                }],
                gold: 30000,
                time: 21600
            },
            6: {
                name: '연회장 주방 화구 1 증가',
                cost: [{
                    name: 'LED 전구',
                    qty: 8,
                }],
                gold: 120000,
                time: 21600
            },
            'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 8,
                }],
                gold: 18000, // 630000 / 35 = 18000
                time: 3600 // 35:00:00 / 35 = 1시간
            },
            42: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 8,
                }],
                gold: 60000,
                time: 21600
            }
        }
    },
    7: {
        maxStep: 41, // 5개 고유 + 35개 반복 + 1개 마지막
        step: {
            1: {
                name: '공물량 10% 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 8,
                }],
                gold: 350000,
                time: 43200 // 12:00:00
            },
            2: {
                name: '공물 최대 누적시간 60분 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 8,
                }],
                gold: 140000,
                time: 21600 // 6:00:00
            },
            3: {
                name: '개당 생산 시간 5% 감소',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 8,
                }],
                gold: 70000,
                time: 21600
            },
            4: {
                name: '모험회 일일 최대 횟수 1 증가',
                cost: [{
                    name: '팅팅탱탱 스프링',
                    qty: 8,
                }],
                gold: 140000,
                time: 21600
            },
            5: {
                name: '모험회 성공 확률 2% 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 8,
                }],
                gold: 35000,
                time: 21600
            },
            'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 8,
                }],
                gold: 21000, // 735000 / 35 = 21000
                time: 3600 // 35:00:00 / 35 = 1시간
            },
            41: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 8,
                }],
                gold: 70000,
                time: 21600
            }
        }
    },
    8: {
        maxStep: 41, // 5개 고유 + 35개 반복 + 1개 마지막
        step: {
            1: {
                name: '공물량 10% 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 9,
                }],
                gold: 400000,
                time: 43200 // 12:00:00
            },
            2: {
                name: '공물 최대 누적시간 60분 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 9,
                }],
                gold: 160000,
                time: 21600 // 6:00:00
            },
            3: {
                name: '개당 생산 시간 5% 감소',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 9,
                }],
                gold: 80000,
                time: 21600
            },
            4: {
                name: '표시되는 태스크 1개 추가',
                cost: [{
                    name: '반질반질 종이',
                    qty: 9,
                }],
                gold: 160000,
                time: 21600
            },
            5: {
                name: '모험회 성공 확률 2% 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 9,
                }],
                gold: 40000,
                time: 21600
            },
            'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 9,
                }],
                gold: 24000, // 840000 / 35 = 24000
                time: 3600 // 35:00:00 / 35 = 1시간
            },
            41: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 9,
                }],
                gold: 80000,
                time: 21600
            }
        }
    },
    9: {
        maxStep: 41,
        step: {
            1: {
                name: '공물량 10% 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 10,
                }],
                gold: 450000,
                time: 43200 // 12:00:00
            },
            2: {
                name: '공물 최대 누적시간 60분 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 10,
                }],
                gold: 180000,
                time: 21600 // 6:00:00
            },
            3: {
                name: '개당 생산 시간 5% 감소',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 10,
                }],
                gold: 90000,
                time: 21600
            },
            4: {
                name: '표시되는 태스크 1개 추가',
                cost: [{
                    name: '반질반질 종이',
                    qty: 10,
                }],
                gold: 180000,
                time: 21600
            },
            5: {
                name: '모험회 성공 확률 2% 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 10,
                }],
                gold: 45000,
                time: 21600
            },
            'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 10,
                }],
                gold: 27000, // 840000 / 35 = 24000
                time: 3600 // 35:00:00 / 35 = 1시간
            },
            41: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 10,
                }],
                gold: 90000,
                time: 21600
            }
        }
    },
    10: {
        maxStep: 41,
        step: {
            1: {
                name: '공물량 10% 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 11,
                }],
                gold: 450000,
                time: 43200 // 12:00:00
            },
            2: {
                name: '공물 최대 누적시간 60분 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 11,
                }],
                gold: 200000,
                time: 21600 // 6:00:00
            },
            3: {
                name: '개당 생산 시간 5% 감소',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 11,
                }],
                gold: 100000,
                time: 21600
            },
            4: {
                name: '표시되는 태스크 1개 추가',
                cost: [{
                    name: '반질반질 종이',
                    qty: 11,
                }],
                gold: 200000,
                time: 21600
            },
            5: {
                name: '모험회 성공 확률 2% 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 11,
                }],
                gold: 50000,
                time: 21600
            },
            'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: 'MUSIM 칩',
                    qty: 11,
                }],
                gold: 30000,// 840000 / 35 = 24000
                time: 3600 // 35:00:00 / 35 = 1시간
            },
            41: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 11,
                }],
                gold: 100000,
                time: 21600
            }
        }
    },
    11: {
        maxStep: 42,
        step: {
            1: {
                name: '차원 대충돌 아티팩트 선택 횟수 1 증가',
                cost: [{
                    name: '네온 사인',
                    qty: 12,
                }],
                gold: 200000,
                time: 43200 // 12:00:00
            },
            2: {
                name: '엘리아스 프론티어 실체의 코인 10개 추가',
                cost: [{
                    name: '금수저',
                    qty: 3,
                }],
                gold: 200000,
                time: 21600 // 6:00:00
            },
            3: {
                name: '아티팩트 카드 관리 슬롯 1개 추가',
                cost: [{
                    name: '캐릭터 도장',
                    qty: 3,
                }],
                gold: 200000,
                time: 21600
            },
            4: {
                name: '시간당 배틀젬 획득량 2 증가',
                cost: [{
                    name: '철야 안대',
                    qty: 12,
                }],
                gold: 200000,
                time: 21600
            },
            5: {
                name: '평일 농장 접속 골드 수확량 300 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 12,
                }],
                gold: 200000,
                time: 21600
            },
            6: {
                name: '평일 농장 접속 당근 수확량 3 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 12,
                }],
                gold: 200000,
                time: 21600
            },
            'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: '감성 코어',
                    qty: 3,
                }],
                gold: 35000,
                time: 3600
            },
            42: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 12,
                }],
                gold: 110000,
                time: 21600
            }
        }
    },
    12: {
        maxStep: 42,
        step: {
            1: {
                name: '차원 대충돌 아티팩트 선택 횟수 1 증가',
                cost: [{
                    name: '네온 사인',
                    qty: 12,
                }],
                gold: 220000,
                time: 43200 // 12:00:00
            },
            2: {
                name: '엘리아스 프론티어 실체의 코인 20개 추가',
                cost: [{
                    name: '금수저',
                    qty: 3,
                }],
                gold: 220000,
                time: 21600 // 6:00:00
            },
            3: {
                name: '스펠 카드 관리 슬롯 1개 추가',
                cost: [{
                    name: '캐릭터 도장',
                    qty: 3,
                }],
                gold: 220000,
                time: 21600
            },
            4: {
                name: '시간당 배틀젬 획득량 2 증가',
                cost: [{
                    name: '철야 안대',
                    qty: 12,
                }],
                gold: 220000,
                time: 21600
            },
            5: {
                name: '평일 농장 접속 골드 수확량 300 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 12,
                }],
                gold: 220000,
                time: 21600
            },
            6: {
                name: '평일 농장 접속 당근 수확량 3 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 12,
                }],
                gold: 220000,
                time: 21600
            },
            'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: '감성 코어',
                    qty: 3,
                }],
                gold: 40000,
                time: 3600
            },
            42: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 12,
                }],
                gold: 120000,
                time: 21600
            }
        }
    },
    13: {
        maxStep: 42,
        step: {
            1: {
                name: '차원 대충돌 아티팩트 선택 횟수 1 증가',
                cost: [{
                    name: '네온 사인',
                    qty: 12,
                }],
                gold: 240000,
                time: 43200 // 12:00:00
            },
            2: {
                name: '엘리아스 프론티어 실체의 코인 20개 추가',
                cost: [{
                    name: '금수저',
                    qty: 3,
                }],
                gold: 240000,
                time: 21600 // 6:00:00
            },
            3: {
                name: '아티팩트 카드 관리 슬롯 1개 추가',
                cost: [{
                    name: '캐릭터 도장',
                    qty: 3,
                }],
                gold: 240000,
                time: 21600
            },
            4: {
                name: '시간당 배틀젬 획득량 2 증가',
                cost: [{
                    name: '철야 안대',
                    qty: 12,
                }],
                gold: 240000,
                time: 21600
            },
            5: {
                name: '평일 농장 접속 골드 수확량 300 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 12,
                }],
                gold: 240000,
                time: 21600
            },
            6: {
                name: '평일 농장 접속 당근 수확량 3 증가',
                cost: [{
                    name: 'S전자 반도체',
                    qty: 12,
                }],
                gold: 240000,
                time: 21600
            },
            'iterable': {
                name: '종족별 스탯 증가',
                cost: [{
                    name: '감성 코어',
                    qty: 3,
                }],
                gold: 45000,
                time: 3600
            },
            42: {
                name: '침략 시작 코인 5 증가',
                cost: [{
                    name: '배터리 팩',
                    qty: 12,
                }],
                gold: 130000,
                time: 21600
            }
        }
    }
}