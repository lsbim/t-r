import Konva from "konva";
import React, { useEffect, useRef } from "react";
import { Group, Image, Rect } from "react-konva";
import ImageNode from "../../../commons/timeline/ImageNode";
import { usePopoverActions } from "../../../hooks/usePopper";
import { CharacterNode } from "../../../types/timeline/timelineTypes";
import { isTouchDevice, timelineEvents, timelineLayers } from "../../../utils/timeline/timelineFunction";
import TapeDecoration from "./TapeDecoration";

const CARD_WIDTH = 100;
const CARD_HEIGHT = 120
const CARD_OFFSET_X = -10
const CARD_OFFSET_Y = -30
const HOVER_LIFT_Y = -20;
const BASE_Y = 350;

const TAPE_POSITIONS = ['tl', 'tr', 'bl', 'br'] as const;

interface CharacterCardProps {
    node: CharacterNode;
    bgImage: HTMLImageElement | null;
    isDragging: boolean;
    calX: number;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
    node,
    bgImage,
    isDragging,
    calX
}) => {
    const groupRef = useRef<Konva.Group>(null);
    const tapeRefs = useRef<(Konva.Rect | null)[]>([null, null, null, null]); // 테이프 4개
    const cardTweenRef = useRef<Konva.Tween | null>(null);
    const tapeTweensRef = useRef<(Konva.Tween | null)[]>([null, null, null, null]); // 각 테이프 인덱스에 대한 애니메이션
    const isActiveRef = useRef(false);
    const cardId = useRef(Symbol());
    const homeLayerRef = useRef<Konva.Layer | null>(null); // 전체 노드가 담긴 Layer 임시 저장용
    const { showPopover, deactivateNow } = usePopoverActions();

    // Tween 즉시 종료
    // startHover 애니메이션 진행 중 endHover가 시작될 때,
    // 혹은 그 반대 상황이 발생할 때 Tween 충돌 방지
    const killTapeTween = (i: number) => {
        if (tapeTweensRef.current[i]) {
            tapeTweensRef.current[i]!.destroy();
            tapeTweensRef.current[i] = null;
        }
    };

    const animateTapes = (toOpacity: number, duration: number) => {
        tapeRefs.current.forEach((tapeNode, i) => {
            if (!tapeNode) return;
            killTapeTween(i); // 진행 중인 tween 종료
            const tween = new Konva.Tween({
                node: tapeNode,
                duration,
                easing: toOpacity === 0 ? Konva.Easings.EaseIn : Konva.Easings.EaseOut,
                opacity: toOpacity,
            });
            tapeTweensRef.current[i] = tween;
            tween.play(); // 새 tween 실행
        });
    };

    const activate = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!groupRef.current) return;

        timelineEvents.emitDeactivateAll(cardId.current);
        isActiveRef.current = true;

        const stage = e.target.getStage();
        if (stage) {
            stage.container().style.cursor = 'pointer';
            const stageBox = stage.container().getBoundingClientRect();
            const nodeAbsPos = groupRef.current.getAbsolutePosition();

            const targetY = BASE_Y + HOVER_LIFT_Y;
            // 카드 영역 생성하여 전달
            const cardRect = new DOMRect(
                stageBox.left + nodeAbsPos.x + CARD_OFFSET_X,
                stageBox.top + targetY + CARD_OFFSET_Y,
                CARD_WIDTH,
                CARD_HEIGHT
            );

            // 팝오버 활성
            showPopover(
                { type: "character", node },
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
            y: BASE_Y + HOVER_LIFT_Y,
        });
        cardTweenRef.current.play();

        animateTapes(0, 0.15);
    };

    // 비활성 애니메이션
    const deactivateAni = () => {
        if (!groupRef.current) return;
        isActiveRef.current = false;

        cardTweenRef.current?.destroy();
        cardTweenRef.current = new Konva.Tween({
            node: groupRef.current,
            duration: 0.25,
            easing: Konva.Easings.EaseOut,
            y: BASE_Y,
            onFinish: () => {
                if (homeLayerRef.current && groupRef.current) {
                    groupRef.current.moveTo(homeLayerRef.current);
                }
                animateTapes(1, 0.3);
            },
        });
        cardTweenRef.current.play();
    };

    useEffect(() => {
        const unsubscribe = timelineEvents.onDeactivateAll((excludeId?: symbol) => {
            if (excludeId === cardId.current) return;
            if (isActiveRef.current) deactivateNow();
        });

        // 필터 토글이나, 컬링 등으로 사라질 때 Tween이 메모리에 남아서 requestAnimationFrame를 계속 돌리는 걸 방지
        // 언마운트 시 tween은 destroy 필수
        return () => {
            unsubscribe();
            cardTweenRef.current?.destroy();
            tapeTweensRef.current.forEach(t => t?.destroy());
        };
    }, []);

    return (
        <Group
            ref={groupRef}
            x={calX}
            y={350}
            onMouseEnter={(e) => {
                if (isDragging || isTouchDevice()) return;
                activate(e);
            }}
            onMouseLeave={(e) => {
                if (isDragging || isTouchDevice()) return;
                // deactivate(e);
            }}
            // PC 환경에선 클릭으로 상태 변화 X
            onClick={(e) => {
                e.cancelBubble = true;
                if (isDragging || isTouchDevice()) return;
            }}
            // 탭 (터치 스크린)
            onTap={(e) => {
                if (isDragging) return;
                e.cancelBubble = true;
                if (isActiveRef.current) {
                    deactivateNow();
                } else {
                    activate(e);
                }
            }}
        >
            <Rect
                x={CARD_OFFSET_X}
                y={CARD_OFFSET_Y}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                fill="rgb(248,253,242)"
                stroke="rgb(226,220,200)"
                strokeWidth={2}
                cornerRadius={4}
            />
            {bgImage && (
                <Image
                    image={bgImage}
                    y={-20}
                    width={80}
                    height={80 * (bgImage.naturalHeight / bgImage.naturalWidth)}
                />
            )}
            <ImageNode node={node} width={80} x={0} y={0} />

            {TAPE_POSITIONS.map((pos, i) => (
                <TapeDecoration
                    key={pos}
                    ref={(n) => { tapeRefs.current[i] = n; }}
                    position={pos}
                    groupWidth={CARD_WIDTH}
                    groupHeight={CARD_HEIGHT}
                    groupTopY={CARD_OFFSET_Y}
                    groupOffsetX={CARD_OFFSET_X}
                />
            ))}
        </Group>
    );
};

export default React.memo(CharacterCard);