import React from 'react';
import { Rect } from 'react-konva';
import { useTheme } from '../../../hooks/useTheme';

interface TimelineStageBgProps {
    timelinePx: number;
    stageWidth: number;
    stageHeight: number;
}

const TIMELINE_BG_COLOR = '#7C8F6E'
const TIMELINE_BG_COLOR_DARK = '#18181b'
const EDGE_SIZE = 12;

const TimelineStageBg: React.FC<TimelineStageBgProps> = ({
    timelinePx,
    stageWidth,
    stageHeight,
}) => {

    const { theme } = useTheme();
    const bgColor = theme === 'dark' ? TIMELINE_BG_COLOR_DARK : TIMELINE_BG_COLOR;

    const bgX = -stageWidth / 2;
    const bgWidth = timelinePx + stageWidth;

    return (
        <>

            <Rect
                x={bgX}
                y={0}
                width={bgWidth}
                height={stageHeight}
                fill={bgColor}
            />

            <Rect
                x={bgX}
                y={0}
                width={bgWidth}
                height={EDGE_SIZE}
                fill="rgba(255, 255, 255, 0.1)"
            />


            <Rect
                x={bgX}
                y={stageHeight - EDGE_SIZE}
                width={bgWidth}
                height={EDGE_SIZE}
                fill="rgba(0, 0, 0, 0.1)"
            />
        </>
    );
}

export default React.memo(TimelineStageBg)