import Konva from "konva";
import React, { useEffect, useRef } from "react";
import { Circle, Group, Image, Line, Rect, Shape, Text } from "react-konva";
import ImageNode from "../../../commons/timeline/ImageNode";
import { usePopoverActions } from "../../../hooks/usePopper";
import { RaidNode } from "../../../types/timeline/timelineTypes";
import { getPersonalityColor } from "../../../types/trickcalTypes";
import { dragState, isTouchDevice, timelineEvents, timelineLayers } from "../../../utils/timeline/timelineFunction";
import { HOVER_LIFT_Y } from "./MainStage";

const CARD = {
    w: 100,
    h: 120,
};

const CORNER_RADIUS = 16;
const BORDER_WIDTH = 4;
const BG_OPACITY = 0.15;

// 하단 이름
const PLATE_BASE_Y = CARD.h - 20; // 양 끝단 높이
const HILL_HEIGHT = 8; // 중앙이 볼록하게 솟아오르는 높이 차이
const CP_Y = PLATE_BASE_Y - (HILL_HEIGHT * 2);

interface RaidCardProps {
    node: RaidNode;
    calX: number;
    rowY: number
}

const RaidCard: React.FC<RaidCardProps> = ({
    node,
    calX,
    rowY,
}) => {
    const groupRef = useRef<Konva.Group>(null); // 카드를 감싸는 최상위 Group
    const cardTweenRef = useRef<Konva.Tween | null>(null);

    const isActiveRef = useRef(false);
    const homeLayerRef = useRef<Konva.Layer | null>(null);  // 전체 노드가 담긴 Layer 임시 저장용
    const cardId = useRef(Symbol()); // 카드 고유 Id(Symbol)

    const { showPopover, deactivateNow } = usePopoverActions();

    const activate = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!groupRef.current) return;
        timelineEvents.emitDeactivateAll(cardId.current);
        isActiveRef.current = true;

        const stage = e.target.getStage();
        if (stage) {
            const stageBox = stage.container().getBoundingClientRect();
            const nodeAbsPos = groupRef.current.getAbsolutePosition();

            // 카드 영역 생성하여 전달
            const cardRect = new DOMRect(
                stageBox.left + nodeAbsPos.x,
                stageBox.top + nodeAbsPos.y,
                CARD.w,
                CARD.h
            );
            // 팝오버 활성
            showPopover(
                { type: "raid", node },
                cardRect,
                deactivateAni);
        }

        const overlay = timelineLayers.getOverlayLayer();
        if (overlay) {
            if (!homeLayerRef.current) {
                homeLayerRef.current = groupRef.current?.getLayer();
            }
            groupRef.current?.moveTo(overlay);
        }
        groupRef.current?.moveToTop();

        cardTweenRef.current?.destroy();
        cardTweenRef.current = new Konva.Tween({
            node: groupRef.current,
            duration: 0.2,
            easing: Konva.Easings.EaseOut,
            y: rowY + HOVER_LIFT_Y,
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
            y: rowY,
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
        };
    }, []);

    const personalityColor = getPersonalityColor(node.personality!);
    const markImageSrc = node.personality
        ? `/images/personality/보스_${node.personality}.webp`
        : `/images/personality/보스_무성격.webp`

    return (
        <Group
            name="card"
            ref={groupRef}
            x={calX}
            y={rowY}
            onMouseEnter={(e) => {
                if (dragState.get() || isTouchDevice()) return;
                activate(e);
            }}
            onMouseLeave={(e) => {
                if (dragState.get() || isTouchDevice()) return;
                // deactivate(e);
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
            }}>
            {/* Rounded 처리 */}
            <Group
                clipFunc={(ctx) => {
                    ctx.beginPath();
                    ctx.moveTo(CORNER_RADIUS, 0);
                    ctx.lineTo(CARD.w - CORNER_RADIUS, 0);
                    ctx.quadraticCurveTo(CARD.w, 0, CARD.w, CORNER_RADIUS);
                    ctx.lineTo(CARD.w, CARD.h - CORNER_RADIUS);
                    ctx.quadraticCurveTo(CARD.w, CARD.h, CARD.w - CORNER_RADIUS, CARD.h);
                    ctx.lineTo(CORNER_RADIUS, CARD.h);
                    ctx.quadraticCurveTo(0, CARD.h, 0, CARD.h - CORNER_RADIUS);
                    ctx.lineTo(0, CORNER_RADIUS);
                    ctx.quadraticCurveTo(0, 0, CORNER_RADIUS, 0);
                    ctx.closePath();
                }}>

                {/* 카드 몸통(배경색) */}
                <Rect
                    width={CARD.w}
                    height={CARD.h}
                    fill="rgb(248,253,242)"
                    perfectDrawEnabled={false}
                />
                <Rect
                    width={CARD.w}
                    height={CARD.h}
                    fill={personalityColor}
                    opacity={BG_OPACITY}
                    perfectDrawEnabled={false}
                />

                {/* 보스 이미지 */}
                <ImageNode
                    node={node}
                    width={CARD.w}
                    x={0}
                    y={15}
                />

                {/* 하단 이름 칸 */}
                <Shape
                    fill="#FFFFFF"
                    perfectDrawEnabled={false}
                    sceneFunc={(ctx, shape) => {
                        ctx.beginPath();
                        ctx.moveTo(0, CARD.h);
                        ctx.lineTo(CARD.w, CARD.h);
                        ctx.lineTo(CARD.w, PLATE_BASE_Y);
                        ctx.quadraticCurveTo(CARD.w / 2, CP_Y, 0, PLATE_BASE_Y);
                        ctx.closePath();
                        ctx.fillStrokeShape(shape);
                    }}
                />
            </Group>

            {/* 성격 이미지 */}
            {markImageSrc && (
                <Group
                    x={CARD.w / 2 - 25 / 2}
                    y={PLATE_BASE_Y - HILL_HEIGHT - 30 / 2}
                >
                    <MarkImage src={markImageSrc} size={25} />
                </Group>
            )}

            {/* 보스명 */}
            <Text
                text={node.name}
                x={0}
                y={PLATE_BASE_Y - 3}
                width={CARD.w}
                height={CARD.h - PLATE_BASE_Y}
                align="center"  // 가로 중앙정렬
                verticalAlign="middle"  // 세로 중앙정렬
                fontSize={12}
                fontStyle="900"
                fill="#333333"
                perfectDrawEnabled={false}
            />

            {/* 성격 색상 테두리 */}
            <Rect
                width={CARD.w}
                height={CARD.h}
                cornerRadius={CORNER_RADIUS}
                stroke={personalityColor}
                strokeWidth={BORDER_WIDTH}
                perfectDrawEnabled={false}
            />
        </Group>
    );
};

const MarkImage: React.FC<{ src: string; size: number }> = ({ src, size }) => {
    const [img, setImg] = React.useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const image = new window.Image();
        image.src = src;
        image.onload = () => setImg(image);
    }, [src]);

    if (!img) return null;
    return <Image image={img} width={size} height={size} />;
};

export default React.memo(RaidCard);