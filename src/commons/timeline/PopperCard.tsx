import * as Popper from "@radix-ui/react-popper";
import { Portal } from "@radix-ui/react-portal";
import { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import { Costume, costumes } from "../../data/costumes";
import { charInfo } from "../../data/trickcalChar";
import { usePopoverActions, usePopoverState } from "../../hooks/usePopper";
import { RaidNode } from "../../types/timeline/timelineTypes";
import { getCharacterIcons } from "../../utils/function";

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
        <div className="flex flex-col gap-y-1 text-[12px] cursor-default">
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

const RaidDetails = ({ node }: { node: RaidNode }) => {

    return (
        <div className="flex flex-col gap-y-1 text-[12px] cursor-default">
            <div className="flex gap-x-1">
                <span className="text-gray-600 dark:text-zinc-400 w-[60px]">
                    기간
                </span>
                <span>
                    {node.startDate} ~ {node.endDate}
                </span>
            </div>
            {node.type === 'clash' && (
                <div className="flex flex-col">
                    {node.rules.map((rule, index) => (
                        <div key={rule}
                            className="flex gap-x-1">
                            <span className="text-gray-600 dark:text-zinc-400 w-[60px]">
                                {index === 0 ? '규칙' : ''}
                            </span>
                            <span>
                                {rule}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            {node.type === 'clashV2' && (
                <div className="flex flex-col gap-y-1">
                    <div>
                        {node.rules.map((rule, index) => (
                            <div key={rule}
                                className="flex gap-x-1">
                                <span className="text-gray-600 dark:text-zinc-400 w-[60px]">
                                    {index === 0 ? '규칙' : ''}
                                </span>
                                <span>
                                    {rule}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div>
                        {node.sideSkills.map((skill, index) => (
                            <div key={skill}
                                className="flex gap-x-1">
                                <span className="text-gray-600 dark:text-zinc-400 w-[60px]">
                                    {index === 0 ? '이면의 파편' : ''}
                                </span>
                                <span>
                                    {skill}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {node.type === 'frontier' && (
                <div className="flex flex-col">
                    {node.power.map((po, index) => (
                        <div key={po}
                            className="flex gap-x-1">
                            <span className="text-gray-600 dark:text-zinc-400 w-[60px]">
                                {index === 0 ? '교주의 권능' : ''}
                            </span>
                            <span>
                                {po}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div >
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
    const targetName = popover?.target?.node?.name ?? '알 수 없음';

    const detailPath = target.type === "character"
        ? `/character/${target.node.name}`
        : `/raid/${(target.node as RaidNode).season}`;

    const imgUrl = target.type === "character"
        ? `/images/profile/${targetName.startsWith('우로스(') ? '우로스' : targetName}.webp`
        : `/images/boss/${targetName}${target?.node?.personality ? `(${target?.node?.personality})` : ''}.webp`;

    const personalityBorder = target?.node?.personality
        ? `border-${target.node.personality}-dark`
        : 'border-[oklch(0.262_0.094_270.913)] dark:border-[oklch(0.35_0.094_270.913)]';

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
                    className={`z-50 p-2 bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-xl border border-zinc-300 dark:text-zinc-200 bg-opacity-95`}>

                    <div className="flex flex-col gap-y-2">
                        <div className="flex justify-center items-center gap-x-2">
                            <Link
                                to={detailPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`overflow-hidden rounded-full w-14 h-14 border-4 ${personalityBorder}`}>
                                <img
                                    src={imgUrl}
                                    className={`${target.type === "raid" && 'scale-[1.5] origin-[50%_20%]'}`}
                                />
                            </Link>
                            <div className="flex flex-col gap-y-1 justify-center">
                                <span className="font-bold text-[14px]">
                                    {targetName}
                                </span>
                                {target.type === 'character' ? (
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
                                ) : target.type === "raid" ? (
                                    <div className="flex gap-x-1 items-center">
                                        {target.node.personality && (
                                            <img
                                                className="w-4 h-4"
                                                src={`/images/personality/${target.node.personality}.webp`}
                                            />
                                        )}
                                        <span className="text-[12px]">
                                            {Number(target.node.season) > 10000 ? `베타 시즌${Number(target.node.season) - 10000}` : `시즌${target.node.season}`}
                                        </span>
                                    </div>
                                ) : (<></>)}
                            </div>

                        </div>
                        {target.type === 'character' ? (
                            <CharacterDetails targetName={targetName} />
                        ) : target.type === 'raid' ? (
                            <RaidDetails node={target?.node} />
                        ) : (
                            <></>
                        )}
                    </div>

                </Popper.Content>
            </Portal>
        </Popper.Root >
    );
};

export default PopoverCard;