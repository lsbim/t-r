import React, { useEffect, useState } from 'react'
import { CharacterNode, isCharacterNode, isRaidNode, RaidNode } from '../../types/timeline/timelineTypes';
import { Image } from 'react-konva';
import { dateToPx } from '../../utils/timeline/timelineFunction';

interface ImageNodeProps {
    node: CharacterNode | RaidNode
}

const TARGET_WIDTH = 80;

const ImageNode: React.FC<ImageNodeProps> = ({
    node
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

    const calX = isCharacterNode(node)
        ? dateToPx(node.birthDate)
        : isRaidNode(node)
            ? dateToPx(node.startDate)
            : 0;

    const aspectRatio = image.naturalHeight / image.naturalWidth;
    const height = TARGET_WIDTH * aspectRatio;

    return (
        <Image
            image={image}
            x={calX}
            y={400}
            width={TARGET_WIDTH}
            height={height}
        />
    )
}

export default ImageNode