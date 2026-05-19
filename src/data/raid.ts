import { RewardTier } from "../types/calc/gachaTypes";

export const CLASH_STAGE_REWARDS = {
    normalBoss: 20,
    mainBoss: 50, // 3, 6단계 엘리프 50개, 이후 증가량은 함수에서 처리
};

export const CLASH_V2_STAGE_REWARDS = {
    normalBoss: 20,
    mainBoss: 100,
};

export const RAID_REWARDS: RewardTier[] = [
    { rank: 10, gem: 1500 },
    { rank: 30, gem: 1300 },
    { rank: 50, gem: 1200 },
    { rank: 80, gem: 1100 },
    { rank: 100, gem: 1000 },
]