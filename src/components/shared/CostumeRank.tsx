import React, { useState } from "react";
import { ClashSeasonData } from "../../types/clashTypes";
import { ClashV2SeasonData } from "../../types/clashV2Types";
import { FrontierSeasonData } from "../../types/frontierTypes";
import { CostumeStat, processCostumeData, ProcessedCostumeData } from "../../utils/costumeFunction";
import SlideColorNav from "../../commons/animation/SlideColorNav";

const CostumeRank = (
    {
        data, type
    }:
        {
            data: ClashSeasonData | FrontierSeasonData | ClashV2SeasonData,
            type?: 'side'
        }
) => {

    const [category, setCategory] = useState<'all' | 'pretty' | 'normal'>('all')
    const cosRankData: ProcessedCostumeData = processCostumeData(data, type)
    // console.log(cosRankData)

    const boardText = ['사용 횟수', '사용률', '출시일'];
    const tabs = [
        { id: 'all', label: '전체' },
        { id: 'pretty', label: '꼬까옷' },
        { id: 'normal', label: '일반' },
    ] as const;

    return (
        <div
            className="lg:w-[992px] dark:text-zinc-200 w-full mx-auto flex flex-col bg-white dark:bg-zinc-900 py-4 shadow-md overflow-x-auto gap-y-3">
            <span className="font-bold text-xl ml-4">인기 사복</span>
            <div className="ml-4 mb-4">
                <SlideColorNav
                    color="text-black dark:text-zinc-200"
                    size={16}
                    handler={(p) => setCategory(p as 'all' | 'pretty' | 'normal')}
                    tabs={tabs}
                />
            </div>
            <div className="mx-auto flex md:justify-center justify-start w-full gap-x-5">
                {cosRankData[category].map((cos, i) => (
                    <div
                        key={cos?.charName + '_' + cos?.cosName || i}
                        className="px-4 relative mt-2"
                    >
                        <div
                            className={`w-[220px] ${rankBorderShadow(i)} border-2`}>
                            {/* 사도 사복 컷 */}
                            <div className={`overflow-hidden min-h-[185px] min-w-[216px] ${rankBG(i)}`}>
                                <div className="select-none ml-[108px] w-full animate-bounce-in" key={cos?.cosName}>
                                    <img
                                        className={`object-cover w-[130%] scale-125`}
                                        alt={cos?.cosName}
                                        src={`/images/costume/${cos?.charName}_${cos?.cosName}.webp`.replace(/ /g, '_')}
                                    />
                                </div>
                            </div>
                            {/* 왕관 */}
                            <img
                                className="absolute top-[-26px] left-[13px] w-[32px]"
                                alt={String(i)}
                                src={`/images/ui/crown${i + 1}.webp`}
                            />
                            <div className="max-w-[220px]">
                                <span className="font-bold block text-center mt-2 truncate">
                                    {cos.lvl === 'pretty'
                                        ? `${cos.cosName} ${cos.charName} ★`
                                        : `${cos.cosName} ${cos.charName}`}
                                </span>
                            </div>
                            {/* 사복 설명 */}
                            <div className="flex flex-col items-center justify-center text-[13px] gap-y-[2px] p-2">
                                {boardText.map(t => {

                                    return (
                                        <div
                                            key={`costume_rank_board_` + t}
                                            className="flex justify-between w-[70%]">
                                            <span className="w-[40%] text-gray-500 dark:text-zinc-400">
                                                {t}
                                            </span>
                                            <div className="w-[60%]">
                                                {boardValue(t, cos)}
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className="flex flex-col">

                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function boardValue(key: string, cos: CostumeStat) {
    switch (key) {
        case '사용 횟수':
            return (
                <>
                    <span>
                        {cos?.cosUsedCount}
                    </span>
                    <span className="text-gray-500 dark:text-zinc-400">
                        /{cos?.charTotalCount}
                    </span>
                </>
            );
        case '사용률':
            return `${cos?.rate}%`;
        case '출시일':
            return cos?.launchDate;
    }
}

function rankBG(rank: number) {
    switch (rank) {
        case 0:
            return 'bg-gradient-to-b from-[rgba(254,201,39,0.5)] to-[rgba(254,201,39,1)]'
        case 1:
            return 'bg-gradient-to-b from-[rgba(209,229,236,0.2)] to-[rgba(214,234,242,1)]'
        case 2:
            return 'bg-gradient-to-b from-[rgba(193,175,129,0.5)] to-[rgba(193,175,129,1)]'
    }
}

function rankBorderShadow(rank: number) {
    switch (rank) {
        case 0:
            return 'border-[rgb(254,201,39)] shadow-[4px_4px_0_0_rgba(254,201,39,0.2)]'
        case 1:
            return 'border-[rgb(209,229,236)] shadow-[4px_4px_0_0_rgba(209,229,236,0.2)]'
        case 2:
            return 'border-[rgb(193,175,129)] shadow-[4px_4px_0_0_rgba(193,175,129,0.2)]'
    }
}




export default React.memo(CostumeRank);