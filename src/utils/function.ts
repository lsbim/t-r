import { charInfo } from "../data/trickcalChar";
import { Race } from "../types/trickcalTypes";



export function findPersonalityByName(name: string) {
    return charInfo[name]?.personality;
}

export function findHexByName(name: string) {
    const personality = findPersonalityByName(name);

    if (!personality) return;

    switch (personality) {
        case "순수":
            return '#66c17c';
        case "냉정":
            return '#83b9eb';
        case "광기":
            return '#eb839a';
        case "활발":
            return '#ebdb83';
        case "우울":
            return '#c683ec';
    }
}

export function translateFacility(name: string) {

    switch (name) {
        case "lab":
            return '생산 랩';
        case "hall":
            return '연회장';
        case "adv":
            return '모험회';
        case "hq":
            return '교단 본부';
    }
}

export function translateRaid(name: string) {

    switch (name) {
        case "clash":
            return '차원 대충돌';
        case "frontier":
            return '엘리아스 프론티어';
    }
}

export function getDaysSince(dateString: string) {
    // 한국 시간대로 날짜만 추출
    const koreaToday = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const todayMidnight = new Date(koreaToday.getFullYear(), koreaToday.getMonth(), koreaToday.getDate());

    // - 토큰으로 연월일 나누기
    const [year, month, day] = dateString.split('-').map(Number);
    const targetMidnight = new Date(year, month - 1, day);

    // 일 수 차이 계산
    const diffTime = todayMidnight.getTime() - targetMidnight.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

export function toLocalMidnight(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function translateRaces(race: Race) {
    switch (race) {
        case '마녀':
            return 'witch';
        case '수인':
            return 'werebeast';
        case '엘프':
            return 'elf';
        case '요정':
            return 'sprite';
        case '용족':
            return 'dragon';
        case '유령':
            return 'phantom';
        case '정령':
            return 'elemental';
        case '미스틱':
            return 'mystic';
    }
}

export function preload(src: string): Promise<void> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
    });
}

export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0 ~ 11이라 +1 필요
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // "2026-05-18"
};

export function daysBetween(from: Date, to: Date): number {
    const midnightA = toLocalMidnight(from);
    const midnightB = toLocalMidnight(to);
    return Math.round(
        (midnightB.getTime() - midnightA.getTime()) / (1000 * 60 * 60 * 24)
    );
}

// dateRange 안에서 특정 요일(0=일, 1=월...)이 몇 번 등장하는지 계산
// 예) 주간상점은 매주 월요일(1)에 구매 가능
export function countWeekdays(
    startDate: string,
    endDate: string,
    targetDayOfWeek: number // 0=일, 1=월, ...
): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    const cursor = new Date(start);

    while (cursor <= end) {
        if (cursor.getDay() === targetDayOfWeek) count++;
        cursor.setDate(cursor.getDate() + 1);
    }
    return count;
}

// dateRange 안에서 특정 날(예: 매월 1일)이 몇 번 등장하는지 계산
// 예) 월간상점, 트릭컬패스 갱신
export function countMonthlyDays(
    startDate: string,
    endDate: string,
    targetDayOfMonth: number // 1이면 매월 1일
): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    // start 달부터 end 달까지 순회하면서 해당 날짜가 범위 안에 있는지 확인
    const cursor = new Date(start.getFullYear(), start.getMonth(), targetDayOfMonth);

    while (cursor <= end) {
        if (cursor >= start) count++;
        // 다음 달의 같은 날짜로 이동
        cursor.setMonth(cursor.getMonth() + 1);
    }
    return count;
}