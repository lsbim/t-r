import React, { useMemo } from 'react';
import { Group } from 'react-konva';

import CharacterCard from './CharacterCard';
import { CharacterNode } from '../../types/timelineTypes';
import { getCachedImage } from '../../utils/imageCache';
import { getDateCardPositions } from '../../utils/timelineFunction';


interface CharacterCardListProps {
    nodes: CharacterNode[];
    rowY: number;
}

const CharacterCardList: React.FC<CharacterCardListProps> = ({
    nodes,
    rowY,
}) => {

    const bgImage = getCachedImage("/images/background/character_bg.webp");


    const calXList = useMemo(
        () => getDateCardPositions(nodes.map((node) => node.birthDate)),
        [nodes],
    );

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
