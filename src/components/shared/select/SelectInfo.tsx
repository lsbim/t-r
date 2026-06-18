import React from 'react'
import { findPersonalityByName } from '../../../utils/function';
import { charInfo } from '../../../data/trickcalChar';
import { Link } from 'react-router-dom';

interface SelectInfoProps {
    firstRank: number;
    lastRank: number;
    select: string;
    pickRate: number;
    totalUses: number;
}

const SelectInfo: React.FC<SelectInfoProps> = ({
    firstRank,
    lastRank,
    select,
    pickRate,
    totalUses
}) => {

    const selectUrl = select.startsWith('우로스(') ? `/character/우로스` : `/character/${select}`;

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
            </div>
            <div className="flex gap-x-8 w-full justify-center">
                {/* 픽 수, 픽률 */}
                <div className="text-[12px] text-gray-800 gap-y-2 flex flex-col min-w-[60px] dark:text-zinc-200">
                    <div className="flex flex-col">
                        <span className=" dark:text-zinc-400 text-gray-600">
                            픽
                        </span>
                        <span className="text-[13px] font-bold">
                            {totalUses}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className=" dark:text-zinc-400 text-gray-600">
                            픽률
                        </span>
                        <span className="text-[13px] font-bold">
                            {Math.round(pickRate * 100) / 100}%
                        </span>
                    </div>
                </div>
                {/* 최초,최종 등수 */}
                <div className="text-[12px] text-gray-800 gap-y-2 flex flex-col min-w-[60px] dark:text-zinc-200">
                    <div className="flex flex-col">
                        <span className=" dark:text-zinc-400 text-gray-600">
                            최초 등장
                        </span>
                        <span className="text-[13px] font-bold">
                            {firstRank}위
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className=" dark:text-zinc-400 text-gray-600">
                            최종 등장
                        </span>
                        <span className="text-[13px] font-bold">
                            {lastRank}위
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectInfo