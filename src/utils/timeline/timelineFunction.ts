// 내용물로 인덱스 찾기
export function dateIndex(allDates: string[], isoDate: string): number {
    return allDates.indexOf(isoDate);
}

// y좌표 계산
export function getYOffset(allDates: string[], isoDate: string) {
    const idx = dateIndex(allDates, isoDate);
    const reversed = allDates.length - 1 - idx;
    return reversed * 4;
}

export const DAY_PX = 8;
export const START_DATE = new Date(2023, 8, 27);

export function dateToPx(dateStr: string): number {
    const date = new Date(dateStr);
    const days = Math.floor((date.getTime() - START_DATE.getTime()) / 86400000);
    return days * DAY_PX;
}