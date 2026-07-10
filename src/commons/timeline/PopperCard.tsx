import * as Popper from "@radix-ui/react-popper";
import { Portal } from "@radix-ui/react-portal";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePopoverActions, usePopoverState } from "../../hooks/usePopper";
import { RaidNode } from "../../types/timeline/timelineTypes";


const PopoverCard = () => {
    const popover = usePopoverState();
    const { registerPopoverEl, deactivateNow } = usePopoverActions();

    // 레이드/사도 카드는 konva로 만들어졌기 때문에 추적 못 함(getBoundingClientRect() 함수 검사에서 탈락)
    // 위치를 참조하기 위한 가짜 DOM 객체
    const rectAnchor = useMemo(() => ({
        getBoundingClientRect: () => popover?.cardRect ?? new DOMRect(),
    }), [popover]);

    if (!popover) return null;

    const { target } = popover;
    const detailPath = target.type === "character"
        ? `/character/${target.node.name}`
        : `/raid/${(target.node as RaidNode).season}`;

    console.log('popover: ', popover)

    return (
        <Popper.Root>
            <Popper.Anchor virtualRef={{ current: rectAnchor }} />
            <Portal>
                <Popper.Content
                    ref={registerPopoverEl} // mousemove로 popover를 추적하기 위한 ref
                    side="right"
                    sideOffset={4}
                    collisionPadding={8}
                    onClick={deactivateNow} // 모바일 환경 터치 시 비활성
                    style={{ zIndex: 50 }}>

                    <Link
                        to={detailPath}
                        onClick={(e) => e.stopPropagation()}>
                        이동...
                    </Link>

                </Popper.Content>
            </Portal>
        </Popper.Root>
    );
};

export default PopoverCard;