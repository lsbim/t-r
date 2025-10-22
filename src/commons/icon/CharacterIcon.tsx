import { charInfo } from "../../data/trickcalChar";
import { getPersonalityColor } from "../../types/trickcalTypes";

const CharacterIcon = ({ name }: { name: string }) => {

    const personality = charInfo[name].personality;

    return (
        <div className={`relative aspect-[3/4] w-[90px] h-[120px] flex flex-col justify-center items-center ${personality === '공명' ? 'resonance-pers' : `bg-${personality}`}`}>
            <img
                className="object-cover h-full "
                src={`/images/character/${name}.webp`}
                decoding="async" />
            <div className="absolute bottom-0 bg-white bg-opacity-80 font-bold w-full p-2 truncate text-[14px] z-10 flex items-center justify-center">
                {name}
            </div>
        </div>
    );
}

export default CharacterIcon;