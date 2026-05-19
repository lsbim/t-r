import { ReceiptEntry, ReceiptLine, RotationSchedule } from "../../types/calc/gachaTypes";
import { countMonthlyDays, countWeekdays, daysBetween, toLocalMidnight } from "../function";
import { calcClashGem, calcClashV2Gem, calcFrontierGem, calcPassExp, countActiveDays, findPhaseOccurrences, splitByMonth } from "./gachaFunction";


// 레이드 로테이션
// 5월 14일: 대충돌 시작
// 사이클: 대충돌(7) → 휴식(7) → 프론티어(7) → 휴식(7) → 대충돌2.0(7) → 휴식(7) 반복
export const RAID_ROTATION: RotationSchedule = {
    epochDate: '2026-05-14',
    phases: [
        { label: 'clash', durationDays: 7, isActive: true },
        { label: 'rest', durationDays: 7, isActive: false },
        { label: 'frontier', durationDays: 7, isActive: true },
        { label: 'rest', durationDays: 7, isActive: false },
        { label: 'clashV2', durationDays: 7, isActive: true },
        { label: 'rest', durationDays: 7, isActive: false },
    ],
};

// 사복패스 로테이션
// 5월 14일: 활성 시작, 2주 활성 → 2주 휴식 반복
export const SKIN_PASS_ROTATION: RotationSchedule = {
    epochDate: '2026-05-14',
    phases: [
        { label: 'skin_pass_active', durationDays: 14, isActive: true },
        { label: 'skin_pass_inactive', durationDays: 14, isActive: false },
    ],
};

// 신캐 출시 로테이션 (격주)
// 기준 날짜 5월 7일 이후 매 2주마다 반복
export const NEW_CHARACTER_SCHEDULE: RotationSchedule = {
    epochDate: '2026-05-07',
    phases: [
        { label: 'new_char', durationDays: 14, isActive: true },
    ],
};

// 트릭컬 패스 보상 테이블
const TRICKCAL_PASS_REWARDS = {
    free: [
        { level: 5, gem: 100 },
        { level: 10, ticket: 1 },
        { level: 30, ticket: 2 },
        { level: 45, gem: 100 }
    ],
    paid: [
        { level: 1, paidGem: 200 },
        { level: 10, ticket: 3, paidGem: 200 },
        { level: 30, ticket: 3, paidGem: 300 }
    ]
};

// 사복 패스 보상 테이블
const SKIN_PASS_REWARDS = {
    free: [
        { level: 1, ticketFragment: 10 },
        { level: 2, gem: 10 },
        { level: 3, ticketFragment: 10 },
        { level: 4, gem: 10 },
        { level: 5, gem: 50 },
        { level: 7, gem: 10 },
        { level: 9, gem: 10 },
        { level: 11, ticketFragment: 10 },
        { level: 12, gem: 10 },
        { level: 13, ticketFragment: 10 },
        { level: 14, gem: 10 },
        { level: 15, gem: 50 },
        { level: 17, gem: 10 },
        { level: 19, gem: 10 }
    ],
    paid: [
        { level: 1, ticket: 5 },
        { level: 2, gem: 300 },
        { level: 3, ticket: 5 },
        { level: 4, gem: 300 },
        { level: 7, gem: 300 },
        { level: 9, gem: 300 },
        { level: 11, ticket: 5 },
        { level: 12, gem: 300 },
        { level: 13, ticket: 5 },
        { level: 14, gem: 300 },
        { level: 17, gem: 300 },
        { level: 19, gem: 300 }
    ]
};

function makeLine(
    id: string,
    label: string,
    gem: number,
    ticket: number = 0,
    ticketFragment: number = 0,
    paidGem: number = 0,
): ReceiptLine | null {
    if (gem === 0 && ticket === 0 && ticketFragment === 0) return null;
    return { id, label, gem, ticket, ticketFragment, paidGem };
}

export const RECEIPT_ORDER: ReceiptEntry[] = [

    // 일일 퀘스트
    {
        id: 'daily_quest',
        compute: (input, days) => makeLine(
            'daily_quest', '일일 퀘스트',
            days * 80
        ),
    },

    // 주간 퀘스트
    {
        id: 'weekly_quest',
        compute: (input, days, weeks) => weeks === 0 ? null : makeLine(
            'weekly_quest', '주간 퀘스트',
            weeks * 345  // 왕사탕/별사탕/스케쥴을 엘리프 환산값으로 처리
        ),
    },

    // 출석체크
    {
        id: 'attendance',
        compute: (input, days) => {
            // 마일스톤: 3일→40, 6일→60, 10일→50, 13일→50, 20일→100
            const attendanceGems = [
                { day: 3, gem: 40 },
                { day: 6, gem: 60 },
                { day: 10, gem: 50 },
                { day: 13, gem: 50 },
                { day: 20, gem: 100 },
            ];

            const segments = splitByMonth(input.startDate, input.endDate);
            let totalGem = 0;

            for (const seg of segments) {
                // 이 구간이 며칠인지 (당일 포함이라 +1)
                const daysInSegment = daysBetween(seg.start, seg.end) + 1;
                // 이 구간에서 달성한 출석 엘리프 합산
                const reached = attendanceGems.filter(m => m.day <= daysInSegment);
                totalGem += reached.reduce((sum, m) => sum + m.gem, 0);
            }

            if (totalGem === 0) return null;
            return makeLine('attendance', '출석체크', totalGem);
        },
    },

    // 차원 대충돌
    {
        id: 'clash',
        compute: (input) => {
            if (input.raid.clash.stage === 0 && input.raid.clash.rewardRank === 0) return null;

            const queryStart = toLocalMidnight(new Date(input.startDate));
            const queryEnd = toLocalMidnight(new Date(input.endDate));

            const occurrences = findPhaseOccurrences(RAID_ROTATION, 'clash', queryStart, queryEnd);
            if (occurrences.length === 0) return null;

            const { stageGem, seasonGem } = calcClashGem(input.raid.clash);

            const stageCount = occurrences.length;

            // 대충돌 여러번 발생 시 그만큼 보상을 곱함
            const seasonCount = occurrences.filter(
                o => o.restStart >= queryStart && o.restStart <= queryEnd
            ).length;

            const totalGem = stageGem * stageCount + seasonGem * seasonCount;
            if (totalGem === 0) return null;

            return makeLine('clash', '차원 대충돌', totalGem);
        },
    },

    // 차원 대충돌 2.0
    {
        id: 'clashV2',
        compute: (input) => {
            if (input.raid.clashV2.stage === 0 && input.raid.clashV2.rewardRank === 0) return null;

            const queryStart = toLocalMidnight(new Date(input.startDate));
            const queryEnd = toLocalMidnight(new Date(input.endDate));

            const occurrences = findPhaseOccurrences(RAID_ROTATION, 'clashV2', queryStart, queryEnd);
            if (occurrences.length === 0) return null;

            const { stageGem, seasonGem } = calcClashV2Gem(input.raid.clashV2);

            const stageCount = occurrences.length;
            const seasonCount = occurrences.filter(
                o => o.restStart >= queryStart && o.restStart <= queryEnd
            ).length;

            const totalGem = stageGem * stageCount + seasonGem * seasonCount;
            if (totalGem === 0) return null;
            return makeLine('clashV2', '차원 대충돌 2.0', totalGem);
        },
    },

    // 엘리아스 프론티어
    {
        id: 'frontier',
        compute: (input) => {

            const queryStart = toLocalMidnight(new Date(input.startDate));
            const queryEnd = toLocalMidnight(new Date(input.endDate));

            // 매 프론티어 별 금요일 포함 판단용 (보스)
            const bossOccurrences = findPhaseOccurrences(
                RAID_ROTATION, 'frontier', queryStart, queryEnd, 1
            );

            // 매 프론티어 별 목요일 포함 판단용 (시즌퀘스트 보상)
            const subOccurrences = findPhaseOccurrences(
                RAID_ROTATION, 'frontier', queryStart, queryEnd, 0
            );

            // 목요일이 기간 내에 있는 횟수
            const subCount = subOccurrences.filter(
                o => o.effectiveStart >= queryStart && o.effectiveStart <= queryEnd
            ).length;

            // rewardRank 보상: restStart(다음 주 목요일)가 기간 내에 있는 횟수
            // 금요일~수요일이 기간에 포함됐고, 다음 주 목요일도 포함된 경우
            const seasonCount = bossOccurrences.filter(
                o => o.restStart >= queryStart && o.restStart <= queryEnd
            ).length;

            // 시즌 퀘스트도 없고 rewardRank도 없으면 null
            if (subCount === 0 && seasonCount === 0) return null;

            const { seasonGem } = calcFrontierGem(input.raid.frontier.rewardRank);

            // 시즌 퀘스트 보상은 rewardRank와 무관하게 항상 고정 지급
            const totalGem = subCount * 120 + seasonGem * seasonCount;
            const totalPaidGem = subCount * 300;
            const totalTicket = subCount * 5;

            if (totalGem === 0 && totalTicket === 0) return null;
            return makeLine('frontier', '엘리아스 프론티어', totalGem, totalTicket, 0, totalPaidGem);
        },
    },

    // 일간 상점
    {
        id: 'shop_daily',
        compute: (input, days) => input.shop.dailyGem
            ? makeLine('shop_daily', '일간 상점', days * 10)
            : null,
    },

    // 주간 상점
    {
        id: 'shop_weekly',
        compute: (input, days, weeks) => {
            if (!input.shop.weeklyGem) return null;
            // days 기반 계산 대신 실제 월요일 횟수를 셈
            const count = countWeekdays(input.startDate, input.endDate, 1);
            return makeLine('shop_weekly', '주간 상점', count * 50);
        },
    },

    // 월간 상점
    {
        id: 'shop_monthly',
        compute: (input) => {
            if (!input.shop.monthlyGem) return null;
            const count = countMonthlyDays(input.startDate, input.endDate, 1);
            return makeLine('shop_monthly', '월간 상점', count * 100);
        },
    },

    // 트릭컬 패스
    {
        id: 'trickcal_pass',
        compute: (input) => {

            // 경험치로 레벨 계산
            const exp = calcPassExp(input.startDate, input.endDate);
            const baseLevel = Math.floor(exp / 50);

            let totalGem = 0, totalPaidGem = 0, totalTicket = 0;

            // 수집품 구매(유엘 800)
            const isFigureActive = input.pass.trickcalPassFigure ?? false;
            if (isFigureActive) totalPaidGem += 800;
            const bonusLevel = isFigureActive ? 20 : 0;

            // 최종 레벨
            const level = Math.min(baseLevel + bonusLevel, 50);

            // 무료 보상 정산
            TRICKCAL_PASS_REWARDS.free.forEach(r => {
                if (level >= r.level) {
                    if (r.gem) totalGem += r.gem;
                    if (r.ticket) totalTicket += r.ticket;
                }
            });

            // 유료 보상 정산
            const isPaid = input.pass.trickcalPass ?? false;
            if (isPaid) {
                TRICKCAL_PASS_REWARDS.paid.forEach(r => {
                    if (level >= r.level) {
                        if (r.paidGem) totalPaidGem += r.paidGem;
                        if (r.ticket) totalTicket += r.ticket;
                    }
                });
            }

            return makeLine('trickcal_pass', '트릭컬 패스', totalGem, totalTicket, 0, totalPaidGem);
        },
    },

    // 사복 패스
    {
        id: 'skin_pass',
        compute: (input) => {
            const activeDays = countActiveDays(SKIN_PASS_ROTATION, input.startDate, input.endDate, 'skin_pass_active');
            if (activeDays === 0) return null;

            // 전체 조회 기간 중 실제 활성화된 기간의 비율을 적용하여 경험치 산출
            const exp = calcPassExp(input.startDate, input.endDate);
            const totalDays = daysBetween(new Date(input.startDate), new Date(input.endDate)) + 1;
            const ratio = activeDays / totalDays;

            // 20레벨 상한 (레벨당 30 exp)
            const level = Math.min(Math.floor((exp * ratio) / 30), 20);

            let totalGem = 0, totalPaidGem = 0, totalTicket = 0, totalFrag = 0;

            // 패스 결제 시 유엘 증정
            const isPaid = input.pass.skinPass ?? false;
            if (isPaid) totalPaidGem += 900;

            SKIN_PASS_REWARDS.free.forEach(r => {
                if (level >= r.level) {
                    if (r.gem) totalGem += r.gem;
                    if (r.ticketFragment) totalFrag += r.ticketFragment;
                }
            });

            if (isPaid) {
                SKIN_PASS_REWARDS.paid.forEach(r => {
                    if (level >= r.level) {
                        if (r.gem) totalGem += r.gem;
                        if (r.ticket) totalTicket += r.ticket;
                    }
                });
            }

            return makeLine('skin_pass', '사복 패스', totalGem, totalTicket, totalFrag, totalPaidGem);
        },
    },

    // 기록소
    {
        id: 'archive',
        compute: (input) => input.archive
            ? makeLine('archive', '기록소', 20) // 수치는 조건에 따라 조정
            : null,
    },

    // 왕사탕 충전
    {
        id: 'candy_charge',
        compute: (input, days) => {
            const chargeCost = [ // 비용은 계산 중 음수 처리
                { charge: 1, gem: 30 },
                { charge: 2, gem: 30 },
                { charge: 3, gem: 30 },
                { charge: 4, gem: 50 },
                { charge: 5, gem: 50 },
                { charge: 6, gem: 70 },
                { charge: 7, gem: 70 },
                { charge: 8, gem: 70 },
                { charge: 9, gem: 100 },
                { charge: 10, gem: 100 },
            ];

            const dailyCharge = input.spend.candyCharge;
            if (dailyCharge === 0) return null;

            // 1번째부터 dailyCharge번째까지의 비용을 누적합산 → 하루 총 비용
            const dailyCost = chargeCost
                .filter(c => c.charge <= dailyCharge)
                .reduce((sum, c) => sum + c.gem, 0);

            // 비용은 음수로 저장
            const totalGem = -(dailyCost * days);

            return makeLine('candy_charge', '왕사탕 충전', totalGem);
        },
    },

    // 별사탕 충전
    {
        id: 'star_candy_charge',
        compute: (input, days) => {
            const chargeCost = [ // 비용은 계산 중 음수 처리
                { charge: 1, gem: 30 },
                { charge: 2, gem: 60 },
                { charge: 3, gem: 100 },
            ];

            const dailyCharge = input.spend.starCandyCharge;
            if (dailyCharge === 0) return null;

            // 1번째부터 dailyCharge번째까지의 비용을 누적합산 → 하루 총 비용
            const dailyCost = chargeCost
                .filter(c => c.charge <= dailyCharge)
                .reduce((sum, c) => sum + c.gem, 0);

            // 비용은 음수로 저장
            const totalGem = -(dailyCost * days);

            return makeLine('star_candy_charge', '별사탕 충전', totalGem);
        },
    },

    {
        id: 'nice',
        compute: (input, days) => {

            const isNiceActive = input.shop.nice;
            if (!isNiceActive) return null;

            // 참잘 구매비용 = 200. 음수로 저장
            const totalGem = -(200 * days);

            return makeLine('nice', '참 잘했어요 구매', totalGem);
        },
    },
];

