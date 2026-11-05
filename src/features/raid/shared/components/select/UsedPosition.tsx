
import { useTheme } from '@/hooks/useTheme';
import { containerDarkBG, pageRootContainer } from '@/styles/container';
import React from 'react';

const UsedPosition = ({ statsForSelect }: { statsForSelect: any }) => {

    const { theme } = useTheme();

    const darkmodeBlockColor = theme === 'dark' ? 13 : 98;

    const COLUMNS = [
        [6, 7, 8], // 후열
        [3, 4, 5], // 중열
        [0, 1, 2], // 전열
    ];

    const positionCounts: Record<number, number> =
        statsForSelect.positionCounts ?? {};

    const positionUses = Object.values(positionCounts).reduce(
        (sum, count) => sum + count,
        0
    );

    const getCellStyle = (ratio: number) => {
        const sat = ratio === 0 ? 0 : 15 + ratio * 75;
        const bgL = ratio === 0 ? darkmodeBlockColor : 89 - ratio * 31;
        const borderL = bgL - 20;

        return {
            backgroundColor: `hsl(350, ${sat}%, ${bgL}%)`,
            borderColor: `hsl(350, ${sat}%, ${borderL}%)`,
        };
    };

    return (
        <div className={`w-full p-3 h-[200px] ${pageRootContainer} items-center gap-y-3 ${containerDarkBG} dark:border-zinc-700 rounded-xl border border-zinc-300`}>

            <div className="flex items-center justify-between w-full">
                <span className="text-[16px] font-bold text-start">
                    사용된 위치
                </span>

                {positionUses > 0 && (
                    <span className="text-xs text-gray-500 dark:text-zinc-400">
                        {positionUses}회
                    </span>
                )}
            </div>

            {positionUses > 0 ? (
                <div className="flex gap-2 flex-1 items-center">
                    {COLUMNS.map((colIndices, colIdx) => (
                        <div key={colIdx} className="flex-col gap-2 flex">
                            {colIndices.map((posIdx) => {
                                const count = positionCounts[posIdx] ?? 0;
                                const ratio = count / positionUses;
                                const pct = (ratio * 100).toFixed(1);

                                return (
                                    <div
                                        key={posIdx}
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content={`${pct}% (${count}/${positionUses})`}
                                        className="relative w-9 h-9 border cursor-pointer border-gray-800 dark:border-zinc-500"
                                        style={getCellStyle(ratio)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 select-none">
                    <img
                        src="/images/action/yc_sad.webp"
                        className="aspect-square object-center w-[100px] grayscale"
                    />
                    <span className="text-gray-700 dark:text-zinc-400 font-bold text-center">
                        {statsForSelect.totalUses > 0
                            ? '9인 편성 데이터가 없어 위치를 표시할 수 없습니다.'
                            : '집계된 데이터가 없습니다.'}
                    </span>
                </div>
            )}

            {positionUses > 0 && positionUses < statsForSelect.totalUses && (
                <span className="text-[11px] text-gray-500 dark:text-zinc-400">
                    위치 통계는 9인 편성만 집계합니다. (전체 픽 {positionUses}/{statsForSelect.totalUses}회)
                </span>
            )}
        </div>
    );
};

export default React.memo(UsedPosition);
