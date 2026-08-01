import Konva from "konva";
import React, { useEffect, useRef } from "react";
import { Group, Line, Shape, Text } from "react-konva";
import { usePopoverActions } from "../../../../hooks/usePopper";
import { dragState, isTouchDevice, timelineEvents, timelineLayers } from "../../../../utils/timeline/timelineFunction";
import { HOVER_LIFT_Y, ROW_HEIGHT } from "../MainStage";
import { PatchNoteNode } from "../../../../types/timeline/timelineTypes";


const CARD = {
    w: 90,
    h: 110,
};
const CORNER_RADIUS = 6;
const FOLD_SIZE = 20; // 우상단 접힌 모서리(도그이어) 크기
const CONTENT_PADDING = 10;

interface PatchNoteCardProps {
    note: PatchNoteNode
    calX: number;
    rowY: number;
}

const PatchNoteCard: React.FC<PatchNoteCardProps> = ({
    note,
    calX,
    rowY,
}) => {
    const groupRef = useRef<Konva.Group>(null);
    const cardTweenRef = useRef<Konva.Tween | null>(null);
    const isActiveRef = useRef(false);
    const cardId = useRef(Symbol());
    const homeLayerRef = useRef<Konva.Layer | null>(null);
    const { showPopover, deactivateNow } = usePopoverActions();

    const offsetY = (ROW_HEIGHT - CARD.h) / 2;
    const adjustedY = rowY + offsetY; // 행 간격 내 세로정렬

    const activate = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!groupRef.current) return;

        timelineEvents.emitDeactivateAll(cardId.current);
        isActiveRef.current = true;

        const stage = e.target.getStage();
        if (stage) {
            const stageBox = stage.container().getBoundingClientRect();
            const nodeAbsX = groupRef.current.getAbsolutePosition().x;

            const topAfterLift = stageBox.top + (adjustedY + HOVER_LIFT_Y);
            const bottomBeforeLift = stageBox.top + adjustedY + CARD.h;

            const cardRect = new DOMRect(
                stageBox.left + nodeAbsX,
                topAfterLift,
                CARD.w,
                bottomBeforeLift - topAfterLift
            );

            showPopover(
                { type: "patchNote", node: note },
                cardRect,
                deactivateAni);
        }

        const overlay = timelineLayers.getOverlayLayer();

        if (overlay) {
            if (!homeLayerRef.current) {
                homeLayerRef.current = groupRef.current.getLayer();
            }
            groupRef.current.moveTo(overlay);
        }
        groupRef.current.moveToTop();

        cardTweenRef.current?.destroy();
        cardTweenRef.current = new Konva.Tween({
            node: groupRef.current,
            duration: 0.2,
            easing: Konva.Easings.EaseOut,
            y: adjustedY + HOVER_LIFT_Y,
        });
        cardTweenRef.current.play();
    };

    const deactivateAni = () => {
        if (!groupRef.current) return;
        isActiveRef.current = false;

        cardTweenRef.current?.destroy();
        cardTweenRef.current = new Konva.Tween({
            node: groupRef.current,
            duration: 0.25,
            easing: Konva.Easings.EaseOut,
            y: adjustedY,
            onFinish: () => {
                if (homeLayerRef.current && groupRef.current) {
                    groupRef.current.moveTo(homeLayerRef.current);
                }
            },
        });
        cardTweenRef.current.play();
    };

    useEffect(() => {
        const unsubscribe = timelineEvents.onDeactivateAll((excludeId?: symbol) => {
            if (excludeId === cardId.current) return;
            if (isActiveRef.current) deactivateNow();
        });

        return () => {
            unsubscribe();
            cardTweenRef.current?.destroy();
        };
    }, []);

    return (
        <Group
            name="card"
            ref={groupRef}
            x={calX}
            y={adjustedY}
            onMouseEnter={(e) => {
                if (dragState.get() || isTouchDevice()) return;
                activate(e);
            }}
            onMouseLeave={(e) => {
                if (dragState.get() || isTouchDevice()) return;
            }}
            onClick={(e) => {
                e.cancelBubble = true;
                if (dragState.get() || isTouchDevice()) return;
            }}
            onTap={(e) => {
                if (dragState.get()) return;
                e.cancelBubble = true;
                if (isActiveRef.current) {
                    deactivateNow();
                } else {
                    activate(e);
                }
            }}
        >
            {/* 문서 카드 */}
            <Group
                perfectDrawEnabled={false}
                ref={(n) => {
                    if (!n) return;
                    const STROKE_W = 2;
                    n.cache({
                        x: -STROKE_W,
                        y: -STROKE_W,
                        width: CARD.w + STROKE_W * 2,
                        height: CARD.h + STROKE_W * 2,
                    });
                }}
            >
                {/* 문서 몸통 */}
                <Shape
                    sceneFunc={(ctx, shape) => {
                        ctx.beginPath();
                        ctx.moveTo(CORNER_RADIUS, 0);
                        ctx.lineTo(CARD.w - FOLD_SIZE, 0);
                        ctx.lineTo(CARD.w, FOLD_SIZE);
                        ctx.lineTo(CARD.w, CARD.h - CORNER_RADIUS);
                        ctx.arcTo(CARD.w, CARD.h, CARD.w - CORNER_RADIUS, CARD.h, CORNER_RADIUS);
                        ctx.lineTo(CORNER_RADIUS, CARD.h);
                        ctx.arcTo(0, CARD.h, 0, CARD.h - CORNER_RADIUS, CORNER_RADIUS);
                        ctx.lineTo(0, CORNER_RADIUS);
                        ctx.arcTo(0, 0, CORNER_RADIUS, 0, CORNER_RADIUS);
                        ctx.closePath();
                        ctx.fillShape(shape);
                        ctx.strokeShape(shape);
                    }}
                    fill="rgb(248,253,242)"
                    stroke="rgb(226,220,200)"
                    strokeWidth={2}
                    perfectDrawEnabled={false}
                />

                {/* 접힌 모서리(도그이어) 안쪽 면 */}
                <Shape
                    sceneFunc={(ctx, shape) => {
                        ctx.beginPath();
                        ctx.moveTo(CARD.w - FOLD_SIZE, 0);
                        ctx.lineTo(CARD.w, FOLD_SIZE);
                        ctx.lineTo(CARD.w - FOLD_SIZE, FOLD_SIZE);
                        ctx.closePath();
                        ctx.fillShape(shape);
                        ctx.strokeShape(shape);
                    }}
                    fill="rgb(226,220,200)"
                    stroke="rgb(200,184,154)"
                    strokeWidth={1}
                    perfectDrawEnabled={false}
                />

                {/* 장식용 텍스트 라인 */}
                {[0, 1, 2].map((i) => (
                    <Line
                        key={i}
                        points={[
                            CONTENT_PADDING,
                            CARD.h - 22 - i * 8,
                            CARD.w - CONTENT_PADDING - (i === 2 ? 30 : 0),
                            CARD.h - 22 - i * 8,
                        ]}
                        stroke="rgb(226,220,200)"
                        strokeWidth={2}
                        lineCap="round"
                        perfectDrawEnabled={false}
                    />
                ))}

                {/* 날짜 */}
                <Text
                    text={note.date}
                    x={CONTENT_PADDING}
                    y={12}
                    width={CARD.w - CONTENT_PADDING * 2}
                    fontSize={10}
                    fontStyle="700"
                    fill="rgb(150,140,120)"
                    perfectDrawEnabled={false}
                />
            </Group>
        </Group>
    );
};

export default React.memo(PatchNoteCard);