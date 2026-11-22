import React from 'react';
import { Group, Line } from 'react-konva';
import RaidCard from './RaidCard';
import { RaidNode } from '../../types/timelineTypes';
import { dateToPx, getDateCardPositions, RAID_CARD_GAP, RAID_CARD_WIDTH, RAID_CARD_HEIGHT } from '../../utils/timelineFunction';

export interface RaidCardLayout {
    node: RaidNode;
    calX: number;
    lane: number;
}

export const getRaidCardLayouts = (nodes: RaidNode[]): RaidCardLayout[] => {
    const normalRaids = nodes
        .filter((node) => node.type !== 'deepClash')
        .sort((a, b) => a.startDate.localeCompare(b.startDate));
    const deepClashes = nodes
        .filter((node) => node.type === 'deepClash')
        .sort((a, b) => a.startDate.localeCompare(b.startDate));

    // 날짜가 같은 카드만 기존 CharacterCardList와 같은 규칙으로 x축에서 살짝 어긋나게 둔다.
    const normalXPositions = getDateCardPositions(normalRaids.map((node) => node.startDate));
    const deepClashXPositions = getDateCardPositions(deepClashes.map((node) => node.startDate));

    return [
        ...normalRaids.map((node, index) => ({
            node,
            calX: normalXPositions[index],
            lane: 0,
        })),
        ...deepClashes.map((node, index) => ({
            node,
            calX: deepClashXPositions[index],
            lane: 1,
        })),
    ];
};

interface RaidCardListProps {
    layouts: RaidCardLayout[];
    rowY: number
}

const RaidCardList: React.FC<RaidCardListProps> = ({
    layouts,
    rowY,
}) => {
    return (
        <Group>
            {layouts
                .filter(({ node }) => node.type === 'deepClash')
                .map(({ node, calX, lane }) => {
                    const lineY = rowY + lane * (RAID_CARD_HEIGHT + RAID_CARD_GAP) + RAID_CARD_HEIGHT / 2 + 10;
                    const lineStartX = calX + RAID_CARD_WIDTH / 2;
                    const lineEndX = dateToPx(node.endDate);

                    if (lineEndX <= lineStartX) return null;

                    return (
                        <Group
                            key={`deep-clash-duration-${node.season}`}
                            x={lineStartX}
                            y={lineY}
                            listening={false}
                        >
                            <Line
                                points={[0, 0, lineEndX - lineStartX, 0]}
                                strokeLinearGradientStartPoint={{ x: 0, y: 0 }}
                                strokeLinearGradientEndPoint={{ x: lineEndX - lineStartX, y: 0 }}
                                strokeLinearGradientColorStops={[0, '#355778', 1, '#1e3554']}
                                strokeWidth={4}
                                opacity={0.9}
                            />
                            <Line
                                points={[lineEndX - lineStartX, -12, lineEndX - lineStartX, 12]}
                                stroke="#1e3554"
                                strokeWidth={4}
                                opacity={0.95}
                            />
                        </Group>
                    );
                })}
            {layouts.map(({ node, calX, lane }) => (
                <RaidCard
                    key={`${node.type}_${node.season}_${node.name}`}
                    node={node}
                    calX={calX}
                    rowY={rowY + lane * (RAID_CARD_HEIGHT + RAID_CARD_GAP)}
                />
            ))}
        </Group>
    )
}

export default React.memo(RaidCardList)
