import React from "react";
import SelectRankHistogramChart from "../../chart/select/SelectRankHistogramChart";
import CoOccurrenceChar from "./CoOccurrenceChar";
import SelectInfo from "./SelectInfo";
import UsedPosition from "./UsedPosition";

const SelectCharComponent = ({
    statsForSelect,
    toggleExclude
}: {
    statsForSelect: any,
    toggleExclude: (name: string) => void,
}) => {

    // console.log(statsForSelect)

    return (
        <div className="overflow-hidden">
            <div className={`mx-auto flex flex-col rounded-xl dark:text-zinc-200 ${statsForSelect ? "xs:max-w-[992px] w-full" : "max-w-[992px]"}`}>
                {statsForSelect ? (
                    <div className="flex md:flex-row flex-col gap-4 w-full">
                        {/* 30% */}
                        <div className="flex flex-col md:justify-between gap-y-4 md:w-[32%] w-full">
                            {/* 사도 정보 */}
                            <SelectInfo
                                firstRank={statsForSelect.firstRank}
                                lastRank={statsForSelect.lastRank}
                                select={statsForSelect.select}
                                pickRate={statsForSelect.pickRate}
                                totalUses={statsForSelect.totalUses}
                                toggleExclude={toggleExclude}
                            />
                            {/* 사용된 위치 */}
                            <UsedPosition
                                statsForSelect={statsForSelect}
                            />
                        </div>
                        {/* 68.5% */}
                        <div className="flex flex-col md:justify-between gap-y-4 md:w-[66.5%] w-full">
                            {/* 구간별 등장 히스토그램 */}
                            <SelectRankHistogramChart
                                rankDistribution={statsForSelect.rankDistribution}
                                totalUses={statsForSelect.totalUses}
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