// components/timeline/timeline/RowDividers.tsx (신규)
import React from "react";
import { Line } from "react-konva";
import { getRowY, ROW_HEIGHT, TIMELINE_ROW_ORDER } from "./MainStage";
import { useTheme } from "@/hooks/useTheme";

const RowDivider = ({ timelinePx, raidRowHeight }: { timelinePx: number; raidRowHeight: number }) => {

    const { theme } = useTheme();
    const strokeColor = theme === 'dark' ? 'rgba(255,255,255,0.75)' : "rgba(0,0,0,0.75)"

    const dividerYs = TIMELINE_ROW_ORDER.slice(0, -1).map((rowName) => {
        const currentRowY = getRowY(rowName, raidRowHeight);

        const currentRowHeight = rowName === 'raid' ? raidRowHeight : ROW_HEIGHT;
        return currentRowY + currentRowHeight;
    });
    return (
        <>
            {dividerYs.map((y) => (
                <Line
                    key={`timeline_row_divider_${y}`}
                    points={[0, y, timelinePx, y]}
                    stroke={strokeColor}
                    strokeWidth={1}
                    dash={[4, 4]} // 점선
                    listening={false}
                    perfectDrawEnabled={false}
                />
            ))}
        </>
    );
};

export default React.memo(RowDivider);
