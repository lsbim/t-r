import BossProfile from "../../commons/icon/BossProfile";
import PersonalityIcon from "../../commons/icon/PersonalityIcon";
import { Personality } from "../../types/trickcalTypes";

const InfoComponent = ({ name, grade, startDate, endDate, rules, raidType, personality }:
    { name: string, grade: number | string, startDate: string, endDate: string, rules: string[], raidType: string, personality?: Personality }
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
                <div className="flex-col">
                    <div className="text-[12px] text-orange-500 font-bold">
                        최고단계
                    </div>
                    <span className=" text-[15px]">
                        {grade}단계
                    </span>
                </div>
            </div>
            <div className="flex-col">
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
            </div>
        </div>
    );
}

export default InfoComponent;