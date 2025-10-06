import { facilities } from "../../data/facilities";
import { translateFacility } from "../../utils/function";



const facilitySet = new Set([...Object.keys(facilities).map(k => k)])

const FacilityIcon = ({ name, size, value }: { name: string, size?: number, value?: number }) => {

    const krName = translateFacility(name);
    if (!krName || !facilitySet.has(krName)) return null;

    // const facilityData = facilities[krName];
    // if (!facilityData) return null;

    // const facilInfo = facilityData[value];
    // if (!facilInfo) return null;


    return (
        <div
            className="relative rounded-md overflow-hidden bg-center bg-no-repeat bg-contain flex justify-center"
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
                    textShadow: '0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255)'
                }}
                className="absolute font-bold bottom-5 select-none text-[15px]">
                {krName}
            </div>
            {value && (
                <div
                    style={{
                        textShadow: '0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255)'
                    }}
                    className="absolute font-bold bottom-1 select-none text-[14px]">
                    Lv.{value}
                </div>
            )}
        </div >
    );
}

export default FacilityIcon;