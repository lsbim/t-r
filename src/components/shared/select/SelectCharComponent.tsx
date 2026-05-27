import React from "react";
import PersonalityIcon from "../../../commons/icon/PersonalityIcon";
import { findPersonalityByName } from "../../../utils/function";
import CoOccurrenceChar from "./CoOccurrenceChar";
import UsedPosition from "./UsedPosition";

const SelectCharComponent = ({ statsForSelect }: { statsForSelect: any }) => {

    console.log(statsForSelect)

    return (
        <div className="overflow-hidden">
            <div className={`mx-auto flex flex-col rounded-xl dark:text-zinc-200 ${statsForSelect ? "w-[992px] " : "max-w-[992px]"}`}>
                <div className="flex items-center mb-4">
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
                    <div className="flex flex-col gap-y-4">
                        <div className="flex justify-between">
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