import Konva from "konva";
import { useCallback, useEffect, useRef, useState } from "react";
import { dragState, timelineLayers } from "../utils/timeline/timelineFunction";


interface UseTimelineDragProps {
    timelinePx: number;
}

const useTimelineDrag = ({ timelinePx }: UseTimelineDragProps) => {
    const offsetXRef = useRef(0);
    const handlePctRef = useRef(100);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    const layerRef = useRef<Konva.Layer>(null);
    const handleElRef = useRef<HTMLDivElement>(null);
    const tooltipElRef = useRef<HTMLDivElement>(null);

    const cardsCacheRef = useRef<Konva.Node[] | null>(null);

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
        }
    }, [clampBody, viewportWidth, timelinePx]);

    const handleChangeHandle = useCallback((newPct: number) => {
        const targetPx = (newPct / 100) * timelinePx;
        applyOffset(-(targetPx - viewportWidth / 2));
    }, [timelinePx, viewportWidth, clampBody]);


    const handlePointerDown = useCallback(() => {
        dragState.set(true)
        if (layerRef.current) {
            const stage = layerRef.current.getStage();
            if (stage) {
                stage.listening(false);
            }
        }
    }, []);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!dragState.get()) return;
        applyOffset(offsetXRef.current + e.movementX);
    }, [clampBody]);

    const handlePointerUp = useCallback(() => {
        dragState.set(false);
        if (layerRef.current) {
            const stage = layerRef.current.getStage();
            if (stage) {
                stage.listening(true)
            }
        }
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
    };
};

export default useTimelineDrag;