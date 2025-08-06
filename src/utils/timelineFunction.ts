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