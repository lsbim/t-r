import { charInfo } from '../../data/trickcalChar';
import { getCharacterIcons } from '../../utils/function';

const CharacterProfile = ({ charName }: { charName: string }) => {

    const namePersColor = charInfo[charName].personality === '공명'
        ? 'text-gray-700 dark:text-zinc-300'
        : `text-${charInfo[charName].personality}-dark`

    const character = charInfo[charName];

    // 성격,역할,공격타입,포지션,종족 아이콘 이미지
    const icons = getCharacterIcons(charName);

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
                <div className="flex md:gap-x-2 gap-x-1 items-center">
                    {icons.map(({ tooltip, src }) => (
                        <div
                            key={tooltip}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={tooltip}
                            className="cursor-pointer md:w-7 md:h-7 w-5 h-5"
                        >
                            <img
                                src={src}
                                alt={tooltip}
                                className="object-cover w-full h-full" />
                        </div>
                    ))}
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