import { RecentSkin } from '../../types/character/characterStatsTypes';
import { rankBG, rankBorderShadow } from '../../utils/style/styleFuntions';
import { boardValue } from '../shared/CostumeRank';

const CharacterRecentSkin = ({ recentSkin, charName }: { recentSkin: RecentSkin[], charName: string }) => {

    const boardText = ['사용 횟수', '사용률', '출시일'];

    return (
        <div className="flex flex-col gap-y-4 rounded-xl w-full min-h-[270px] border border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
            <div className="flex flex-col">
                <span className="text-[18px] font-bold dark:text-zinc-200">사복 통계</span>
                <span className="text-[12px] dark:text-zinc-400 text-gray-600">
                    컨텐츠 별 3개 시즌의 사복 통계를 제공합니다.
                </span>
            </div>
            <div className="mx-auto flex lg:flex-col flex-row justify-center w-full lg:gap-y-5 gap-x-4">
                {recentSkin.length > 0 ? recentSkin.map((cos: RecentSkin, i) => (
                    <div
                        className={`${rankBorderShadow(i)} border-2 flex flex-col lg:w-full w-[30%]`}
                        key={`recent_skin_rank_${cos.cosName}`}>
                        <div
                            className={`w-full ${rankBorderShadow(i)} border-2`}>
                            {/* 사도 사복 컷 */}
                            <div className={`overflow-hidden min-h-[30px] min-w-[216px] ${rankBG(i)}`}>
                            </div>
                            <div className="w-full">
                                <span className="font-bold block text-center mt-2 truncate">
                                    {cos.lvl === 'pretty'
                                        ? `${cos.cosName} ${charName} ★`
                                        : `${cos.cosName} ${charName}`}
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