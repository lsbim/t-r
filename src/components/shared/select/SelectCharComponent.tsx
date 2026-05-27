import React from "react";
import InfoIcon from "../../../commons/icon/InfoIcon";
import PersonalityIcon from "../../../commons/icon/PersonalityIcon";
import { findPersonalityByName } from "../../../utils/function";
import UsedPosition from "./UsedPosition";
import CoOccurrenceChar from "./CoOccurrenceChar";
import UsedComp from "./UsedComp";

const SelectCharComponent = ({ statsForSelect }: { statsForSelect: any }) => {

    console.log(statsForSelect)

    return (
        <div className="overflow-x-auto overflow-y-hidden">
            <div className={`mx-auto flex flex-col rounded-2xl pl-4 bg-white dark:bg-zinc-900 dark:text-zinc-200 p-2 pb-4 dark:border-zinc-700 border border-zinc-300 ${statsForSelect ? "w-[992px] " : "max-w-[992px]"}`}>
                <div className="flex items-center">
                    <span className="text-xl font-bold mr-4">사도 정보</span>
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
                    <div className="mx-auto flex mt-4 items-start w-full justify-around text-[14px]">
                        {/* 사용된 위치 */}
                        <UsedPosition
                            statsForSelect={statsForSelect}
                        />
                        {/* 함께한 사도 */}
                        {statsForSelect?.cooccurrence && (
                            <CoOccurrenceChar
                                statsForSelect={statsForSelect}
                            />
                        )}
                        {/* 사용된 조합 */}
                        <UsedComp
                            statsForSelect={statsForSelect}
                        />
                    </div>
                ) : (
                    <div className="mt-4 text-gray-600">
                        사도를 선택해 주세요.
                    </div>
                )}
            </div>
        </div >
    );
}

export default React.memo(SelectCharComponent);