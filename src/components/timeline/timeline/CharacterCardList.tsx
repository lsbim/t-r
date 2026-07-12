import React, { useEffect, useState } from 'react';
import { Group } from 'react-konva';
import { CharacterNode } from '../../../types/timeline/timelineTypes';
import { dateToPx } from '../../../utils/timeline/timelineFunction';
import CharacterCard from './CharacterCard';

interface CharacterCardListProps {
    nodes: CharacterNode[];
}

const CharacterCardList: React.FC<CharacterCardListProps> = ({
    nodes,
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
                />
            ))}
        </Group>
    )
}

export default React.memo(CharacterCardList)