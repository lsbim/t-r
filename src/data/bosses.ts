// 260716 기준 프론티어 보스만 취급 중
interface Bosses {
    [name: string]: BossInfo
}

interface BossInfo {
    [level: string]: BossInfoDetail;
}

interface BossInfoDetail {
    hp: number;
    lastBarHp: number;
}

export const bosses: Bosses = {
    '우로스': {
        '마그맛2': {
            hp: 198859559796,
            lastBarHp: 39890716466
        }
    },
    'M.E.O.W': {
        '마그맛2': {
            hp: 99447779898,
            lastBarHp: 19945358233
        }
    }
}