import { charInfo } from "../../data/trickcalChar";

const CharacterIcon = ({
    name,
    type,
    size
}: {
    name: string,
    type?: 'small' | 'mini' | 'micro',
    size?: number
}) => {

    const personality = charInfo[name].personality;

    const iconConfig = type === 'small'
        ? `aspect-[3/4] w-[60px] h-[80px] flex flex-col justify-center items-center ${personality === '공명' ? 'resonance-pers' : `bg-${personality}`}`
        : type === 'mini'
            ? `w-[45px] z-20 h-[60px] border border-black flex flex-col justify-center items-center ${personality === '공명' ? 'resonance-pers' : `bg-${personality}`}`
            : type === 'micro'
                ? `w-[30px] z-20 h-[30px] border border-black flex flex-col justify-center items-center ${personality === '공명' ? 'resonance-pers' : `bg-${personality}`}`
                : `aspect-[3/4] w-[90px] h-[120px] flex flex-col justify-center items-center ${personality === '공명' ? 'resonance-pers' : `bg-${personality}`}`;

    const nameConfig = type === 'small'
        ? "bg-white bg-opacity-80 font-bold w-full px-[2px] py-[2px] truncate text-[12px] z-10 flex items-center justify-center"
        : type === 'mini'
            ? "bg-white bg-opacity-80 font-bold w-full px-[2px] py-1 truncate text-[12px] z-10 flex items-center justify-center"
            : type === 'micro'
                ? "hidden"
                : "bg-white bg-opacity-80 font-bold w-full px-2 py-1 truncate text-[13px] z-10 flex items-center justify-center";

    const imgURL = (name: string) => {

        const charName = name.startsWith('우로스')
            ? '우로스'
            : name;

        return type === 'small'
            ? `/images/character/${charName}.webp`
            : `/images/profile/${charName}.webp`
    }

    return (
        <div
            data-tooltip-id="my-tooltip"
            data-tooltip-content={name}
            className={iconConfig}>
            <img
                className={`h-full ${type === 'micro' ? 'object-cover' : 'object-contain'}`}
                src={imgURL(name)}
                decoding="async" />
            <div className={nameConfig}>
                <span className="truncate">
                    {name.startsWith('우로스') ? '우로스' : name}
                </span>
            </div>
        </div>
    );
}

export default CharacterIcon;