import React from 'react'
import { useTheme } from '../../../hooks/useTheme';

const UsedPosition = ({ statsForSelect }: { statsForSelect: any }) => {

    const { theme } = useTheme();

    const darkmodeBlockColor = theme === 'dark' ? 13 : 98 // 0 = 검정, 100 = 흰

    const COLUMNS = [
        [6, 7, 8], // 후열
        [3, 4, 5], // 중열
        [0, 1, 2], // 전열
    ];

    const getCellStyle = (ratio: number) => {
        const sat = ratio === 0 ? 0 : 15 + ratio * 75;
        const bgL = ratio === 0 ? darkmodeBlockColor : 89 - ratio * 31;

        // 테두리는 배경보다 n% 어둡게
        const borderL = bgL - 20;

        return {
            backgroundColor: `hsl(350, ${sat}%, ${bgL}%)`,
            borderColor: `hsl(350, ${sat}%, ${borderL}%)`,
        };
    };

    return (
        <div className="w-full p-3 h-[200px] flex flex-col justify-center items-center gap-y-3 bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-xl border border-zinc-300">

            <span className="text-[16px] font-bold text-start">사용된 위치</span>

            <div className="flex gap-2 flex-1 items-center">
                {statsForSelect.totalUses > 0 && COLUMNS.map((colIndices, colIdx) => (
                    <div key={colIdx} className="flex-col gap-2 flex">
                        {colIndices.map((posIdx) => {
                            const ratio = statsForSelect.positionCounts[posIdx] / statsForSelect.totalUses;
                            const pct = (ratio * 100).toFixed(1); // percent

                            return (
                                <div
                                    key={posIdx}
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content={`${pct}%`}
                                    className="relative w-9 h-9 border cursor-pointer border-gray-800 dark:border-zinc-500"
                                    style={getCellStyle(ratio)}
                                />
                            );
                        })}
                    </div>
                ))}
                {statsForSelect.totalUses === 0 && (
                    <div className=" flex flex-col items-center justify-center select-none">
                        <img
                            src={`/images/action/yc_sad.webp`}
                            className="aspect-square object-center w-[100px] grayscale"
                        />
                        <span className="text-gray-700 dark:text-zinc-400 font-bold">
                            집계에서 제외되었습니다.
                        </span>
                    </div>
                )}
            </div>
        </div >
    )
}

export default React.memo(UsedPosition)