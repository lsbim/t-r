import BossProfile from "../../../../components/icons/BossProfile";
import PersonalityIcon from "../../../../components/icons/PersonalityIcon";
import { Personality } from "../../../../types/trickcalTypes";
import type { DeepPower } from "../../deepClash/deepPower";

const InfoComponent = ({ name, grade, startDate, endDate, rules, powers, raidType, personality }:
    { name: string, grade?: number | string, startDate: string, endDate: string, rules?: string[], powers?: DeepPower[], raidType: string, personality?: Personality }
) => {

    return (
        <div className="min-w-[320px]">
            <div className="relative flex items-center justify-between mb-3">
                <div className="absolute top-0 left-0 flex items-center z-20">
                    <span className="text-[20px] font-bold mr-2">{name}</span>
                    {personality && (
                        <div
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={personality}
                            className={`w-[28px] text-[13px] font-bold text-${personality} whitespace-nowrap cursor-pointer`}>
                            <PersonalityIcon personality={personality} size={24} />
                        </div>
                    )}
                </div>
                <BossProfile
                    name={name}
                    personality={personality}
                />
            </div>
            <div className="flex gap-x-4 items-center mb-2">
                <div className="flex-col">
                    <div className="text-[12px] text-orange-500 font-bold">
                        기간
                    </div>
                    <span className="text-[15px]">{startDate} ~ {endDate}</span>
                </div>
                {grade !== undefined && <div className="flex-col">
                    <div className="text-[12px] text-orange-500 font-bold">
                        최고단계
                    </div>
                    <span className=" text-[15px]">
                        {grade}단계
                    </span>
                </div>}
            </div>
            {rules && rules.length > 0 && <div className="flex-col">
                <div className="text-[12px] text-orange-500 font-bold">
                    {raidType === "clash" ? (<>규칙</>) : (<>교주의 권능</>)}
                </div>
                <div className="flex-col gap-y-2 text-[14px]">
                    {rules.map(rule => (
                        <div
                            key={raidType + 'inforule' + rule}
                            className="text-[14px]">{rule}
                        </div>
                    ))}
                </div>
            </div>}
            {powers?.map(power => (
                <div key={`${raidType}-power-${power.name}`}>
                    <div className="text-[12px] text-orange-500 font-bold">{power.name}</div>
                    <div className="whitespace-pre-line text-[13px]">{power.description}</div>
                </div>
            ))}
        </div>
    );
}

export default InfoComponent;
