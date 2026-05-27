import React from 'react'
import PersonalityIcon from '../../../commons/icon/PersonalityIcon';
import { findPersonalityByName } from '../../../utils/function';
import InfoIcon from '../../../commons/icon/InfoIcon';

const CoOccurrenceChar = ({ statsForSelect }: { statsForSelect: any }) => {
    return (
        <div className="w-[20%] flex flex-col justify-center">
            <div className="mb-4 flex items-center">
                <span className="text-[16px] font-bold mr-2">함께한 사도</span>
                <InfoIcon text="함께 출전한 상위 5인의 사도입니다." />
            </div>
            <div>
                {Object.entries(statsForSelect?.cooccurrence || {})
                    .sort(([, a], [, b]) => (b as number) - (a as number)) // 값 기준 내림차순 정렬
                    .slice(0, 5) // 상위 5개만 선택
                    .map(([key, value], index) => (
                        <div className="flex items-center mb-1"
                            key={"co_occurrence" + statsForSelect?.select + index}>
                            <PersonalityIcon personality={findPersonalityByName(key)} />
                            <span className="ml-1 font-bold mr-1">
                                {key}
                            </span>
                            <span>
                                {value as number}회
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CoOccurrenceChar