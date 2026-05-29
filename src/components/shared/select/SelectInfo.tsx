import React from 'react'
import { findPersonalityByName } from '../../../utils/function';

interface SelectInfoProps {
    firstRank: number;
    lastRank: number;
    select: string;
    pickRate: number;
}

const SelectInfo: React.FC<SelectInfoProps> = ({
    firstRank,
    lastRank,
    select,
    pickRate,
}) => {
    return (
        <div className="xs:w-[38%] w-full p-3 h-[200px] flex flex-col justify-center items-center gap-y-3 bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-xl border border-zinc-300">
            <div className={`overflow-hidden rounded-full w-14 h-14 border-4 border-${findPersonalityByName(select)}-dark`}>
                <img
                    src={`/images/profile/${select.startsWith('우로스(') ? '우로스' : select}.webp`}
                />
            </div>
            <span className="font-bold truncate w-full text-center text-[13px]">
                {select}
            </span>
            <span className="text-[15px]">
                {Math.round(pickRate * 100) / 100}%
            </span>
        </div>
    )
}

export default SelectInfo