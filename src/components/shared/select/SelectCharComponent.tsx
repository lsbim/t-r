import React from "react";
import PersonalityIcon from "../../../commons/icon/PersonalityIcon";
import { findPersonalityByName } from "../../../utils/function";
import CoOccurrenceChar from "./CoOccurrenceChar";
import UsedPosition from "./UsedPosition";
import SelectInfo from "./SelectInfo";
import SelectRankHistogramChart from "../../chart/select/SelectRankHistogramChart";

const SelectCharComponent = ({ statsForSelect }: { statsForSelect: any }) => {

    console.log(statsForSelect)

    return (
        <div className="overflow-hidden">
            <div className={`mx-auto flex flex-col rounded-xl dark:text-zinc-200 ${statsForSelect ? "xs:max-w-[992px] w-full" : "max-w-[992px]"}`}>
                <div className="flex items-center mb-2">
                    {statsForSelect?.select && (
                        <div className="flex items-center">
                            <PersonalityIcon personality={findPersonalityByName(statsForSelect?.select)} />
                            <span className={`text-xl font-bold p-1`}>
                                {statsForSelect?.select || ""}
                            </span>
                        </div>
                    )}
                </div>
                {statsForSelect ? (
                    <div className="flex flex-col gap-y-4 w-full">
                        <div className="xs:flex-row flex flex-col xs:justify-between gap-4 w-full">
                            {/* 사도 정보 */}
                            <SelectInfo
                                firstRank={statsForSelect.firstRank}
                                lastRank={statsForSelect.lastRank}
                                select={statsForSelect.select}
                                pickRate={statsForSelect.pickRate}
                            />
                            <SelectRankHistogramChart
                                rankDistribution={statsForSelect.rankDistribution}
                                totalUses={statsForSelect.totalUses}
                            />
                        </div>
                        <div className="xs:flex-row flex flex-col xs:justify-between gap-4 w-full">
                            {/* 사용된 위치 */}
                            <UsedPosition
                                statsForSelect={statsForSelect}
                            />
                            {/* 함께한 사도 */}
                            <CoOccurrenceChar
                                statsForSelect={statsForSelect}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-600">
                        사도를 선택해 주세요.
                    </div>
                )}
            </div>
        </div >
    );
}

export default React.memo(SelectCharComponent);