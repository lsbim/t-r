import React from 'react';
import { Rect } from 'react-konva';

interface TimelineWoodBGProps {
    timelinePx: number;
    stageWidth: number;
    stageHeight: number;
}

const TIMELINE_BG_COLOR = '#737773'
const EDGE_SIZE = 12;

const TimelineWoodBG: React.FC<TimelineWoodBGProps> = ({
    timelinePx,
    stageWidth,
    stageHeight,
}) => {

    const bgX = -stageWidth / 2;
    const bgWidth = timelinePx + stageWidth;

    return (
        <>

            <Rect
                x={bgX}
                y={0}
                width={bgWidth}
                height={stageHeight}
                fill={TIMELINE_BG_COLOR}
            />

            <Rect
                x={bgX}
                y={0}
                width={bgWidth}
                height={EDGE_SIZE}
                fill="rgba(255, 255, 255, 0.3)"
            />


            <Rect
                x={bgX}
                y={stageHeight - EDGE_SIZE}
                width={bgWidth}
                height={EDGE_SIZE}
                fill="rgba(0, 0, 0, 0.4)"
            />
        </>
    );
}

export default React.memo(TimelineWoodBG)