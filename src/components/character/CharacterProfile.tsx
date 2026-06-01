import React from 'react'
import { charInfo } from '../../data/trickcalChar';
import { translateLine, translateRaces } from '../../utils/function';
import { AllLine, Race } from '../../types/trickcalTypes';

const CharacterProfile = ({ charName }: { charName: string }) => {
    return (
        <div className="flex gap-x-2">
            <div
                className={`flex items-center justify-center rounded-xl border transition-colors duration-200 border-zinc-300 dark:border-zinc-700 overflow-hidden hover:border-${charInfo[charName].personality} hover:dark:border-${charInfo[charName].personality} cursor-pointer group`}
            >
                <img
                    src={`/images/character/${charName}.webp`}
                    alt={charName}
                    className="h-[200px] object-cover group-hover:scale-105 group-hover:rotate-3 duration-300 transition-transform ease-out"
                />
            </div>
            <div className="flex flex-col gap-y-2 items-start justify-end mb-2">
                <span className={`text-[18px] font-bold text-${charInfo[charName].personality}-dark cursor-default`}>
                    {charName}
                </span>
                <div className="flex gap-x-2 items-center">
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={charInfo[charName].personality}
                        className="cursor-pointer w-[28px] h-[28px] "
                    >
                        <img
                            src={`/images/personality/${charInfo[charName].personality}.webp`}
                            alt={charInfo[charName].personality}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={charInfo[charName].race}
                        className="cursor-pointer w-[28px] h-[28px] "
                    >
                        <img
                            src={`/images/race/${translateRaces(charInfo[charName].race as Race)}.webp`}
                            alt={charInfo[charName].race}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={charInfo[charName].line}
                        className="cursor-pointer w-[28px] h-[28px] "
                    >
                        <img
                            src={`/images/line/${translateLine(charInfo[charName].line as AllLine)}.webp`}
                            alt={charInfo[charName].line}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div>
                    <div className="flex flex-col">
                        <span className="text-[11px] text-gray-600 dark:text-zinc-400">
                            출시일
                        </span>
                        <span className="text-[13px] font-bold text-gray-800 dark:text-zinc-200">
                            {charInfo[charName].birthdate}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CharacterProfile