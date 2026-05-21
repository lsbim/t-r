import { PVP_REWARDS } from "../../data/pvp";
import { CLASH_STAGE_REWARDS, CLASH_V2_STAGE_REWARDS, RAID_REWARDS } from "../../data/raid";
import { ClashInput, GachaInput, GachaResult, PhaseOccurrence, RaidGemResult, ReceiptLine, RewardTier, RotationPhase, RotationSchedule } from "../../types/calc/gachaTypes";
import { daysBetween, formatDate, toLocalMidnight } from "../function";
import { RECEIPT_ORDER } from "./gachaSchedule";

// 특정 날짜가 로테이션에서 어느 페이즈에 있는지 반환
export function getPhaseOnDate(schedule: RotationSchedule, date: Date): RotationPhase {
    const epoch = new Date(schedule.epochDate);
    const elapsed = daysBetween(epoch, date); // 에포크로부터 며칠 지났는가

    // 전체 사이클 길이 계산
    const cycleDays = schedule.phases.reduce((sum, p) => sum + p.durationDays, 0);

    // elapsed를 사이클 길이로 나눈 나머지 → 현재 사이클 안에서의 위치
    // 예: 사이클이 42일인데 elapsed가 50이면, 50 % 42 = 8 → 8일째 페이즈
    const positionInCycle = ((elapsed % cycleDays) + cycleDays) % cycleDays; // 음수 방어(에포크 이전 기록을 살필 때)

    // 페이즈 배열을 앞에서부터 누적하면서 현재 위치가 어느 페이즈에 속하는지 찾기
    let accumulated = 0;
    for (const phase of schedule.phases) {
        accumulated += phase.durationDays;
        if (positionInCycle < accumulated) return phase;
    }

    return schedule.phases[schedule.phases.length - 1]; // 안전장치
}

// dateRange 안에서 특정 label의 페이즈가 활성화된 날이 며칠인지 계산
export function countActiveDays(
    schedule: RotationSchedule,
    startDate: string,
    endDate: string,
    targetLabel: string
): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    const cursor = new Date(start);

    while (cursor <= end) {
        const phase = getPhaseOnDate(schedule, cursor);
        if (phase.label === targetLabel && phase.isActive) count++;
        cursor.setDate(cursor.getDate() + 1);
    }
    return count;
}

export function getRewardTier(rank: number, type: 'raid' | 'pvp'): RewardTier | null {
    if (rank === 0) return null;

    const result = type === 'raid'
        ? RAID_REWARDS.find(t => rank <= t.rank) ?? null
        : type === 'pvp'
            ? PVP_REWARDS.find(t => rank <= t.rank) ?? null
            : null

    return result;
}

interface BossCount {
    normalBoss: number;
    mainBoss: number;
}
function countBosses(stage: number): BossCount {
    const mainBoss = Math.floor(stage / 3);
    const normalBoss = stage - mainBoss; // 전체 스테이지 - 메인보스 횟수
    return { normalBoss, mainBoss };
}

// 날짜 범위를 월별 구간으로 쪼개서 반환
export function splitByMonth(startDate: string, endDate: string): Array<{ start: Date, end: Date }> {
    const segments: Array<{ start: Date, end: Date }> = [];
    const cursor = toLocalMidnight(new Date(startDate));
    const end = toLocalMidnight(new Date(endDate));

    while (cursor <= end) {
        const segStart = new Date(cursor);

        // 이번 달의 마지막 날 계산
        const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);

        // 실제 종료일과 이번 달 말일 중 더 이른 날이 이 구간의 끝
        const segEnd = monthEnd < end ? monthEnd : new Date(end);

        segments.push({ start: segStart, end: segEnd });

        // 다음 달 1일로 이동
        cursor.setFullYear(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }

    return segments;
}

// 패스 경험치 계산
export function calcPassExp(startDate: string, endDate: string): number {
    const start = toLocalMidnight(new Date(startDate));
    const end = toLocalMidnight(new Date(endDate));
    let exp = 0;

    // 월요일 기준으로 해당 주차를 식별하기 위한 Map
    const weeklyDays: Record<string, number> = {};
    const cursor = new Date(start);

    // 일 단위 반복 시작
    while (cursor <= end) {
        exp += 90; // 일일 퀘스트 고정 경험치

        // 현재 날짜 기준 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
        const dayOfWeek = cursor.getDay();

        // 월요일로부터 며칠 떨어져 있는지 계산 (일요일이면 6일 전, 그 외는 dayOfWeek - 1)
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        // 해당 날짜가 속한 주의 월요일 날짜 구하기
        const monday = new Date(cursor);
        monday.setDate(cursor.getDate() - diffToMonday);

        // 공용 함수를 사용해 "YYYY-MM-DD" 포맷의 고유 주차 키 생성
        const weekKey = formatDate(monday);

        weeklyDays[weekKey] = (weeklyDays[weekKey] || 0) + 1;

        // 다음 날로 이동
        cursor.setDate(cursor.getDate() + 1);
    }

    // 주간퀘는 1일차 4개, 2일차 3개, 3일차 2개 완료를 기준
    // 주차별 접속 일수에 따른 주간 퀘스트 경험치 합산
    for (const key in weeklyDays) {
        const daysInWeek = weeklyDays[key];
        if (daysInWeek >= 3) exp += 270;       // 3일 이상 접속: 주간퀘 모두 달성
        else if (daysInWeek === 2) exp += 210; // 2일 접속: 120 + 90
        else if (daysInWeek === 1) exp += 120; // 1일 접속: 120
    }

    return exp;
}

// 대충돌 계산
export function calcClashGem(input: ClashInput): RaidGemResult {
    if (input.stage === 0) {
        return { stageGem: 0, seasonGem: 0 };
    }

    const stageGem = calcClashStageGem(input.stage)

    const tier = getRewardTier(input.rewardRank, 'raid');
    const seasonGem = tier?.gem ?? 0;

    return { stageGem, seasonGem };
}

// 대충돌 2.0 계산
export function calcClashV2Gem(input: ClashInput): RaidGemResult {
    if (input.stage === 0) {
        return { stageGem: 0, seasonGem: 0 };
    }

    const { normalBoss, mainBoss } = countBosses(input.stage);
    const stageGem =
        normalBoss * CLASH_V2_STAGE_REWARDS.normalBoss +
        mainBoss * CLASH_V2_STAGE_REWARDS.mainBoss;

    const tier = getRewardTier(input.rewardRank, 'raid');
    const seasonGem = tier?.gem ?? 0;

    return { stageGem, seasonGem };
}

// 프론티어 시즌 보상만 계산
export function calcFrontierGem(rewardRank: number): RaidGemResult {
    if (rewardRank === 0) {
        return { stageGem: 0, seasonGem: 0 };
    }

    const tier = getRewardTier(rewardRank, 'raid');
    const seasonGem = tier?.gem ?? 0;

    return { stageGem: 0, seasonGem };
}

// 대충돌 스테이지 엘리프 계산
function calcClashStageGem(stage: number): number {
    const mainBossCount = Math.floor(stage / 3);
    const normalBossCount = stage - mainBossCount;

    // 일반 보스는 엘리프 20 고정
    const normalBossGem = normalBossCount * 20;

    // 메인보스는 N번째마다 보상이 다르므로 1 ~ mainBossCount까지 순회하며 합산
    let mainBossGem = 0;
    for (let n = 1; n <= mainBossCount; n++) {
        mainBossGem += 50 + Math.floor((n - 1) / 2) * 25;
    }

    return normalBossGem + mainBossGem;
}

export function calcGacha(input: GachaInput): GachaResult {
    // 날짜 범위 계산 - 이 두 값이 per_day, per_week 계산의 기반이 됨
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    const days = daysBetween(start, end) + 1;
    const weeks = Math.floor(days / 7);

    // RECEIPT_ORDER를 앞에서 뒤로 순서대로 순회
    // → 이 순서가 곧 영수증 출력 순서를 보장함
    const lines: ReceiptLine[] = RECEIPT_ORDER
        .map(entry => entry.compute(input, days, weeks))
        // compute가 null을 반환하면 (비활성, 미참여 등) 영수증에서 제외
        .filter((line): line is ReceiptLine => line !== null);

    // 전체 엘리프 합산
    const totalGem = lines.reduce((sum, line) => sum + line.gem, 0);

    const totalPaidGem = lines.reduce((sum, line) => sum + (line.paidGem ?? 0), 0);

    const totalTicket = lines.reduce((sum, line) => sum + line.ticket, 0);

    const totalTicketFrag = lines.reduce((sum, line) => sum + line.ticketFragment, 0);

    return { lines, totalGem, totalPaidGem, totalTicket, totalTicketFrag };
}


// 특정 라벨의 페이즈가 쿼리 기간과 겹치는 발생 구간 전체를 반환
export function findPhaseOccurrences(
    schedule: RotationSchedule,
    targetLabel: string,
    queryStart: Date,
    queryEnd: Date,
    effectiveStartOffset: number = 0, // 프론티어는 1(목요일 스킵)
): PhaseOccurrence[] {
    const epoch = toLocalMidnight(new Date(schedule.epochDate));
    const cycleDays = schedule.phases.reduce((sum, p) => sum + p.durationDays, 0);

    // 타겟 페이즈의 사이클 내 오프셋(시작 위치)을 계산
    let phaseOffset = 0;
    let targetIndex = -1;
    for (let i = 0; i < schedule.phases.length; i++) {
        if (schedule.phases[i].label === targetLabel) {
            targetIndex = i;
            break;
        }
        phaseOffset += schedule.phases[i].durationDays;
    }
    if (targetIndex === -1) return [];

    const phaseDuration = schedule.phases[targetIndex].durationDays;

    // queryStart 기준으로 몇 번째 사이클에 있는지 계산 → 탐색 시작점 결정
    // epoch로부터 경과 일수에서 phaseOffset을 빼면 "이 페이즈 기준으로 몇 번째 사이클"인지 나옴
    const elapsedToStart = daysBetween(epoch, queryStart);
    const startN = Math.floor((elapsedToStart - phaseOffset) / cycleDays);

    const occurrences: PhaseOccurrence[] = [];

    // startN - 1부터 탐색: queryStart 이전에 시작했지만 기간에 걸치는 케이스를 잡기 위해
    for (let N = startN - 1; ; N++) {
        // N번째 사이클의 이 페이즈가 시작하는 날
        const rawPhaseStart = new Date(epoch);
        rawPhaseStart.setDate(rawPhaseStart.getDate() + phaseOffset + N * cycleDays);
        const phaseStart = toLocalMidnight(rawPhaseStart);

        // 페이즈의 실질적 시작일 (effectiveStartOffset만큼 뒤로 밀림)
        const effectiveStart = new Date(phaseStart);
        effectiveStart.setDate(effectiveStart.getDate() + effectiveStartOffset);

        // 페이즈 마지막 날 (inclusive)
        const phaseEnd = new Date(phaseStart);
        phaseEnd.setDate(phaseEnd.getDate() + phaseDuration - 1);

        // 시즌 보상 수령일 = 페이즈 다음날(휴식 첫날, 목요일)
        const restStart = new Date(phaseStart);
        restStart.setDate(restStart.getDate() + phaseDuration);

        // phaseStart가 queryEnd를 넘어서면 더 이상 겹칠 수 없으므로 탐색 종료
        if (phaseStart > queryEnd) break;

        // 겹침 판정: effectiveStart <= queryEnd AND phaseEnd >= queryStart
        // 즉, 프론티어라면 금요일이 queryEnd 이전이고, 페이즈 끝이 queryStart 이후여야 함
        if (effectiveStart <= queryEnd && phaseEnd >= queryStart) {
            occurrences.push({ effectiveStart, phaseEnd, restStart });
        }
    }

    return occurrences;
}

// 줘팸터 등반 보상
export function calcPvpClimbReward(maxRank: number): number {
    if (maxRank === 0) return 0;

    //  구간 별 등반 보상
    const tiers = [
        { bottom: 3000, top: 1000, perRank: 0.8, bonus: 0 },
        { bottom: 1000, top: 500, perRank: 1.0, bonus: 0 },
        { bottom: 500, top: 200, perRank: 1.5, bonus: 0 },
        { bottom: 200, top: 50, perRank: 3.0, bonus: 2 }, // 200 -> 199위 진입 시 2개 보너스
        { bottom: 50, top: 1, perRank: 7.0, bonus: 4 }, // 50 -> 49위 진입 시 4개 보너스
    ];

    let gem = 0;

    for (const tier of tiers) {
        if (maxRank >= tier.bottom) continue;

        // 구간 랭크 계산
        const achieved = Math.max(maxRank, tier.top);
        const steps = tier.bottom - achieved;

        // 해당 구간에서 얻을 수 있는 엘리프
        if (steps > 0) {
            gem += Math.floor(steps * tier.perRank);
            gem += tier.bonus;
        }
    }

    return gem;
}

// 줘팸터 시즌 종료 보삼
export function calcPvpSeasonReward(rewardRank: number): number {
    if (rewardRank === 0) return 0;

    const seasonTiers = [
        { rankFrom: 1, rankTo: 100, gem: 1500 },
        { rankFrom: 101, rankTo: 300, gem: 1250 },
        { rankFrom: 301, rankTo: 800, gem: 1000 },
        { rankFrom: 801, rankTo: 1500, gem: 750 },
        { rankFrom: 1501, rankTo: Infinity, gem: 500 },
    ];

    return seasonTiers.find(t => {
        return rewardRank >= t.rankFrom && rewardRank <= t.rankTo
    })?.gem ?? 500;
}

// maxRank까지 도달하는데 걸리는 트라이횟수,
export function simulateClimb(targetRank: number): number {
    let current = 3001;
    let steps = 0;

    while (current > targetRank) {
        // 100등 미만은 35%, 나머지는 92% 순위까지 도전 가능
        const rate = current <= 100 ? 0.35 : 0.92;
        const next = Math.max(Math.floor(current * rate), 1);
        current = next;
        steps++;

        // 1등 도달
        if (current === 1) break;
    }

    return steps;
}

// N번의 도전 후 도달할 수 있는 순위. 기간 내 maxRank에 도달할 수 없을 때 사용
export function getRankAfterNSteps(totalSteps: number): number {
    let current = 3001;

    for (let i = 0; i < totalSteps; i++) {
        const rate = current <= 100 ? 0.35 : 0.92;
        const next = Math.max(Math.floor(current * rate), 1);
        current = next;
        if (current === 1) break;
    }

    return current;
}