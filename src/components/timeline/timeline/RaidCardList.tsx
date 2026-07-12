import React from 'react';
import { Group } from 'react-konva';
import { RaidNode } from '../../../types/timeline/timelineTypes';
import { dateToPx } from '../../../utils/timeline/timelineFunction';
import RaidCard from './RaidCard';

interface RaidCardListProps {
    nodes: RaidNode[];
}

const RaidCardList: React.FC<RaidCardListProps> = ({
    nodes,
}) => {
    return (
        <Group>
            {nodes.map((node) => (
                <RaidCard
                    key={`${node.type}_${node.season}_${node.name}`}
                    node={node}
                    calX={dateToPx(node.startDate)}

                />
            ))}
        </Group>
    )
}

export default React.memo(RaidCardList)