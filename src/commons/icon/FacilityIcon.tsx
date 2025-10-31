import { facilities } from "../../data/facilities";
import { useTheme } from "../../hooks/useTheme";
import { translateFacility } from "../../utils/function";



const facilitySet = new Set([...Object.keys(facilities).map(k => k)])

const FacilityIcon = ({ name, size, value }: { name: string, size?: number, value?: number }) => {
    const { theme } = useTheme();

    // 흰색 그림자 (라이트 모드용)
    const lightTextShadow = '0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255)';

    // 검은색 그림자 (다크 모드용)
    const darkTextShadow = '0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0), 0px 0px 1.2px rgb(0, 0, 0)';


    const krName = translateFacility(name);
    if (!krName || !facilitySet.has(krName)) return null;

    // const facilityData = facilities[krName];
    // if (!facilityData) return null;

    // const facilInfo = facilityData[value];
    // if (!facilInfo) return null;


    return (
        <div
            className="relative rounded-md overflow-hidden bg-center bg-no-repeat bg-contain flex justify-center text-black"
            style={{
                width: size || 80,
                height: size || 80,
            }}
        >

            <img
                className="w-[70%] h-[70%] object-contain"
                src={`/images/facility/${name}.png`} />

            <div
                style={{
                    textShadow: theme === 'dark' ? darkTextShadow : lightTextShadow
                }}
                className="absolute font-bold bottom-4 select-none text-[15px] dark:text-zinc-100">
                {krName}
            </div>
            {value && (
                <div
                    style={{
                        textShadow: theme === 'dark' ? darkTextShadow : lightTextShadow
                    }}
                    className="absolute font-bold bottom-1 select-none text-[14px] dark:text-zinc-100">
                    Lv.{value}
                </div>
            )}
        </div >
    );
}

export default FacilityIcon;