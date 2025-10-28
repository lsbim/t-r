import React, { useMemo } from "react";
import PersonalityIcon from "../../commons/icon/PersonalityIcon";
import { charInfo } from "../../data/trickcalChar";
import { CharacterSeasonData } from "../../types/commonTypes";
import { translateRaid } from "../../utils/function";

const CharRaidSummary = ({
    data, seasonLength, type
}: {
    data: Record<string, CharacterSeasonData[]>, seasonLength: number, type: 'clash' | 'frontier'
}) => {

    return (
        <div className="bg-white lg:w-[1068px] w-full rounded-b-md shadow-lg max-w-full my-8">
            <div className="overflow-x-auto ">
                <div className="flex flex-col gap-2 min-w-max">
                    {data && Object.entries(data).map(([charName, charData], idx) => {

                        const seasonDataMap = useMemo(() =>
                            new Map(charData.map(d => [parseInt(d.season, 10), d])), [charData]);

                        return (
                            <div
                                className={`flex items-center p-4 ${idx % 2 === 0 ? '' : 'bg-gray-100'}`}
                                key={`${type}_character_summary_${charName}`}>
                                <div className="min-w-32 max-w-32 truncate flex items-center gap-x-2">
                                    <PersonalityIcon personality={charInfo[charName]?.personality} />
                                    <span className="min-w-[94px] max-w-[94px] font-bold truncate">
                                        {charName === '시온' ? '시온 더 다크불릿' : charName}
                                    </span>
                                </div>
                                <div className="gap-y-[2px] items-center flex">
                                    {Array.from({ length: seasonLength }, (_, idx) => {

                                        const idxSeason = seasonDataMap.get(idx + 1);

                                        const opacityValue = idxSeason ? idxSeason?.pickRate / 100 : 0;
                                        const backgroundColor = idxSeason ? `rgba(234, 88, 12, ${opacityValue})` : `rgb(210,210,210)`;
                                        const tooltip = `${translateRaid(type)} 시즌${idx + 1} ${charName === '시온' ? '시온 더 다크불릿' : charName} ${idxSeason?.pickRate ? `픽률 ${idxSeason?.pickRate}%` : '미출전/기록없음'}`

                                        return (
                                            <div
                                                data-tooltip-id="my-tooltip"
                                                data-tooltip-content={tooltip}
                                                style={{ backgroundColor }}
                                                className={`min-w-3 h-6 hover:shadow-md hover:shadow-black transition-shadow duration-100 border ${idxSeason ? ' border-orange-700' : 'border-black'} ${idx > 0 && 'ml-[-1px]'}`}
                                                key={`${type}_${idx + 1}season_${charName}_data`} />
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    );
}

export default CharRaidSummary;