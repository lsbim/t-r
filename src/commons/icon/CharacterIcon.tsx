import { charInfo } from "../../data/trickcalChar";

const CharacterIcon = ({ name, type }: { name: string, type?: 'mini' | 'micro' }) => {

    const personality = charInfo[name].personality;

    const iconConfig = type === 'mini'
        ? `aspect-[3/4] w-[60px] h-[80px] flex flex-col justify-center items-center ${personality === '공명' ? 'resonance-pers' : `bg-${personality}`}`
        : type === 'micro'
            ? `w-[30px] z-20 h-[30px] border border-black flex flex-col justify-center items-center ${personality === '공명' ? 'resonance-pers' : `bg-${personality}`}`
            : `aspect-[3/4] w-[90px] h-[120px] flex flex-col justify-center items-center ${personality === '공명' ? 'resonance-pers' : `bg-${personality}`}`;

    const nameConfig = type === 'mini'
        ? "bg-white bg-opacity-80 font-bold w-full px-[2px] py-[2px] truncate text-[12px] z-10 flex items-center justify-center"
        : type === 'micro'
            ? `hidden`
            : "bg-white bg-opacity-80 font-bold w-full px-2 py-1 truncate text-[13px] z-10 flex items-center justify-center";

    return (
        <div
            data-tooltip-id="my-tooltip"
            data-tooltip-content={name}
            className={iconConfig}>
            <img
                className={`h-full ${type === 'micro' ? 'object-cover' : 'object-contain'}`}
                src={`/images/character/${name.startsWith('우로스') ? '우로스' : name}.webp`}
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