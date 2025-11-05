import React from "react";
import { translateRaces } from "../../utils/function";
import { Race } from "../../types/trickcalTypes";
import { useTheme } from "../../hooks/useTheme";

const ItemIcon = ({
    name,
    size,
    grayscale,
    opacity
}: {
    name: Race,
    size?: number,
    grayscale?: boolean,
    opacity?: number
}) => {

    if (!name) return null;

    const { theme } = useTheme();

    const translateRace = translateRaces(name)

    const shadow = theme === 'dark'
        ? '0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0)'
        : '0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255)';


    return (
        <div
            className={`relative rounded-md overflow-hidden bg-center bg-no-repeat bg-contain flex items-center justify-center ${grayscale ? 'grayscale' : ''}`}
            style={{
                width: size || 60,
                height: size || 60,
                opacity: opacity || 1
            }}
        >
            <img
                className="w-[55%] h-[55%] aspect-square object-contain pb-1 select-none"
                src={`/images/race/${translateRace}.png`} />

            <div
                style={{
                    textShadow: shadow
                }}
                className="absolute font-bold bottom-[6px] select-none text-[14px] text-black dark:text-zinc-200">
                {name}
            </div>
        </div>
    );
}

export default React.memo(ItemIcon);