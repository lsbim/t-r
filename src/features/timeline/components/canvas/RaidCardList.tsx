import React from 'react';
import { Group, Line } from 'react-konva';
import RaidCard from './RaidCard';
import { RaidNode } from '../../types/timelineTypes';
import { dateToPx, RAID_CARD_GAP, RAID_CARD_WIDTH, RAID_CARD_HEIGHT } from '../../utils/timelineFunction';

export interface RaidCardLayout {
    node: RaidNode;
    calX: number;
    lane: number;
}

export const getRaidCardLayouts = (nodes: RaidNode[]): RaidCardLayout[] => {
    const laneRightEdges: number[] = [];

    const orderedNodes = [...nodes].sort((a, b) => {
        // 같은 기간에 겹치면 심해 대격돌 카드를 아래 레인에 배치한다.
        if (a.type === 'deepClash' && b.type !== 'deepClash') return 1;
        if (a.type !== 'deepClash' && b.type === 'deepClash') return -1;
        return a.startDate.localeCompare(b.startDate);
    });

    return orderedNodes
        .map((node) => {
            const calX = dateToPx(node.startDate);
            const leftEdge = calX - RAID_CARD_WIDTH / 2;
            let lane = laneRightEdges.findIndex(
                (rightEdge) => leftEdge >= rightEdge + RAID_CARD_GAP
            );

            if (lane === -1) lane = laneRightEdges.length;

            laneRightEdges[lane] = calX + RAID_CARD_WIDTH / 2;

            return { node, calX, lane };
        });
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
