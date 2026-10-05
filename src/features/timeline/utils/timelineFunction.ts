import Konva from "konva";

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

// Event Emitter
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

// 애니메이션 전용 Layer
let overlayLayer: Konva.Layer | null = null;

export const timelineLayers = {
    setOverlayLayer: (layer: Konva.Layer | null) => {
        overlayLayer = layer;
    },
    getOverlayLayer: (): Konva.Layer | null => overlayLayer,
};

let mainStage: Konva.Stage | null = null;

export const timelineStage = {
    set: (stage: Konva.Stage | null) => {
        mainStage = stage;
    },
    get: (): Konva.Stage | null => mainStage,
};

// isDragging 상태 파악을 전역 변수로 변경
let isDraggingNow = false;

export const dragState = {
    set: (value: boolean) => { isDraggingNow = value; },
    get: (): boolean => isDraggingNow,
};

