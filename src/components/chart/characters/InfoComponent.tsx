import PersonalityIcon from "../../../commons/icon/PersonalityIcon";
import { charInfo } from "../../../data/trickcalChar";

const InfoComponent = ({ name }: { name: string }) => {

    const charInfoData = charInfo[name];

    return (
        <div className="flex">
            <img
                className="h-[100px] object-center mr-2 ml-[-10px]"
                src={`/images/character/${name}.webp`}
                decoding="async" />
            <div className="flex flex-col justify-between">
                <div className="flex items-center gap-x-1">
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={charInfoData.personality}
                        className={`w-[28px] text-[13px] font-bold text-${charInfoData.personality} whitespace-nowrap cursor-pointer`}>
                        <PersonalityIcon personality={charInfoData.personality} size={24} />
                    </div>
                    <span className="text-[20px] font-bold">{name}</span>
                </div>
                <div className="flex gap-x-4 items-center">
                    <div className="flex-col">
                        <div className="text-[12px] text-orange-500 font-bold">
                            등급
                        </div>
                        <span className="text-[15px]">{charInfoData.grade}성</span>
                    </div>
                    <div className="flex-col">
                        <div className="text-[12px] text-orange-500 font-bold">
                            배치
                        </div>
                        <span className="text-[15px]">{charInfoData.line}</span>
                    </div>
                    <div className="flex-col">
                        <div className="text-[12px] text-orange-500 font-bold">
                            출시일
                        </div>
                        <span className="text-[15px]">{charInfoData.birthdate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoComponent;