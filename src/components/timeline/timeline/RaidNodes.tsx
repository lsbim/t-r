import { Group } from 'react-konva';
import { CharacterNode, RaidNode } from '../../../types/timeline/timelineTypes';
import React from 'react';
import ImageNode from '../../../commons/timeline/ImageNode';
import { dateToPx } from '../../../utils/timeline/timelineFunction';

interface RaidNodesProps {
    nodes: RaidNode[]
}

const RaidNodes: React.FC<RaidNodesProps> = ({
    nodes
}) => {

    return (
        <Group>
            {nodes.map((node, index) => {

                const calX = dateToPx(node.startDate)

                return (
                    <ImageNode
                        key={`${node.type}_${node.season}_${node.name}`}
                        node={node}
                        width={120}
                        x={calX}
                        y={50}
                    />
                )
            })}
        </Group>
    )
}

export default React.memo(RaidNodes)