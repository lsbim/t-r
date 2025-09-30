import { Facility } from "../types/trickcalTypes";

export type FacilityCost = {
    [key in Facility]: {
        [level: number]: {
            cost: { name: string; qty: number }[];
            gold: number;
        };
    };
};

export const facilities: Partial<FacilityCost> = {
    '생산 랩': {
        2: {
            cost: [
                { name: '지구에서 온 납', qty: 5 },
                { name: '조각조각 기판', qty: 5 },
            ],
            gold: 5000
        }, 3: {
            cost: [
                { name: '지구에서 온 납', qty: 10 },
                { name: '조각조각 기판', qty: 10 },
            ],
            gold: 10000
        }, 4: {
            cost: [
                { name: '지구에서 온 납', qty: 20 },
                { name: '조각조각 기판', qty: 15 },
            ],
            gold: 20000
        }, 5: {
            cost: [
                { name: '배터리 팩', qty: 10 },
                { name: 'LED 전구', qty: 10 },
            ],
            gold: 50000
        }, 6: {
            cost: [
                { name: '배터리 팩', qty: 15 },
                { name: 'LED 전구', qty: 20 },
            ],
            gold: 100000
        }, 7: {
            cost: [
                { name: '배터리 팩', qty: 20 },
                { name: 'S전자 반도체', qty: 30 },
            ],
            gold: 200000
        }, 8: {
            cost: [
                { name: '배터리 팩', qty: 25 },
                { name: 'S전자 반도체', qty: 40 },
            ],
            gold: 500000
        }, 9: {
            cost: [
                { name: '배터리 팩', qty: 30 },
                { name: 'S전자 반도체', qty: 50 },
            ],
            gold: 750000
        }, 10: {
            cost: [
                { name: '배터리 팩', qty: 35 },
                { name: 'S전자 반도체', qty: 60 },
            ],
            gold: 1000000
        }, 11: {
            cost: [
                { name: '배터리 팩', qty: 40 },
                { name: 'S전자 반도체', qty: 70 },
            ],
            gold: 1250000
        }, 12: {
            cost: [
                { name: '배터리 팩', qty: 45 },
                { name: 'S전자 반도체', qty: 80 },
            ],
            gold: 1500000
        }, 13: {
            cost: [
                { name: '배터리 팩', qty: 50 },
                { name: 'S전자 반도체', qty: 90 },
            ],
            gold: 1750000
        },
    }, '모험회': {
        2: {
            cost: [
                { name: '단단한 돌', qty: 5 },
                { name: '말랑한 나무', qty: 2 },
            ],
            gold: 5000
        }, 3: {
            cost: [
                { name: '단단한 돌', qty: 10 },
                { name: '말랑한 나무', qty: 5 },
            ],
            gold: 10000
        }, 4: {
            cost: [
                { name: '단단한 돌', qty: 15 },
                { name: '말랑한 나무', qty: 10 },
            ],
            gold: 20000
        }, 5: {
            cost: [
                { name: '뾰족뾰족 태엽', qty: 5 },
                { name: '말랑한 나무', qty: 25 },
            ],
            gold: 50000
        }, 6: {
            cost: [
                { name: '뾰족뾰족 태엽', qty: 10 },
                { name: '말랑한 나무', qty: 25 },
            ],
            gold: 100000
        }, 7: {
            cost: [
                { name: '뾰족뾰족 태엽', qty: 15 },
                { name: '말랑한 나무', qty: 25 },
            ],
            gold: 200000
        }, 8: {
            cost: [
                { name: '뾰족 못', qty: 10 },
                { name: '말랑한 나무', qty: 30 },
            ],
            gold: 500000
        }, 9: {
            cost: [
                { name: '뾰족 못', qty: 15 },
                { name: '말랑한 나무', qty: 40 },
            ],
            gold: 1000000
        }, 10: {
            cost: [
                { name: '뾰족 못', qty: 20 },
                { name: '말랑한 나무', qty: 50 },
            ],
            gold: 1500000
        },
    }, '교단 본부': {
        2: {
            cost: [
                { name: '말랑한 나무', qty: 2 },
                { name: '단단한 돌', qty: 4 },
            ],
            gold: 10000
        }, 3: {
            cost: [
                { name: '말랑한 나무', qty: 5 },
                { name: '단단한 돌', qty: 10 },
            ],
            gold: 20000
        }, 4: {
            cost: [
                { name: '말랑한 나무', qty: 10 },
                { name: '단단한 돌', qty: 20 },
            ],
            gold: 50000
        }, 5: {
            cost: [
                { name: '말랑한 나무', qty: 15 },
                { name: '뾰족뾰족 태엽', qty: 10 },
            ],
            gold: 100000
        }, 6: {
            cost: [
                { name: '말랑한 나무', qty: 25 },
                { name: '뾰족뾰족 태엽', qty: 15 },
            ],
            gold: 500000
        }, 7: {
            cost: [
                { name: '말랑한 나무', qty: 50 },
                { name: '뾰족뾰족 태엽', qty: 20 },
            ],
            gold: 1000000
        }, 8: {
            cost: [
                { name: '말랑한 나무', qty: 100 },
                { name: '뾰족 못', qty: 10 },
            ],
            gold: 1500000
        }, 9: {
            cost: [
                { name: '말랑한 나무', qty: 150 },
                { name: '뾰족 못', qty: 15 },
            ],
            gold: 2000000
        }, 10: {
            cost: [
                { name: '말랑한 나무', qty: 200 },
                { name: '뾰족 못', qty: 20 },
            ],
            gold: 5000000
        },
    }
}