// 260716 기준 프론티어 보스만 취급 중
interface Bosses {
    [name: string]: BossInfo
}

interface BossInfo {
    [level: string]: BossInfoDetail;
}

interface BossInfoDetail {
    hp: number;
}

export const bosses: Bosses = {
    '우로스': {
        '마그맛2': {
            hp: 198859559796
        }
    }
}