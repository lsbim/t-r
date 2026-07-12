import { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo } from "react";
import { CharacterNode, RaidNode } from "../types/timeline/timelineTypes";

type PopoverTarget =
    | { type: "character"; node: CharacterNode }
    | { type: "raid"; node: RaidNode };

interface PopoverState {
    target: PopoverTarget;
    cardRect: DOMRect;
}

interface PopoverActions {
    showPopover: (target: PopoverTarget, cardRect: DOMRect, onDeactivate: () => void) => void;
    registerPopoverEl: (el: HTMLElement | null) => void;
    deactivateNow: () => void;
}

const PopoverStateContext = createContext<PopoverState | null>(null);
const PopoverActionsContext = createContext<PopoverActions | null>(null);

export const PopoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [popover, setPopover] = useState<PopoverState | null>(null);

    const cardRectRef = useRef<DOMRect | null>(null); // 활성된 카드
    const popoverElRef = useRef<HTMLElement | null>(null); // 팝오버
    const deactivateRef = useRef<(() => void) | null>(null); // 외부로부터 받아온 카드 비활성(deactivate) 함수

    const cleanup = useCallback(() => {
        deactivateRef.current?.(); // 실행
        deactivateRef.current = null; // null(기본값)로 덮어쓰기
        cardRectRef.current = null;
        setPopover(null);
    }, []);

    // popover가 활성화된 동안 전역 mousemove로 커서 좌표 실시간 추적
    useEffect(() => {
        if (!popover) return;

        const lastPosRef = { current: { x: 0, y: 0 } }; // 실시간 추적 중인 커서 위치(좌표)
        let rafPending = false; // requestAnimationFrame 대기
        // let popoverRectCache: DOMRect | null = null;

        // 스크롤을 내리거나 브라우저 크기를 조절하여 위치가 변할 경우 캐시 날리기 함수
        // const invalidateCache = () => { popoverRectCache = null; };

        const checkPosition = () => {
            rafPending = false;
            const card = cardRectRef.current;
            if (!card) return;

            // if (!popoverRectCache) {
            //     popoverRectCache = popoverElRef.current?.getBoundingClientRect() ?? null;
            // }
            // const popoverRect = popoverRectCache;

            const popoverRect = popoverElRef.current?.getBoundingClientRect() ?? null;

            const left = Math.min(card.left, popoverRect?.left ?? card.left);
            const right = Math.max(card.right, popoverRect?.right ?? card.right);
            const top = Math.min(card.top, popoverRect?.top ?? card.top);
            const bottom = Math.max(card.bottom, popoverRect?.bottom ?? card.bottom);

            const { x, y } = lastPosRef.current;
            // 커서가 카드+팝오버 영역 안에 있는가?
            const inside = x >= left && x <= right && y >= top && y <= bottom;

            // 아니면 popover 상태 해제
            if (!inside) cleanup();
        };

        const handleMouseMove = (e: MouseEvent) => {
            lastPosRef.current = { x: e.clientX, y: e.clientY };
            if (rafPending) return;
            rafPending = true;
            requestAnimationFrame(checkPosition);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        // window.addEventListener("resize", invalidateCache);
        // window.addEventListener("scroll", invalidateCache, true);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            // window.removeEventListener("resize", invalidateCache);
            // window.removeEventListener("scroll", invalidateCache, true);
        };
    }, [popover, cleanup]);

    // 팝오버 활성
    const showPopover = useCallback((
        target: PopoverTarget,
        cardRect: DOMRect,
        onDeactivate: () => void
    ) => {
        setPopover({ target, cardRect });
        cardRectRef.current = cardRect;
        deactivateRef.current = onDeactivate;
    }, []);

    // 팝오버 element를 PopoverCard로부터 받아오기
    const registerPopoverEl = useCallback((el: HTMLElement | null) => {
        popoverElRef.current = el;
    }, []);

    // 즉시 비활성
    const deactivateNow = useCallback(() => cleanup()
        , [cleanup]);

    const actions = useMemo(() => ({
        showPopover, registerPopoverEl, deactivateNow
    }), [showPopover, registerPopoverEl, deactivateNow]);

    return (
        <PopoverActionsContext.Provider value={actions}>
            <PopoverStateContext.Provider value={popover}>
                {children}
            </PopoverStateContext.Provider>
        </PopoverActionsContext.Provider>
    );
};

export const usePopoverState = () => {
    // 팝오버의 정보
    return useContext(PopoverStateContext);
};

export const usePopoverActions = () => {
    // 팝오버 작동 기능
    const ctx = useContext(PopoverActionsContext);
    if (!ctx) {
        throw new Error("popover actions not exist!");
    }
    return ctx;
};