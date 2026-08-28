import React, { useEffect, useRef, useState } from 'react'
import { CharacterNode, isCharacterNode, isRaidNode, RaidNode } from '../../types/timeline/timelineTypes';
import { Image } from 'react-konva';
import { dateToPx } from '../../utils/timeline/timelineFunction';
import Konva from 'konva';
import { getCachedImage } from '../../utils/imageCache';

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
    const imageRef = useRef<Konva.Image>(null);

    const imageSrc = isRaidNode(node)
        ? node.personality
            ? `/images/boss/${node.name}(${node.personality}).webp`
            : `/images/boss/${node.name}.webp`
        : isCharacterNode(node)
            ? `/images/character/${node.name}.webp`
            : "";

    const image = imageSrc
        ? getCachedImage(imageSrc)
        : null;

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
            listening={false}
        />
    )
}

export default ImageNode