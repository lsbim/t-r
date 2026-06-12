import React, { useState } from 'react'
import { charInfo } from '../../data/trickcalChar';
import { useCharSearch } from '../../hooks/useCharSearch';
import { Link } from 'react-router-dom';

const CharacterSearchList = () => {

    const [search, setSearch] = useState('');
    const searchList = useCharSearch({ search, showAllWhenEmpty: true });

    return (
        <div className="md:w-[768px] w-full mx-auto border dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 flex flex-col rounded-xl bg-white h-[256px] overflow-hidden">
            {/* 헤더(검색) */}
            <div className="py-2 px-4 dark:text-zinc-200 flex items-center justify-between h-[56px] shrink-0">
                <span className="font-bold">
                    사도 목록
                </span>
                <input
                    type="text"
                    placeholder="사도 검색(에르핀, ㅇㄹㅍ, ㅇㄿ)"
                    className="w-[180px] outline-none border border-zinc-950 rounded-sm text-[12px] h-[30px] px-2 py-1 dark:bg-zinc-700"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />
            </div>
            {/* 사도 목록 */}
            <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] p-4 gap-3 overflow-y-auto">
                {searchList.map(name => (
                    <Link
                        to={`/character/${name}`}
                        className="group flex flex-col items-center justify-center w-[64px] text-gray-500 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-200 cursor-pointer"
                        key={`character_search_list_${name}`}>
                        <div className={`w-[64px] h-[64px] overflow-hidden ${charInfo[name].personality === '공명' ? 'resonance-pers' : `bg-${charInfo[name].personality}`}`}>
                            <img
                                className="w-full h-full object-cover object-top origin-top scale-[1.4] group-hover:scale-[1.5] duration-300 transition-transform ease-out"
                                src={`/images/character/${name}.webp`}
                            />
                        </div>
                        <span className="text-[13px] truncate w-full text-center">
                            {name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default CharacterSearchList;