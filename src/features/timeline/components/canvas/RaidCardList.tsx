import React from 'react';
import { Group } from 'react-konva';
import RaidCard from './RaidCard';
import { RaidNode } from '../../types/timelineTypes';
import { dateToPx } from '../../utils/timelineFunction';

interface RaidCardListProps {
    nodes: RaidNode[];
    rowY: number
}

const RaidCardList: React.FC<RaidCardListProps> = ({
    nodes,
    rowY,
}) => {
    return (
        <Group>
            {nodes.map((node) => (
                <RaidCard
                    key={`${node.type}_${node.season}_${node.name}`}
                    node={node}
                    calX={dateToPx(node.startDate)}
                    rowY={rowY}
                />
            ))}
        </Group>
    )
}

export default React.memo(RaidCardList)