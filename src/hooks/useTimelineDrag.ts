import Konva from "konva";
import { useCallback, useEffect, useRef, useState } from "react";


interface UseTimelineDragProps {
    timelinePx: number;
}

const useTimelineDrag = ({ timelinePx }: UseTimelineDragProps) => {
    const isDraggingRef = useRef(false);
    const offsetXRef = useRef(0);
    const handlePctRef = useRef(100);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    const layerRef = useRef<Konva.Layer>(null);
    const handleElRef = useRef<HTMLDivElement>(null);
    const tooltipElRef = useRef<HTMLDivElement>(null);


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
            layerRef.current.batchDraw();
        }
        if (handleElRef.current) {
            handleElRef.current.style.left = `${pct}%`;
        }

        // 핸들 날짜 툴팁 텍스트 갱신
        if (tooltipElRef.current) {
            tooltipElRef.current.style.left = `${pct}%`;
        }
    }, [clampBody, viewportWidth, timelinePx]);

    const handleChangeHandle = useCallback((newPct: number) => {
        const targetPx = (newPct / 100) * timelinePx;
        applyOffset(-(targetPx - viewportWidth / 2));
    }, [timelinePx, viewportWidth, clampBody]);


    const handlePointerDown = useCallback(() => {
        isDraggingRef.current = true;
    }, []);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!isDraggingRef.current) return;
        applyOffset(offsetXRef.current + e.movementX);
    }, [clampBody]);

    const handlePointerUp = useCallback(() => {
        isDraggingRef.current = false;
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
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (viewportWidth === 0) return;
        applyOffset(-(timelinePx - viewportWidth / 2));
    }, [viewportWidth]);

    return {
        // offsetXRef,
        // handlePctRef,
        layerRef,
        handleElRef,
        tooltipElRef,
        handleChangeHandle,
        handlePointerDown,
        isDragging: isDraggingRef.current
    };
};

export default useTimelineDrag;