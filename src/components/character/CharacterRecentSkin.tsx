import React from 'react'
import { RecentSkin } from '../../types/character/characterStatsTypes';
import { rankBG, rankBorderShadow } from '../../utils/style/styleFuntions';
import { costumes } from '../../data/costumes';

const CharacterRecentSkin = ({ recentSkin }: { recentSkin: RecentSkin[] }) => {


    return (
        <div className="flex flex-col gap-y-4 rounded-xl w-full min-h-[270px] border border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
            <div className="flex flex-col">
                <span className="text-[18px] font-bold dark:text-zinc-200">사복 통계</span>
                <span className="text-[12px] dark:text-zinc-400 text-gray-600">
                    컨텐츠 별 3개 시즌의 사복 통계를 제공합니다.
                </span>
            </div>
            <div className="flex-1 gap-y-3 flex flex-col">
                {recentSkin.length > 0 ? recentSkin.map((skin: RecentSkin, i) => (
                    <div
                        className={`relative ${rankBorderShadow(i)} border-2 `}
                        key={`recent_skin_rank_${skin.skinName}`}>
                        <div className={`flex items-center w-full h-[80px] p-2 ${rankBG(i)}`}>
                            <div className="bg-white dark:bg-zinc-900 w-full p-2 pl-4 flex flex-col gap-2 rounded-[50px] shadow-inner dark:shadow-zinc-950 shadow-zinc-400 overflow-hidden">
                                <span className="font-bold truncate w-full text-[14px] dark:text-zinc-200">
                                    {`${skin.skinName}${costumes.find(cos => cos.cosName === skin.skinName)?.lvl === 'pretty' ? ' ★' : ''}`}
                                </span>
                                <div className="flex gap-2 text-[12px]">
                                    <span className="w-[40%] max-w-[120px] text-gray-500 dark:text-zinc-400">
                                        사용 횟수
                                    </span>
                                    <div className="w-[60%] dark:text-zinc-200">
                                        {skin.count}회
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
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