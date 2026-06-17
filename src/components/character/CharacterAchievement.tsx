import React from 'react'
import { ContentTopSeasons, TopSeasonStat } from '../../types/character/characterStatsTypes';
import { keyBy } from 'es-toolkit';
import { translateRaid } from '../../utils/function';
import { useTheme } from '../../hooks/useTheme';
import { Link } from 'react-router-dom';

const CharacterAchievement = ({ topSeasons }: { topSeasons: ContentTopSeasons }) => {

    const { theme } = useTheme();
    const hasTopSeasons = topSeasons.clash.length > 0 || topSeasons.clashV2.length > 0 || topSeasons.frontier.length > 0;

    const shadow = theme === 'dark'
        ? '0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0)'
        : '0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255)';

    return (
        // self-start는 부모 크기에 영향받지 않음
        <div className="flex flex-col self-start gap-y-4 rounded-xl w-full min-h-[310px] border border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
            <span className="font-bold dark:text-zinc-200 text-[18px]">
                위업
            </span>
            {hasTopSeasons ? (
                <div className="flex flex-col gap-y-3">
                    {Object.entries(topSeasons).map(([key, value], index) => {

                        // console.log(value)
                        if (value.length < 1) return;

                        return (
                            <div
                                key={`character_achievement_${key}_${index}`}
                                className="flex flex-col gap-y-2"
                            >
                                <span className="text-gray-600 text-[13px] dark:text-zinc-400">
                                    {`${translateRaid(key)} (${value.length})`}
                                </span>
                                {/* 시즌별 아이콘 */}
                                <div className="w-full flex flex-wrap gap-2">
                                    {value.map((season: TopSeasonStat) => {

                                        const borderColor = season.personality
                                            ? `border-${season.personality}-dark`
                                            : 'border-[oklch(0.5_0.094_270.913)]'

                                        const raidUrl = key === 'clashV2' ? `/clash/v2/${season.seasonNumber}` : `/${key}/${season.seasonNumber}`;

                                        const seasonNum = season.seasonNumber > 10000 ? `B${(season.seasonNumber - 10000)}` : season.seasonNumber

                                        return (
                                            <Link
                                                data-tooltip-id="my-tooltip"
                                                data-tooltip-content={`시즌${season.seasonNumber > 10000 ? `B${season.seasonNumber - 10000}` : season.seasonNumber} ${season.name}`}
                                                to={raidUrl}
                                                key={`${key}_${season.seasonNumber}`}
                                                className="relative select-none rounded-2xl"
                                            >
                                                <div
                                                    className={`overflow-hidden w-[48px] h-[48px] rounded-full z-20 border-[7px] bg-black/10 dark:bg-zinc-950 ${borderColor}`}
                                                >
                                                    <img
                                                        src={`/images/boss/${season.name}${season.personality ? `(${season.personality})` : ''}.webp`}
                                                        className="w-full h-full object-cover object-center transform-gpu scale-[1.5]" />
                                                </div>
                                                <span
                                                    className="font-bold absolute bottom-[0px] right-[0px] text-[16px] z-30 dark:text-zinc-200"
                                                    style={{
                                                        textShadow: shadow
                                                    }}>
                                                    {seasonNum}
                                                </span>
                                                {season.contentType && (
                                                    <div
                                                        className={`absolute flex items-center justify-center top-[-1px] text-[13px] dark:text-zinc-200 font-bold rounded-full w-3 h-3 ${sideContentBG(season.contentType)} ${xPositionSideContent(season.contentType)}`}>
                                                    </div>
                                                )}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className=" flex flex-col items-center justify-center select-none">
                    <img
                        src={`/images/action/yc_sad.webp`}
                        className="aspect-square object-center w-[100px] grayscale"
                    />
                    <span className="text-gray-700 dark:text-zinc-400 font-bold">
                        1위 기록이 없습니다.
                    </span>
                </div>
            )}
        </div>
    )

}

function sideContentBG(content: 'main' | 'side') {
    return content === 'side'
        ? 'bg-[rgba(224,115,6,0.8)]'
        : 'bg-[rgba(16,117,53,0.8)]';
}

function xPositionSideContent(content: 'main' | 'side') {
    return content === 'side'
        ? 'left-[-1px]'
        : 'right-[-1px]';
}

export default CharacterAchievement