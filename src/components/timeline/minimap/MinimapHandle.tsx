import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { isCharacterNode, isRaidNode, TimelineMap } from '../../../types/timeline/timelineTypes';
import { START_DATE, timelineStage } from '../../../utils/timeline/timelineFunction';

interface MinimapHandleProps {
    handleElRef: React.RefObject<HTMLDivElement | null>;
    tooltipElRef: React.RefObject<HTMLDivElement | null>;
    totalDays: number;
    onChange: (newPct: number) => void;
    timelineMap: TimelineMap
}
const MinimapHandle: React.FC<MinimapHandleProps> = ({
    handleElRef,
    tooltipElRef,
    totalDays,
    onChange,
    timelineMap
}) => {

    const barRef = useRef<HTMLDivElement>(null); // 미니맵 바 추적(인식)용
    const isDraggingRef = useRef(false); // 드래그 체크용. 리렌더링이 불필요하니 useRef

    const latestClientXRef = useRef(0);
    const rafIdRef = useRef<number | null>(null);

    // 마우스 좌표를 핸들 바 퍼센트로 변환
    const getPctFromClientX = useCallback((clientX: number) => {
        if (!barRef.current) return 0;
        const rect = barRef.current.getBoundingClientRect();
        return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    }, []);

    // 드래그 시 움직이면 프레임 단위로(rAF) X좌표 갱신
    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!isDraggingRef.current) return;
        latestClientXRef.current = e.clientX;

        if (rafIdRef.current !== null) return;

        rafIdRef.current = requestAnimationFrame(() => {
            const pct = getPctFromClientX(latestClientXRef.current);
            onChange(pct);
            rafIdRef.current = null;
        });

    }, [getPctFromClientX, onChange]);

    // 드래그 종료 시 false
    const handlePointerUp = useCallback(() => {
        isDraggingRef.current = false;

        timelineStage.get()?.listening(true);

    }, []);

    // 클릭 시 X좌표 갱신
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        isDraggingRef.current = true;
        const pct = getPctFromClientX(e.clientX);
        onChange(pct);

        timelineStage.get()?.listening(false);

    }, [getPctFromClientX, onChange]);

    useEffect(() => {
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp]);

    // 사도 출시일 틱
    const characterTicks = useMemo(() => {
        return Object.entries(timelineMap).flatMap(([dateStr, nodes]) =>
            nodes.filter(isCharacterNode).map((node, i) => {
                const date = new Date(node.birthDate);
                const days = Math.floor((date.getTime() - START_DATE.getTime()) / 86400000);
                const pct = (days / totalDays) * 100;
                return (
                    <div
                        key={`timeline_handle_character_${dateStr}-${i}`}
                        className={`absolute top-0 bottom-0 w-0.5 opacity-85 translate-x-[-50%] bg-${node.personality}`}
                        style={{ left: `${pct}%` }}
                    />
                );
            })
        );
    }, [timelineMap, totalDays]);

    // 레이드 기간 범위
    const raidRanges = useMemo(() => {
        return Object.values(timelineMap).flat()
            .filter(isRaidNode)
            .sort((a, b) => a.startDate.localeCompare(b.startDate))
            .map((node) => {
                const startDays = Math.floor((new Date(node.startDate).getTime() - START_DATE.getTime()) / 86400000);
                const endDays = Math.floor((new Date(node.endDate).getTime() - START_DATE.getTime()) / 86400000);
                const leftPct = (startDays / totalDays) * 100;
                const widthPct = ((endDays - startDays) / totalDays) * 100;
                const colorClass = node.personality ? `bg-${node.personality}` : 'bg-[oklch(0.262_0.094_270.913)] dark:bg-[oklch(0.35_0.094_270.913)]';

                return (
                    <div
                        key={`timeline_handle_raid_${node.type}-${node.season}`}
                        className={`absolute top-0 bottom-0 opacity-85 ${colorClass}`}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    />
                );
            });
    }, [timelineMap, totalDays]);

    return (
        <div
            onDragStart={(e) => e.preventDefault()}
            className="lg:w-[992px] w-[90%]">
            <div
                onPointerDown={handlePointerDown}
                className="relative w-[88%] mx-auto select-none cursor-pointer">
                {/* 핸들 화살표 */}
                <div
                    ref={handleElRef}
                    className="absolute left-[100%] -top-3.5 z-20 flex flex-col items-center touch-none pb-1 translate-x-[-50%]"
                >
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[9px] border-t-gray-900 dark:border-t-zinc-200 -mb-px" />
                    <div className="w-[1.5px] h-3.5 bg-gray-900 dark:bg-zinc-200" />
                </div>

                {/* 핸들 바 */}
                <div
                    ref={barRef}
                    className="relative divide-y divide-zinc-700 dark:divide-zinc-500 rounded-[3px] bg-white dark:bg-zinc-900 border-[0.5px] border-zinc-700 dark:border-zinc-500 touch-none overflow-hidden">
                    <div className="relative h-[7px]">
                        {raidRanges}
                    </div>
                    <div className="relative h-[8px]">
                        {characterTicks}
                    </div>
                </div>

                {/* 연도 레이블 */}
                <div className="relative h-4 mt-1">
                    {(() => {
                        const startY = START_DATE.getFullYear();
                        const endY = new Date().getFullYear();
                        const labels = [];
                        for (let y = startY; y <= endY; y++) {
                            const jan1 = new Date(y, 0, 1);
                            const ref = jan1 < START_DATE ? START_DATE : jan1;
                            const days = Math.floor((ref.getTime() - START_DATE.getTime()) / 86400000);
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
                    draggable={false}
                    ref={tooltipElRef}
                    className="absolute top-[38px] z-30 bg-white border-[0.5px] border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 rounded-[5px] px-2 py-0.5 text-[11px] text-gray-900 whitespace-nowrap pointer-events-none translate-x-[-50%]"
                />
            </div>
        </div>
    );
}




export default React.memo(MinimapHandle);