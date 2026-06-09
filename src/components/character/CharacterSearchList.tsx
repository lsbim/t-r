import React from 'react'
import { charInfo } from '../../data/trickcalChar';

const CharacterSearchList = () => {

    const characterObj = Object.entries(charInfo).filter(([key]) => !key.startsWith('우로스('));

    return (
        <div className="lg:w-[768px] w-full mx-auto border-2 border-gray-300 dark:border-zinc-700 flex flex-col rounded-xl bg-white h-[230px]">
            <div className="p-2">
                사도 목록
            </div>
            <div className="w-full flex flex-wrap p-4 gap-3 overflow-y-auto">
                {characterObj.map(([key, value]) => (
                    <div
                        className="group flex flex-col items-center justify-center w-[64px] text-gray-500 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-200 cursor-pointer"
                        key={`character_search_list_${key}`}>
                        <div className={`w-[64px] h-[64px] overflow-hidden ${value.personality === '공명' ? 'resonance-pers' : `bg-${value.personality}`}`}>
                            <img
                                className="w-full h-full object-cover object-top origin-top scale-[1.4] group-hover:scale-[1.5] duration-300 transition-transform ease-out"
                                src={`/images/character/${key}.webp`}
                            />
                        </div>
                        <span className="text-[13px] truncate w-full text-center">
                            {key}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CharacterSearchList;