import PersonalityIcon from "../../commons/PersonalityIcon";

const InfoComponent = ({ name, grade, startDate, endDate, rules, raidType, personality }:
    { name: string, grade: number | string, startDate: string, endDate: string, rules: string[], raidType: string, personality?: string }
) => {
    return (
        <div className="">
            <div className="flex items-center mb-3">
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