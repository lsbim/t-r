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
                    <Group
                        key={`${node.type}_${node.season}_${node.name}`}
                        x={calX}
                        y={20}>
                        <ImageNode
                            node={node}
                            width={120}
                            x={0}
                            y={0}
                        />
                    </Group>
                )
            })}
        </Group>
    )
}

export default React.memo(RaidNodes)