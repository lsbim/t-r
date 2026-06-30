import React from 'react'
import { Rect } from 'react-konva';
import Konva from "konva";

export type TapePosition = 'tl' | 'tr' | 'bl' | 'br';

interface TapeDecorationProps {
    position: TapePosition;
    groupWidth: number;
    groupHeight: number;
    groupTopY?: number;
    groupOffsetX?: number;
    ref: React.Ref<Konva.Rect>;
}

const TAPE_W = 40;
const TAPE_H = 12;

const TapeDecoration: React.FC<TapeDecorationProps> = ({
    position,
    groupWidth,
    groupHeight,
    groupTopY = 0,
    groupOffsetX = 0,
    ref,
}) => {

    const configs: Record<TapePosition, { angle: number; x: number; y: number }> = {
        tl: { angle: -35, x: groupOffsetX + 5, y: groupTopY + 5 },
        tr: { angle: 35, x: groupOffsetX + groupWidth - 5, y: groupTopY + 5 },
        bl: { angle: 35, x: groupOffsetX + 5, y: groupTopY + groupHeight - 5 },
        br: { angle: -35, x: groupOffsetX + groupWidth - 5, y: groupTopY + groupHeight - 5 },
    };

    const { angle, x, y } = configs[position];

    return (
        <Rect
            ref={ref}
            x={x}
            y={y}
            width={TAPE_W}
            height={TAPE_H}
            fill="rgba(200, 230, 255, 0.55)"
            stroke="rgba(180, 210, 240, 0.4)"
            strokeWidth={0.5}
            offsetX={TAPE_W / 2}
            offsetY={TAPE_H / 2}
            rotation={angle}
            perfectDrawEnabled={false}
            listening={false}
        />
    )
}

export default React.memo(TapeDecoration);