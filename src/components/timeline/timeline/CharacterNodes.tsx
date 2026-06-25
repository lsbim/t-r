import { Group } from 'react-konva';
import { CharacterNode } from '../../../types/timeline/timelineTypes';
import React from 'react';
import ImageNode from '../../../commons/timeline/ImageNode';

interface CharacterNodesProps {
    nodes: CharacterNode[]
}

const CharacterNodes: React.FC<CharacterNodesProps> = ({
    nodes
}) => {

    return (
        <Group>
            {nodes.map((node, index) => {

                return (
                    <ImageNode
                        key={node.name ?? index}
                        node={node}
                    />
                )
            })}
        </Group>
    )
}

export default CharacterNodes