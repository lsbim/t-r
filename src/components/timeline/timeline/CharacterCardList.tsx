import React, { useEffect, useMemo, useState } from 'react';
import { Group } from 'react-konva';
import { CharacterNode } from '../../../types/timeline/timelineTypes';
import { dateToPx, DAY_PX } from '../../../utils/timeline/timelineFunction';
import CharacterCard from './CharacterCard';

interface CharacterCardListProps {
    nodes: CharacterNode[];
    rowY: number;
}

const CharacterCardList: React.FC<CharacterCardListProps> = ({
    nodes,
    rowY,
}) => {

    const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = `/images/background/character_bg.webp`;
        img.onload = () => setBgImage(img);
    }, []);

    const calXList = useMemo(() => {

        const result = nodes.map((node, i) => {
            if (i === 0) return dateToPx(node.birthDate);

            const prevDate = new Date(nodes[i - 1].birthDate);
            const currDate = new Date(node.birthDate);
            const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / 86400000);

            return diffDays < 2
                ? dateToPx(nodes[i - 1].birthDate) + 2 * DAY_PX
                : dateToPx(node.birthDate);
        });

        return result;
    }, [nodes])

    return (
        <Group>
            {nodes.map((node, index) => (
                <CharacterCard
                    key={node.name ?? index}
                    node={node}
                    calX={calXList[index]}
                    bgImage={bgImage}
                    rowY={rowY}
                />
            ))}
        </Group>
    )
}

export default React.memo(CharacterCardList)