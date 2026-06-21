import { number } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { CharacterNode, RaidNode, TimelineMap } from '../../../types/timeline/timelineTypes';

interface MinimapHandleProps {
    handlePct: number;
    totalDays: number;
    startDate: Date;
    onChange: (newPct: number) => void;
    timelineMap: TimelineMap
}
const MinimapHandle: React.FC<MinimapHandleProps> = ({
    handlePct,
    totalDays,
    startDate,
    onChange,
    timelineMap
}) => {

    const barRef = useRef<HTMLDivElement>(null); // 미니맵 바 추적(인식)용
    const isDraggingRef = useRef(false); // 드래그 체크용. 리렌더링이 불필요하니 useRef

    // 마우스 좌표를 핸들 바 퍼센트로 변환
    const getPctFromClientX = useCallback((clientX: number) => {
        if (!barRef.current) return 0;
        const rect = barRef.current.getBoundingClientRect();
        return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    }, []);

    // 드래그 시 움직이면 즉시 X좌표 갱신
    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!isDraggingRef.current) return;
        const clientX = e.clientX;
        onChange(getPctFromClientX(clientX));

    }, [getPctFromClientX, onChange]);

    // 드래그 종료 시 false
    const handlePointerUp = useCallback(() => {
        isDraggingRef.current = false;
    }, []);

    // 클릭 시 X좌표 갱신
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        isDraggingRef.current = true;
        const clientX = e.clientX;
        onChange(getPctFromClientX(clientX));

    }, [getPctFromClientX, onChange]);

    useEffect(() => {
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp]);

    const currentDate = useMemo(() => {
        const days = Math.round((handlePct / 100) * totalDays);
        return new Date(startDate.getTime() + days * 86400000);
    }, [handlePct, totalDays]);

    return (
        <div className="relative w-[88%] mx-auto select-none">
            {/* 핸들 화살표 */}
            <div
                onPointerDown={handlePointerDown}
                className="absolute -top-3.5 z-20 flex flex-col items-center cursor-pointer touch-none pb-1 translate-x-[-50%]"
                style={{ left: `${handlePct}%` }}>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[9px] border-t-gray-900 dark:border-t-zinc-200 -mb-px" />
                <div className="w-[1.5px] h-3.5 bg-gray-900 dark:bg-zinc-200" />
            </div>

            {/* 핸들 바 */}
            <div
                ref={barRef}
                onPointerDown={handlePointerDown}
                className="relative h-4 rounded-[3px] bg-white dark:bg-zinc-900 border-[0.5px] border-zinc-700 dark:border-zinc-500 cursor-pointer touch-none overflow-hidden">
                {Object.entries(timelineMap).flatMap(([dateStr, nodes]) =>
                    // 사도만 출력하도록 필터링
                    nodes.filter(isCharacterNode).map((node, i) => {
                        const date = new Date(node.birthDate);
                        const days = Math.floor((date.getTime() - startDate.getTime()) / 86400000);
                        const pct = (days / totalDays) * 100;
                        return (
                            <div
                                key={`${dateStr}-${i}`}
                                className={`absolute top-0 bottom-0 w-0.5 opacity-85 translate-x-[-50%] bg-${node.personality}`}
                                style={{ left: `${pct}%` }}
                            />
                        );
                    })
                )}
            </div>

            {/* 연도 레이블 */}
            <div className="relative h-4 mt-1">
                {(() => {
                    const startY = startDate.getFullYear();
                    const endY = new Date().getFullYear();
                    const labels = [];
                    for (let y = startY; y <= endY; y++) {
                        const jan1 = new Date(y, 0, 1);
                        const ref = jan1 < startDate ? startDate : jan1;
                        const days = Math.floor((ref.getTime() - startDate.getTime()) / 86400000);
                        const pct = (days / totalDays) * 100;
                        labels.push(
                            <span
                                key={y}
                                className="absolute text-[11px] text-gray-600 dark:text-zinc-400 whitespace-nowrap translate-x-[-50%]"
                                style={{ left: `${pct}%` }}>
                                {y}
                            </span>
                        );
                    }
                    labels.push(
                        <span
                            key="today"
                            className="absolute text-[11px] dark:text-zinc-200 whitespace-nowrap translate-x-[-50%] left-[100%]">
                            오늘
                        </span>
                    );
                    return labels;
                })()}
            </div>

            {/* 가리킨 날짜 표기 */}
            <div
                className="absolute top-[38px] z-30 bg-white dark:bg-zinc-900 border-[0.5px] border-zinc-300 dark:border-zinc-700 rounded-[5px] px-2 py-0.5 text-[11px] text-gray-900 dark:text-zinc-300 whitespace-nowrap pointer-events-none translate-x-[-50%]"
                onPointerDown={handlePointerDown}
                style={{ left: `${handlePct}%` }}>
                {formatDate(currentDate)}
            </div>
        </div>
    );
}


function formatDate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function isCharacterNode(node: RaidNode | CharacterNode): node is CharacterNode {
    return node.type === "character";
}

export default React.memo(MinimapHandle);