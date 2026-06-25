import React, { useEffect, useState } from 'react'
import { CharacterNode, isCharacterNode, isRaidNode, RaidNode } from '../../types/timeline/timelineTypes';
import { Image } from 'react-konva';
import { dateToPx } from '../../utils/timeline/timelineFunction';

interface ImageNodeProps {
    node: CharacterNode | RaidNode;
    x: number;
    y: number;
    width: number;
    height?: number;
}

const ImageNode: React.FC<ImageNodeProps> = ({
    node,
    x = 0,
    y = 0,
    width = 0,
    height = 0,
}) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();

        if (isRaidNode(node)) {
            if (!node.personality) {
                img.src = `/images/boss/${node.name}.webp`;
            } else {
                img.src = `/images/boss/${node.name}(${node.personality}).webp`;
            }
        }
        else if (isCharacterNode(node)) {
            img.src = `/images/character/${node.name}.webp`;
        }

        img.onload = () => setImage(img);
    }, [node.name]);

    if (!image) return null;

    const aspectRatio = image.naturalHeight / image.naturalWidth;

    return (
        <Image
            image={image}
            x={x}
            y={y}
            width={width}
            height={height || width * aspectRatio}
        />
    )
}

export default ImageNode