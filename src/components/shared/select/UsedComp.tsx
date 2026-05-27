import React from 'react'
import { findPersonalityByName } from '../../../utils/function';
import InfoIcon from '../../../commons/icon/InfoIcon';

const UsedComp = ({ statsForSelect }: { statsForSelect: any }) => {
    return (
        <div className="w-[33%] flex flex-col justify-center">
            {/* gap-y-2(8px) + mb-2(8px)로 얘만 mb-2고, 나머지는 mb-4(16px)로 설정 */}
            <div className="mb-2 flex items-center">
                <span className="text-[16px] font-bold mr-2">사용된 조합</span>
                <InfoIcon text="위치는 무작위로 설정됩니다." />
            </div>
            {statsForSelect.selectCharComp.slice(0, 3).map((comp: any, ci: number) => (
                <div key={"clash" + statsForSelect?.select + "comp" + ci}
                    className={`flex dark:brightness-90 text-[12px] gap-x-2 dark:text-zinc-950 ${ci === 2 ? "mb-0" : "mb-4"}`}>

                    <div className="min-w-[78px] w-[16%] flex flex-col gap-y-1">
                        {comp?.back?.map((name: string, i: number) => (
                            <div key={"clash" + statsForSelect?.select + "comp" + name + ci + i}
                                title={name}
                                className={`flex-1 bg-${findPersonalityByName(name)} rounded-md p-1 min-w-0 flex items-center max-h-[23px] ${statsForSelect?.select === name ? "font-bold" : ""}`}>
                                <span className="truncate">
                                    {name === "시온" ? "시온 더 다크불릿" : name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="min-w-[78px] w-[16%] flex flex-col gap-y-1">
                        {comp?.mid?.map((name: string, i: number) => (
                            <div key={"clash" + statsForSelect?.select + "comp" + name + ci + i}
                                title={name}
                                className={`flex-1 bg-${findPersonalityByName(name)} rounded-md p-1 min-w-0 flex items-center max-h-[23px] ${statsForSelect?.select === name ? "font-bold" : ""}`}>
                                <span className="truncate">
                                    {name === "시온" ? "시온 더 다크불릿" : name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="min-w-[78px] w-[16%] flex flex-col gap-y-1">
                        {comp?.front?.map((name: string, i: number) => (
                            <div key={"clash" + statsForSelect?.select + "comp" + name + ci + i}
                                title={name}
                                className={`flex-1 bg-${findPersonalityByName(name)} rounded-md p-1 min-w-0 flex items-center max-h-[23px] ${statsForSelect?.select === name ? "font-bold" : ""}`}>
                                <span className="truncate">
                                    {name === "시온" ? "시온 더 다크불릿" : name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className={`w-[15%] flex justify-center items-center font-bold text-[13px] ml-3 dark:text-zinc-200`}>
                        <span>
                            {comp?.count}회
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default UsedComp