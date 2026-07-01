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

export const DAY_PX = 12;
export const START_DATE = new Date(2023, 8, 27);

export function dateToPx(dateStr: string): number {
    const date = new Date(dateStr);
    const days = Math.floor((date.getTime() - START_DATE.getTime()) / 86400000);
    return days * DAY_PX;
}

// PC는 마우스오버 터치스크린은 토글
export function isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

type DeactivateListener = (excludeId?: symbol) => void;

const listeners = new Set<DeactivateListener>();

export const timelineEvents = {
    onDeactivateAll: (fn: DeactivateListener) => {
        listeners.add(fn);
        return () => listeners.delete(fn);
    },
    // excludeId와 동일한 symbol 카드는 신호를 무시
    emitDeactivateAll: (excludeId?: symbol) => {
        listeners.forEach(fn => fn(excludeId));
    },
};