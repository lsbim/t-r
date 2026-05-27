import React from 'react'

const UsedPosition = ({ statsForSelect }: { statsForSelect: any }) => {
    return (
        <div className="w-[20%] flex flex-col justify-center ">
            <span className="text-[16px] font-bold mb-4">사용된 위치</span>
            <div className="flex gap-2">
                {/* 후열 6,7,8 */}
                <div className="flex-col gap-2 flex">
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={`${(statsForSelect.positionCounts[6] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                        style={{
                            backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[6] / statsForSelect.totalUses})`
                        }} />
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={`${(statsForSelect.positionCounts[7] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                        style={{
                            backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[7] / statsForSelect.totalUses})`
                        }} />
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={`${(statsForSelect.positionCounts[8] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                        style={{
                            backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[8] / statsForSelect.totalUses})`
                        }} />
                </div>
                {/* 중열 3,4,5 */}
                <div className="flex-col gap-2 flex">
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={`${(statsForSelect.positionCounts[3] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                        style={{
                            backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[3] / statsForSelect.totalUses})`
                        }} />
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={`${(statsForSelect.positionCounts[4] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                        style={{
                            backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[4] / statsForSelect.totalUses})`
                        }} />
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={`${(statsForSelect.positionCounts[5] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                        style={{
                            backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[5] / statsForSelect.totalUses})`
                        }} />
                </div>
                {/* 전열 0,1,2 */}
                <div className="flex-col gap-2 flex">
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={`${(statsForSelect.positionCounts[0] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                        style={{
                            backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[0] / statsForSelect.totalUses})`
                        }} />
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={`${(statsForSelect.positionCounts[1] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                        style={{
                            backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[1] / statsForSelect.totalUses})`
                        }} />
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={`${(statsForSelect.positionCounts[2] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                        style={{
                            backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[2] / statsForSelect.totalUses})`
                        }} />
                </div>
            </div>
        </div>
    )
}

export default React.memo(UsedPosition)