import Konva from "konva";
import React from 'react';
import { Group, Line, Rect } from 'react-konva';
import ImageNode from '../../../commons/timeline/ImageNode';
import { RaidNode } from '../../../types/timeline/timelineTypes';
import { dateToPx } from '../../../utils/timeline/timelineFunction';
import { getPersonalityColor } from "../../../types/trickcalTypes";

const ATTR_BAR_HEIGHT = 15;
const CARD_WIDTH = 100; // 카드 너비
const CARD_HEIGHT = 120; // 카드 높이
const CARD_TOP_Y = -15; // 카드 상단 y
const CARD_BOTTOM_Y = CARD_TOP_Y + CARD_HEIGHT; // 카드 하단 y(110)
const IMAGE_HEIGHT = 70; // 보스 이미지 영역 높이
const TEAR_Y = CARD_TOP_Y + IMAGE_HEIGHT;  // 뜯는 기준선 y(60)
const TAB_COUNT = 6; // 뜯는 전단지 개수
const TAB_WIDTH = CARD_WIDTH / TAB_COUNT; // 탭 하나의 너비(16.7)
const MISSING_TAB = 4; // 뜯긴 전단지 인덱스

const TAB_DIVIDERS = Array.from({ length: TAB_COUNT - 1 }, (_, i) => i + 1);

interface RaidNodesProps {
    nodes: RaidNode[]
}

const RaidNodes: React.FC<RaidNodesProps> = ({
    nodes
}) => {

    const CARD_WIDTH = 100;
    const CARD_HEIGHT = 120;

    return (
        <Group>
            {nodes.map((node, index) => {

                const calX = dateToPx(node.startDate)

                return (
                    <Group
                        key={`${node.type}_${node.season}_${node.name}`}
                        x={calX}
                        y={20}>

                        <Group
                            clipFunc={drawCardClipPath}
                            ref={(n) => { n?.cache(); }}
                            listening={false}
                            perfectDrawEnabled={false}
                        >

                            {/* 카드 배경 */}
                            <Rect
                                x={0}
                                y={CARD_TOP_Y}
                                width={CARD_WIDTH}
                                height={CARD_HEIGHT}
                                fill="rgb(248,253,242)"
                                stroke="rgb(226,220,200)"
                                strokeWidth={2}
                                cornerRadius={4}
                                perfectDrawEnabled={false}
                            />

                            {/* 보스 속성 색상 */}
                            <Rect
                                x={0}
                                y={CARD_TOP_Y}
                                width={CARD_WIDTH}
                                height={ATTR_BAR_HEIGHT}
                                fill={getPersonalityColor(node.personality!)}
                                cornerRadius={[4, 4, 0, 0]}
                                perfectDrawEnabled={false}
                            />

                            {/* 탭 구분 세로 점선 */}
                            {TAB_DIVIDERS.map((i) => (
                                <Line
                                    key={i}
                                    points={[
                                        i * TAB_WIDTH, TEAR_Y,
                                        i * TAB_WIDTH, CARD_BOTTOM_Y,
                                    ]}
                                    stroke="rgb(200,184,154)"
                                    strokeWidth={0.8}
                                    dash={[3, 2]}
                                    perfectDrawEnabled={false}
                                />
                            ))}
                        </Group>

                        <Group
                            clip={{
                                x: 0,
                                y: CARD_TOP_Y,
                                width: CARD_WIDTH,
                                height: IMAGE_HEIGHT
                            }}
                        >
                            <ImageNode
                                node={node}
                                width={CARD_WIDTH}
                                x={0}
                                y={CARD_TOP_Y}
                            />
                        </Group>
                    </Group>
                )
            })}
        </Group>
    )
}

function drawCardClipPath(ctx: Konva.Context) {
    const missingLeft = MISSING_TAB * TAB_WIDTH;
    const missingRight = (MISSING_TAB + 1) * TAB_WIDTH;

    ctx.beginPath();
    ctx.moveTo(0, CARD_TOP_Y);
    ctx.lineTo(CARD_WIDTH, CARD_TOP_Y);
    ctx.lineTo(CARD_WIDTH, CARD_BOTTOM_Y);

    // 뜯긴 미니전단지
    ctx.lineTo(missingRight, CARD_BOTTOM_Y);
    ctx.lineTo(missingRight, TEAR_Y);
    ctx.lineTo(missingLeft, TEAR_Y);
    ctx.lineTo(missingLeft, CARD_BOTTOM_Y);
    ctx.lineTo(0, CARD_BOTTOM_Y);
    ctx.closePath();
}

export default React.memo(RaidNodes)