import React, { useEffect, useRef, useState } from 'react'
import { CharacterNode, isCharacterNode, isRaidNode, RaidNode } from '../../types/timeline/timelineTypes';
import { Image } from 'react-konva';
import { dateToPx } from '../../utils/timeline/timelineFunction';
import Konva from 'konva';

interface ImageNodeProps {
    node: CharacterNode | RaidNode;
    x: number;
    y: number;
    width: number;
    height?: number;
    isGrayscale?: boolean
}

const ImageNode: React.FC<ImageNodeProps> = ({
    node,
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    isGrayscale = false,
}) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const imageRef = useRef<Konva.Image>(null);

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

    // 흑백모드일 시 캐싱
    useEffect(() => {
        if (image && imageRef.current && isGrayscale) {
            imageRef.current.cache();
        }
    }, [image, isGrayscale]);

    if (!image) return null;

    const aspectRatio = image.naturalHeight / image.naturalWidth;

    return (
        <Image
            ref={imageRef}
            image={image}
            x={x}
            y={y}
            width={width}
            height={height || width * aspectRatio}
            filters={isGrayscale ? [Konva.Filters.Grayscale] : []}
        />
    )
}

export default ImageNode