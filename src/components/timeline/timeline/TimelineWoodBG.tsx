import React, { useEffect, useRef, useState } from 'react'
import { Rect } from 'react-konva'

interface TimelineWoodBGProps {
    timelinePx: number;
    stageWidth: number;
    stageHeight: number;
}

const TimelineWoodBG: React.FC<TimelineWoodBGProps> = ({
    timelinePx,
    stageWidth,
    stageHeight,
}) => {
    const [woodTexture, setWoodTexture] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = '/images/background/timeline_wood_bg.webp';
        img.onload = () => setWoodTexture(img);
    }, []);

    if (!woodTexture) return null;

    const bgX = -stageWidth / 2;
    const bgWidth = timelinePx + stageWidth;

    return (
        <>
            {/* 나무 팻말 텍스쳐(패턴) */}
            <Rect
                x={bgX}
                y={0}
                width={bgWidth}
                height={stageHeight}
                fillPatternImage={woodTexture}
                fillPatternRepeat="repeat-x"
                fillPatternScaleX={1}
                fillPatternScaleY={stageHeight / woodTexture.naturalHeight}
            />

            {/* 상단은 밝고 하단은 어두운 빛을 받는 효과 */}
            <Rect
                x={bgX}
                y={0}
                width={bgWidth}
                height={stageHeight}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: 0, y: stageHeight }}
                fillLinearGradientColorStops={[
                    0, 'rgba(255,255,255,0.12)',
                    0.4, 'rgba(0,0,0,0)',
                    1, 'rgba(0,0,0,0.22)',
                ]}
            />
        </>
    );
}

export default React.memo(TimelineWoodBG)