import React, { useEffect, useRef, useState } from 'react';
import { Group, Image, Rect } from 'react-konva';
import ImageNode from '../../../commons/timeline/ImageNode';
import { CharacterNode } from '../../../types/timeline/timelineTypes';
import { dateToPx } from '../../../utils/timeline/timelineFunction';
import TapeDecoration, { TapePosition } from './TapeDecoration';
import Konva from "konva";
import CharacterCard from './CharacterCard';

interface CharacterCardListProps {
    nodes: CharacterNode[];
    isDragging: boolean;
}

const CharacterCardList: React.FC<CharacterCardListProps> = ({
    nodes,
    isDragging
}) => {

    const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = `/images/background/character_bg.webp`;
        img.onload = () => setBgImage(img);
    }, []);

    return (
        <Group>
            {nodes.map((node, index) => (
                <CharacterCard
                    key={node.name ?? index}
                    node={node}
                    calX={dateToPx(node.birthDate)}
                    bgImage={bgImage}
                    isDragging={isDragging}
                />
            ))}
        </Group>
    )
}

export default React.memo(CharacterCardList)