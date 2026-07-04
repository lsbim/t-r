import Konva from "konva";
import React, { useEffect, useRef } from "react";
import { Group, Line, Rect, Shape } from "react-konva";
import ImageNode from "../../../commons/timeline/ImageNode";
import { RaidNode } from "../../../types/timeline/timelineTypes";
import { getPersonalityColor } from "../../../types/trickcalTypes";
import { isTouchDevice, timelineEvents } from "../../../utils/timeline/timelineFunction";
import TapeDecoration, { TapePosition } from "./TapeDecoration";

const CARD = {
    w: 100,
    h: 120,
    topY: -15,
    personalityHeight: 15,
    imageH: 70,
    tabs: 6,
};

const TEAR_Y = CARD.topY + CARD.imageH;
const TAB_W = CARD.w / CARD.tabs;
const TAB_H = CARD.h - CARD.imageH;
const TAB_INDICES = [0, 1, 2, 3, 5];

const RAID_TAPES: TapePosition[] = ['tl', 'tr'];
const LIFT_DURATION = 0.2;
const DROP_DURATION = 0.3;
const SPREAD_ANGLE_PER_TAB = 3.2;

// tween 회전 시 빈 공간을 없애기 위해 탭을 위로 살짝 늘려줄 픽셀 값
const OVERLAP_Y = 3;

interface RaidCardProps {
    node: RaidNode;
    calX: number;
    isDragging: boolean;
}

const RaidCard: React.FC<RaidCardProps> = ({ node, calX, isDragging }) => {
    const groupRef = useRef<Konva.Group>(null);
    const tabRefs = useRef<(Konva.Group | null)[]>([]);
    const tabTweensRef = useRef<(Konva.Tween | null)[]>([]);

    const tapeRefs = useRef<(Konva.Rect | null)[]>([null, null]);

    const isActiveRef = useRef(false);
    const cardId = useRef(Symbol());

    const animateTabs = (isHover: boolean) => {
        TAB_INDICES.forEach((idx) => {
            const node = tabRefs.current[idx];
            if (!node) return;

            if (tabTweensRef.current[idx]) {
                tabTweensRef.current[idx]!.destroy();
            }

            const targetAngle = isHover ? (2.5 - idx) * SPREAD_ANGLE_PER_TAB : 0;

            // rotation(transform)만 바뀌는 tween은 캐싱과 충돌하지 않으니 노드 캐싱 OK
            const tween = new Konva.Tween({
                node,
                duration: isHover ? LIFT_DURATION : DROP_DURATION,
                rotation: targetAngle,
                easing: Konva.Easings.EaseOut,
            });
            tabTweensRef.current[idx] = tween;
            tween.play();
        });
    };

    const activate = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        timelineEvents.emitDeactivateAll(cardId.current);
        isActiveRef.current = true;

        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = 'pointer';

        groupRef.current?.moveToTop();

        animateTabs(true);
    };

    const deactivate = (e?: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        isActiveRef.current = false;

        if (e) {
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = 'default';
        }

        animateTabs(false);
    };

    useEffect(() => {
        const unsubscribe = timelineEvents.onDeactivateAll((excludeId?: symbol) => {
            if (excludeId === cardId.current) return;
            if (isActiveRef.current) deactivate();
        });

        return () => {
            unsubscribe();
            tabTweensRef.current.forEach(t => t?.destroy());
        };
    }, []);

    return (
        <Group
            ref={groupRef}
            x={calX}
            y={20}
            onMouseEnter={(e) => {
                if (isDragging || isTouchDevice()) return;
                activate(e);
            }}
            onMouseLeave={(e) => {
                if (isDragging || isTouchDevice()) return;
                deactivate(e);
            }}
            onClick={(e) => {
                if (isDragging || isTouchDevice()) return;
                e.cancelBubble = true;
            }}
            onTap={(e) => {
                if (isDragging) return;
                e.cancelBubble = true;
                isActiveRef.current ? deactivate(e) : activate(e);
            }}
        >
            {/* 문어발 전단지 탭. 순서를 위에 배치하여 뒤에 깔리게 함 */}
            {TAB_INDICES.map((tabIndex) => {

                return (
                    <Group
                        key={tabIndex}
                        x={tabIndex * TAB_W + TAB_W / 2}
                        y={TEAR_Y} // 회전축 유지
                        offsetX={TAB_W / 2}
                        offsetY={0}
                        ref={(el) => {
                            tabRefs.current[tabIndex] = el;
                            // dash 패턴은 비용이 좀 있어서 캐싱하면 좋음
                            el?.cache();
                        }}
                    >
                        {/* 문어발 탭 */}
                        <Rect
                            y={-OVERLAP_Y}
                            width={TAB_W}
                            height={TAB_H + OVERLAP_Y}
                            fill="rgb(248,253,242)"
                            perfectDrawEnabled={false}
                        />

                        {/* 밑단 테두리 */}
                        <Line
                            points={[0, TAB_H, TAB_W, TAB_H]}
                            stroke="rgb(226,220,200)"
                            strokeWidth={8}
                            perfectDrawEnabled={false}
                        />
                    </Group>
                );
            })}

            {/* 보스 이미지 본체 부분 */}
            <Group
                perfectDrawEnabled={false}
                ref={(n) => {
                    if (!n) return;
                    n.cache({
                        x: 0,
                        y: CARD.topY,
                        width: CARD.w,
                        height: CARD.imageH, // Shape가 실제로 그려지는 전체 영역을 명시해야 잘리지 않음
                    });
                }}>

                {/* 문어발이 달려있는 하단 테두리를 제외하려면 Rect가 아닌 Shape를 사용 */}
                <Shape
                    sceneFunc={(ctx, shape) => {
                        ctx.beginPath();
                        ctx.moveTo(0, CARD.imageH); // 좌하단 시작
                        ctx.lineTo(0, 4);
                        ctx.quadraticCurveTo(0, 0, 4, 0); // 좌상단 라운드
                        ctx.lineTo(CARD.w - 4, 0);
                        ctx.quadraticCurveTo(CARD.w, 0, CARD.w, 4); // 우상단 라운드
                        ctx.lineTo(CARD.w, CARD.imageH); // 우하단 시작.. 하지만 닫지 않음. 사실상 끝
                        ctx.fillShape(shape); // 채우기
                        ctx.strokeShape(shape); // 테두리(3변)
                    }}
                    fill="rgb(248,253,242)"
                    stroke="rgb(226,220,200)"
                    strokeWidth={2}
                    y={CARD.topY}
                    perfectDrawEnabled={false}
                />

                <Rect
                    x={0}
                    y={CARD.topY}
                    width={CARD.w}
                    height={CARD.personalityHeight}
                    fill={getPersonalityColor(node.personality!)}
                    cornerRadius={[4, 4, 0, 0]}
                    perfectDrawEnabled={false}
                />
            </Group>

            <Group clip={{ x: 0, y: CARD.topY, width: CARD.w, height: CARD.imageH }}>
                <ImageNode node={node} width={CARD.w} x={0} y={CARD.topY} />
            </Group>

            {/* 상단 테이프 */}
            {RAID_TAPES.map((pos, i) => (
                <TapeDecoration
                    key={pos}
                    ref={(n) => { tapeRefs.current[i] = n; }}
                    position={pos}
                    groupWidth={CARD.w}
                    groupHeight={CARD.h}
                    groupTopY={CARD.topY}
                    groupOffsetX={0}
                />
            ))}
        </Group>
    );
};

export default React.memo(RaidCard);