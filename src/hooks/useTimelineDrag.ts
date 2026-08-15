import Konva from "konva";
import { useCallback, useEffect, useRef, useState } from "react";
import { DAY_PX, dragState, START_DATE, timelineLayers } from "../utils/timeline/timelineFunction";


interface UseTimelineDragProps {
    timelinePx: number;
}

const useTimelineDrag = ({ timelinePx }: UseTimelineDragProps) => {
    const offsetXRef = useRef(0);
    const handlePctRef = useRef(100);
    const containerRef = useRef<HTMLDivElement>(null);
    const [viewportWidth, setViewportWidth] = useState(0);

    const [isPositionReady, setIsPositionReady] = useState(false);
    const hasInitializedRef = useRef(false);

    const totalMoveRef = useRef(0);
    const isDraggingActiveRef = useRef(false);
    const TAP_MOVE_THRESHOLD = 5;

    const layerRef = useRef<Konva.Layer>(null);
    const handleElRef = useRef<HTMLDivElement>(null);
    const tooltipElRef = useRef<HTMLDivElement>(null);

    const cardsCacheRef = useRef<Konva.Node[] | null>(null);

    const dragDeltaXRef = useRef(0);
    const rafIdRef = useRef<number | null>(null);

    // Y/X 드래그
    const dragDeltaYRef = useRef(0);
    const directionLockRef = useRef<'x' | 'y' | null>(null);
    const DIRECTION_LOCK_THRESHOLD = 10;

    const clampBody = useCallback((value: number) => {
        const MAX_OFFSET = viewportWidth / 2;
        const MIN_OFFSET = -(timelinePx - viewportWidth / 2);
        return Math.min(MAX_OFFSET, Math.max(MIN_OFFSET, value));
    }, [timelinePx, viewportWidth]);

    // offsetX(타임라인 X축), handlePct(핸들 위치 백분율) 갱신
    const applyOffset = useCallback((nextOffset: number) => {
        const clamped = clampBody(nextOffset);
        offsetXRef.current = clamped;

        // 화면 중앙 기준으로 핸들 위치 역산
        const centerPx = -clamped + viewportWidth / 2;
        const pct = Math.max(0, Math.min(100, (centerPx / timelinePx) * 100));
        handlePctRef.current = pct;

        // ref 이동 (리렌더X)
        if (layerRef.current) {
            layerRef.current.x(clamped);

            const viewLeft = -clamped - 150;
            const viewRight = -clamped + viewportWidth + 150;

            if (!cardsCacheRef.current) {
                cardsCacheRef.current = layerRef.current.find('.card');
            }

            cardsCacheRef.current.forEach((card) => {
                const x = card.x();
                // 컬링
                const nextVisible = x >= viewLeft && x <= viewRight;
                if (card.visible() !== nextVisible) {
                    card.visible(nextVisible);
                }
            });

            layerRef.current.batchDraw();
        }

        // 애니메이션용 레이어도 위치 적용
        const overlay = timelineLayers.getOverlayLayer();
        if (overlay) {
            overlay.x(clamped);
            overlay.batchDraw();
        }

        if (handleElRef.current) {
            handleElRef.current.style.left = `${pct}%`;
        }

        // 핸들 날짜 툴팁 텍스트 갱신
        if (tooltipElRef.current) {
            tooltipElRef.current.style.left = `${pct}%`;

            const days = Math.round((pct / 100) * (timelinePx / DAY_PX));
            const d = new Date(START_DATE.getTime() + days * 86400000);
            tooltipElRef.current.textContent =
                `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

        }
    }, [clampBody, viewportWidth, timelinePx]);

    const handleChangeHandle = useCallback((newPct: number) => {
        const targetPx = (newPct / 100) * timelinePx;
        applyOffset(-(targetPx - viewportWidth / 2));
    }, [timelinePx, viewportWidth, clampBody]);


    const handlePointerDown = useCallback(() => {
        dragState.set(true)
        totalMoveRef.current = 0;
        isDraggingActiveRef.current = false;
        directionLockRef.current = null;
        dragDeltaYRef.current = 0;
    }, []);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!dragState.get()) return;
        dragDeltaXRef.current += e.movementX;
        dragDeltaYRef.current += e.movementY;
        totalMoveRef.current += Math.abs(e.movementX);

        if (!isDraggingActiveRef.current && totalMoveRef.current > TAP_MOVE_THRESHOLD) {
            isDraggingActiveRef.current = true;
            const stage = layerRef.current?.getStage();
            stage?.listening(false);
        }

        if (directionLockRef.current === null) {
            const absX = Math.abs(dragDeltaXRef.current);
            const absY = Math.abs(dragDeltaYRef.current);
            if (absX + absY > DIRECTION_LOCK_THRESHOLD) {
                directionLockRef.current = absX >= absY ? 'x' : 'y';
            }
        }

        // raf 실행하면 브라우저가 숫자로 된 고유id 반환
        if (rafIdRef.current === null) {
            rafIdRef.current = requestAnimationFrame(() => {
                applyOffset(offsetXRef.current + dragDeltaXRef.current);

                if (directionLockRef.current === 'y' && dragDeltaYRef.current !== 0) {
                    window.scrollBy(0, -dragDeltaYRef.current);
                }

                dragDeltaXRef.current = 0;
                dragDeltaYRef.current = 0;
                rafIdRef.current = null;
            });
        }
    }, [applyOffset]);

    const handlePointerUp = useCallback(() => {
        dragState.set(false);

        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }

        if (layerRef.current) {
            const stage = layerRef.current.getStage();
            if (stage) {
                stage.listening(true)
            }
        }
        isDraggingActiveRef.current = false;
        cardsCacheRef.current = null;
    }, []);

    useEffect(() => {
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp]);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            setViewportWidth(entries[0].contentRect.width);
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (viewportWidth === 0) return;

        if (!hasInitializedRef.current) {
            hasInitializedRef.current = true;
            applyOffset(-(timelinePx - viewportWidth / 2));
            setIsPositionReady(true);
        } else {
            applyOffset(offsetXRef.current);
        }
    }, [viewportWidth]);

    return {
        isPositionReady,
        containerRef,
        viewportWidth,
        layerRef,
        handleElRef,
        tooltipElRef,
        handleChangeHandle,
        handlePointerDown,
    };
};

export default useTimelineDrag;