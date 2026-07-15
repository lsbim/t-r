import * as Popper from "@radix-ui/react-popper";
import { Portal } from "@radix-ui/react-portal";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePopoverActions, usePopoverState } from "../../hooks/usePopper";
import { RaidNode } from "../../types/timeline/timelineTypes";
import { findPersonalityByName, getCharacterIcons } from "../../utils/function";
import { Costume, costumes } from "../../data/costumes";
import { charInfo } from "../../data/trickcalChar";

const CharacterDetails = ({ targetName }: { targetName: string }) => {

    // 가장 최근 출시된 사복
    const characterLatestCostume = useMemo(() => {
        return costumes.reduce((acc, cos) => {
            if (cos.charName !== targetName) return acc;
            acc.count += 1;
            if (!acc.latest || cos.launchDate > acc.latest.launchDate) {
                acc.latest = cos;
            }
            return acc;
        }, { count: 0, latest: null as Costume | null });
    }, [targetName]);

    return (
        <div className="flex flex-col text-[12px] cursor-default">
            <div className="flex gap-x-1">
                <span className="text-gray-600 dark:text-zinc-400 w-[60px]">
                    출시일
                </span>
                <span>{charInfo[targetName].birthdate}</span>
            </div>
            <div className="flex gap-x-1">
                <span className="text-gray-600 dark:text-zinc-400 w-[60px]">
                    사복 개수
                </span>
                <span>{characterLatestCostume.count}개</span>
            </div>
            {/* 사복이 있으면 출력 */}
            {characterLatestCostume.latest && (
                <div className="flex gap-x-1">
                    <span className="text-gray-600 dark:text-zinc-400 w-[60px]">
                        마지막 사복
                    </span>
                    <span>
                        {characterLatestCostume.latest.cosName} ({characterLatestCostume.latest.launchDate})
                    </span>
                </div>
            )}
        </div>
    )
}


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

    const targetName = popover?.target?.node?.name ?? '알 수 없음';

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
                    className={`z-50 p-2 bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-xl border border-zinc-300 dark:text-zinc-200 bg-opacity-95`}>

                    <div className="flex flex-col gap-y-2">
                        <div className="flex justify-center items-center gap-x-2">
                            <Link
                                to={detailPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`overflow-hidden rounded-full w-14 h-14 border-4 border-${findPersonalityByName(targetName)}-dark`}>
                                <img
                                    src={`/images/profile/${targetName.startsWith('우로스(') ? '우로스' : targetName}.webp`}
                                />
                            </Link>
                            <div className="flex flex-col gap-y-1 justify-center">
                                <span className="font-bold text-[14px]">
                                    {targetName}
                                </span>
                                {target.type === 'character' && (
                                    <div className="flex gap-x-1">
                                        {getCharacterIcons(targetName).map(({ tooltip, src }) => (
                                            <img
                                                key={`popover_icon_${tooltip}`}
                                                src={src}
                                                alt={tooltip}
                                                title={tooltip}
                                                className="w-4 h-4" />
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                        {target.type === 'character' && (
                            <CharacterDetails targetName={targetName} />
                        )}
                    </div>

                </Popper.Content>
            </Portal>
        </Popper.Root>
    );
};

export default PopoverCard;