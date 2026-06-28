import React, { useEffect, useState } from 'react';
import { Group, Image, Rect } from 'react-konva';
import ImageNode from '../../../commons/timeline/ImageNode';
import { CharacterNode } from '../../../types/timeline/timelineTypes';
import { dateToPx } from '../../../utils/timeline/timelineFunction';
import TapeDecoration, { TapePosition } from './TapeDecoration';

const CARD_WIDTH = 100;
const CARD_HEIGHT = 120

interface CharacterNodesProps {
    nodes: CharacterNode[]
}

const CharacterNodes: React.FC<CharacterNodesProps> = ({
    nodes
}) => {

    const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = `/images/background/character_bg.webp`;
        img.onload = () => setBgImage(img);
    }, []);

    const CARD_OFFSET_X = -10
    const CARD_OFFSET_Y = -30

    const CHARACTER_TAPES: TapePosition[] = ['tl', 'tr', 'bl', 'br'];

    return (
        <Group>
            {nodes.map((node, index) => {

                const calX = dateToPx(node.birthDate)
                const calY = 350;
                const bgSize = 80

                return (
                    <Group
                        x={calX}
                        y={calY}
                        key={node.name ?? index}>
                        <Rect
                            x={CARD_OFFSET_X}
                            y={CARD_OFFSET_Y}
                            width={CARD_WIDTH}
                            height={CARD_HEIGHT}
                            fill="rgb(248,253,242)"
                            stroke="rgb(226,220,200)"
                            strokeWidth={2}
                            cornerRadius={4}
                            // 해당 Rect를 레스터화. 드래그 해도 재계산 없음
                            ref={(node) => { node?.cache(); }}
                        />
                        {bgImage && (
                            <Image
                                image={bgImage}
                                y={-20}
                                width={bgSize}
                                height={bgSize * (bgImage.naturalHeight / bgImage.naturalWidth)}
                            />
                        )}
                        <ImageNode
                            node={node}
                            width={80}
                            x={0}
                            y={0}
                        />

                        {CHARACTER_TAPES.map(tape => (
                            <TapeDecoration
                                key={`timeline_character_tape_${tape}`}
                                position={tape}
                                groupWidth={CARD_WIDTH}
                                groupHeight={CARD_HEIGHT}
                                groupTopY={CARD_OFFSET_Y}
                                groupOffsetX={CARD_OFFSET_X}
                            />
                        ))}
                    </Group>
                )
            })}
        </Group>
    )
}

export default React.memo(CharacterNodes)