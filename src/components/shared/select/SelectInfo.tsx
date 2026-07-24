import React, { Fragment } from 'react'
import { findPersonalityByName } from '../../../utils/function';
import { charInfo } from '../../../data/trickcalChar';
import { Link } from 'react-router-dom';

interface SelectInfoProps {
    firstRank: number;
    lastRank: number;
    select: string;
    pickRate: number;
    totalUses: number;
    toggleExclude: (name: string) => void;
    maxScore: number;
    minScore: number;
    scoreType: 'coin' | 'duration'
}

const SelectInfo: React.FC<SelectInfoProps> = ({
    firstRank,
    lastRank,
    select,
    pickRate,
    totalUses,
    toggleExclude,
    maxScore,
    minScore,
    scoreType,
}) => {

    const selectUrl = select.startsWith('우로스(') ? `/character/우로스` : `/character/${select}`;

    const isCoin = scoreType === 'coin'

    const INFO_CONFIG = [[
        { title: '픽', value: totalUses },
        { title: '픽률', value: `${Math.round(pickRate * 100) / 100}%` }
    ],
    [
        { title: '최초 등장', value: `${firstRank ?? '- '}위` },
        { title: '최종 등장', value: `${lastRank ?? '- '}위` },
    ],
    [
        // 위: 더 높은 성적, 아래: 더 낮은 성적
        { title: isCoin ? '최다 코인' : '최단 시간', value: isCoin ? `${maxScore ?? '- '}개` : `${minScore ?? '- '}초` },
        { title: isCoin ? '최소 코인' : '최장 시간', value: isCoin ? `${minScore ?? '- '}개` : `${maxScore ?? '- '}초` },
    ]]

    return (
        <div className="w-full p-3 h-[200px] flex flex-col justify-center items-center gap-y-3 bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-xl border border-zinc-300">
            {/* 사진, 사도 명 */}
            <div className="flex gap-x-2 items-center w-full justify-center">
                <Link
                    to={selectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`overflow-hidden rounded-full w-14 h-14 border-4 border-${findPersonalityByName(select)}-dark`}>
                    <img
                        src={`/images/profile/${select.startsWith('우로스(') ? '우로스' : select}.webp`}
                    />
                </Link>
                <div className="flex flex-col min-w-[95px]">
                    <span className="font-bold truncate text-start text-[14px]">
                        {select === '시온' ? '시온 더 다크불릿' : select}
                    </span>
                    <span className="truncate text-start text-[12px] text-gray-600 dark:text-zinc-400">
                        {`${charInfo[select]?.personality}, ${charInfo[select]?.grade}성`}
                    </span>
                </div>
                <button
                    onClick={() => {
                        toggleExclude(select)
                    }}
                    className="text-red-600 text-[12px] font-bold">

                    제외하기
                </button>
            </div>
            <div className="flex gap-x-6 w-full justify-center">
                {INFO_CONFIG?.map((info, index) => (
                    <div
                        key={`select_info_${index}`}
                        className="text-[12px] text-gray-800 gap-y-2 flex flex-col min-w-[60px] dark:text-zinc-200">
                        {info?.map((fo, i) => (
                            <div className="flex flex-col"
                                key={`select_info_${index}_child_${i}`}>
                                <span className=" dark:text-zinc-400 text-gray-600">
                                    {fo.title}
                                </span>
                                <span className="text-[13px] font-bold">
                                    {fo.value}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SelectInfo