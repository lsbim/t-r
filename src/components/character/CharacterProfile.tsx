import { charInfo } from '../../data/trickcalChar';
import { AllLine, Race } from '../../types/trickcalTypes';
import { translateAttackType, translateLine, translateRaces, translateRole } from '../../utils/function';

const CharacterProfile = ({ charName }: { charName: string }) => {

    const namePersColor = charInfo[charName].personality === '공명'
        ? 'text-gray-700 dark:text-zinc-300'
        : `text-${charInfo[charName].personality}-dark`

    return (
        <div className="flex gap-x-2">
            {/* 사도 사진 */}
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
                {/* 사도명 */}
                <span className={`text-[18px] font-bold cursor-default ${namePersColor}`}>
                    {charName}
                </span>
                {/* 아이콘 */}
                <div className="flex gap-x-2 items-center">
                    {/* 성격 */}
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
                    {/* 역할 */}
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={charInfo[charName].role}
                        className="cursor-pointer w-[28px] h-[28px] "
                    >
                        <img
                            src={`/images/role/${translateRole(charInfo[charName].role)}.webp`}
                            alt={charInfo[charName].role}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    {/* 타입 */}
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={charInfo[charName].attackType}
                        className="cursor-pointer w-[28px] h-[28px] "
                    >
                        <img
                            src={`/images/role/${translateAttackType(charInfo[charName].attackType)}.webp`}
                            alt={charInfo[charName].attackType}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    {/* 열 */}
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
                    {/* 종족 */}
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