import React from 'react';
import { Group } from 'react-konva';
import { RaidNode } from '../../../types/timeline/timelineTypes';
import { dateToPx } from '../../../utils/timeline/timelineFunction';
import RaidCard from './RaidCard';

interface RaidCardListProps {
    nodes: RaidNode[];
    isDragging: boolean;
}

const RaidCardList: React.FC<RaidCardListProps> = ({
    nodes,
    isDragging,
}) => {
    return (
        <Group>
            {nodes.map((node) => (
                <RaidCard
                    key={`${node.type}_${node.season}_${node.name}`}
                    node={node}
                    calX={dateToPx(node.startDate)}
                    isDragging={isDragging}
                />
            ))}
        </Group>
    )
}

export default React.memo(RaidCardList)