import { costumes } from '@/data/costumes';
import { useMemo } from 'react';
import { boardValue } from '../../../components/CostumeRank';
import { containerDarkBG } from '../../../styles/container';
import { RecentSkin } from '../../../types/character/characterStatsTypes';

const skinColors = [
    '#F28E2B', // Orange
    '#76B7B2', // Teal
    '#E15759', // Red
    '#59A14F', // Green
    '#EDC948', // Yellow
    '#B07AA1', // Purple
    '#FF9DA7', // Pink
    '#9C755F', // Brown
] as const;

const etcColor = '#888888' // Grey

const CharacterRecentSkin = ({ recentSkin, charName }: { recentSkin: RecentSkin[], charName: string }) => {

    const skinIndexByName = useMemo(() => {
        const sortedCostumes = costumes
            .filter(cos => cos.charName === charName)
            .sort((a, b) =>
                a.launchDate.localeCompare(b.launchDate) ||
                a.cosName.localeCompare(b.cosName, 'ko')
            );

        return new Map(
            sortedCostumes.map((cos, index) => [cos.cosName, index])
        );
    }, [charName]);

    const getSkinColor = (cosName: string) => {
        const index = skinIndexByName.get(cosName);

        return index === undefined
            ? etcColor
            : skinColors[index] ?? etcColor;
    };

    const charTotalCount = recentSkin[0]?.charTotalCount ?? 0;

    const usedSkinCount = recentSkin.reduce((sum, cos) => sum + cos.cosUsedCount
        , 0);

    const unwornCount = Math.max(0, charTotalCount - usedSkinCount);

    const unwornRate = charTotalCount > 0
        ? Math.round((unwornCount / charTotalCount) * 1000) / 10
        : 0;

    const boardText = ['사용 횟수', '사용률', '출시일'];

    return (
        <div className={`flex flex-col gap-y-4 rounded-xl w-full min-h-[270px] border border-zinc-300 ${containerDarkBG} dark:border-zinc-700 p-4`}>
            <div className="flex flex-col">
                <span className="text-[18px] font-bold dark:text-zinc-200">사복 통계</span>
                <span className="text-[12px] dark:text-zinc-400 text-gray-600">
                    콘텐츠 별 3개 시즌의 사복 통계를 제공합니다.
                </span>
            </div>
            <div className="mx-auto flex lg:flex-col flex-row w-full lg:gap-y-5 gap-x-4 p-2 overflow-x-auto lg:overflow-x-hidden">
                {recentSkin.length > 0 ? (
                    <div className='w-full gap-y-3 flex flex-col'>
                        {/* 스택바 */}
                        <div className='w-full flex justify-center overflow-hidden rounded-md h-6 gap-x-[1px] text-[13px] mb-2'>
                            {recentSkin.map((cos: RecentSkin) => (
                                <div
                                    key={cos.cosName}
                                    className={`flex items-center justify-center overflow-hidden cursor-pointer`}
                                    style={{
                                        flexGrow: cos.rate,
                                        flexShrink: 1,
                                        flexBasis: 0,
                                        backgroundColor: getSkinColor(cos.cosName),
                                    }}
                                    title={`${cos.cosName} ${cos.rate.toFixed(1)}%`}
                                >
                                    <span className="whitespace-nowrap">
                                        {cos.rate > 10 && `${Math.round(cos.rate)}%`}
                                    </span>
                                </div>
                            ))}
                            {unwornRate > 0 && (
                                <div
                                    key="skin-unworn"
                                    className="flex items-center justify-center overflow-hidden cursor-pointer"
                                    style={{
                                        flexGrow: unwornRate,
                                        flexShrink: 1,
                                        flexBasis: 0,
                                        backgroundColor: etcColor,
                                    }}
                                    title={`사복 미착용 ${unwornRate.toFixed(1)}%`}
                                >
                                    <span className="whitespace-nowrap">
                                        {unwornRate > 10 && `${Math.round(unwornRate)}%`}
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* 사복 순위 */}
                        {recentSkin.map((cos: RecentSkin, i) => (
                            <div
                                className={`flex flex-col lg:w-full w-[30%] min-w-[240px]`}
                                key={`recent_skin_rank_${cos.cosName}`}>
                                <div
                                    className={`w-full items-center justify-center`}>
                                    {/* 사복 명(왕관 포함) */}
                                    <div className="w-full dark:text-zinc-200 flex items-center mt-2">
                                        {i < 3 && (
                                            <img
                                                className="w-[24px] aspect-square object-contain mr-2"
                                                alt={String(i)}
                                                src={`/images/ui/crown${i + 1}.webp`}
                                            />
                                        )}
                                        <div className="font-bold block truncate relative z-10">
                                            {cos.cosName} {charName}{cos.lvl === 'pretty' && '★'}
                                            <div
                                                className='absolute w-full h-1/3 bottom-0 z-[-10]'
                                                style={{
                                                    backgroundColor: getSkinColor(cos.cosName),
                                                    opacity: 0.4
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* 사복 설명 */}
                                    <div className="flex flex-col text-[13px] gap-y-[2px] pt-1 px-1">
                                        {boardText.map(t => {

                                            return (
                                                <div
                                                    key={`costume_rank_board_` + t}
                                                    className="flex justify-between w-[70%]">
                                                    <span className="w-[40%] text-gray-500 dark:text-zinc-400">
                                                        {t}
                                                    </span>
                                                    <div className="w-[60%] dark:text-zinc-200">
                                                        {boardValue(t, cos)}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {unwornRate > 0 && (
                            <div
                                className={`flex flex-col lg:w-full w-[30%] min-w-[240px]`}
                            >
                                <div
                                    className={`w-full items-center justify-center`}>
                                    <div className="w-full dark:text-zinc-200 flex items-center mt-2">
                                        <div className="font-bold block truncate relative z-10">
                                            사복 미착용
                                            <div
                                                className='absolute w-full h-1/3 bottom-0 z-[-10]'
                                                style={{
                                                    backgroundColor: etcColor,
                                                    opacity: 0.4
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* 사복 설명 */}
                                    <div className="flex flex-col text-[13px] gap-y-[2px] pt-1 px-1">
                                        <div
                                            className="flex flex-col">
                                            <div className='flex justify-between w-[70%]'>
                                                <span className="w-[40%] text-gray-500 dark:text-zinc-400">
                                                    횟수
                                                </span>
                                                <div className="w-[60%] dark:text-zinc-200">
                                                    <span>
                                                        {unwornCount}
                                                    </span>
                                                    <span className="text-gray-500 dark:text-zinc-400">
                                                        /{charTotalCount}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='flex justify-between w-[70%]'>
                                                <span className="w-[40%] text-gray-500 dark:text-zinc-400">
                                                    미사용률
                                                </span>
                                                <div className="w-[60%] dark:text-zinc-200">
                                                    <span>
                                                        {unwornRate}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className=" flex flex-col items-center justify-center select-none">
                        <img
                            src={`/images/action/yc_sad.webp`}
                            className="aspect-square object-center w-[100px] grayscale"
                        />
                        <span className="text-gray-700 dark:text-zinc-400 font-bold">
                            사복 기록이 없습니다.
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CharacterRecentSkin