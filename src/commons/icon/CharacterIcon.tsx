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
        ? `aspect-[3/4] w-[60px] h-[80px]`
        : type === 'mini'
            ? `w-[52px] z-20 h-[60px] border border-black`
            : type === 'micro'
                ? `w-[30px] z-20 h-[30px] border border-black`
                : `aspect-[3/4] w-[90px] h-[120px]`;

    const nameConfig = type === 'small'
        ? "px-[2px] py-[2px] text-[12px]"
        : type === 'mini'
            ? "px-[2px] text-[11px] min-h-[16px]"
            : type === 'micro'
                ? "hidden"
                : "px-2 py-1 text-[12px]";

    const imgURL = (name: string) => {

        const charName = name.startsWith('우로스')
            ? '우로스'
            : name;

        return type === 'micro'
            ? `/images/profile/${charName}.webp`
            : `/images/character/${charName}.webp`
    }

    return (
        <div
            data-tooltip-id="my-tooltip"
            data-tooltip-content={name}
            className={`${iconConfig}  flex flex-col justify-center items-center ${personality === '공명' ? 'resonance-pers' : `bg-${personality}`}`}>
            <div
                className={`overflow-hidden`}
            >
                <img
                    className={`${type === 'mini' ? 'w-full object-cover object-top origin-[50%_20%] scale-[1.4]' : 'w-full'} ${type === 'micro' ? 'object-cover' : 'object-contain'}`}
                    src={imgURL(name)}
                    decoding="async" />
            </div>
            <div className={`${nameConfig} bg-white bg-opacity-80 font-bold w-full z-10 flex items-center justify-center`}>
                <span className="truncate">
                    {name.startsWith('우로스') ? '우로스' : name}
                </span>
            </div>
        </div>
    );
}

export default CharacterIcon;