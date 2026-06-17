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
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        className="size-3 text-gray-600 absolute pointer-events-none left-2 top-[9px] dark:text-zinc-200">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="사도 검색(에르핀, ㅇㄹㅍ, ㅇㄿ)"
                        className="w-[200px] outline-none border border-zinc-950 rounded-sm text-[12px] h-[30px] pl-6 py-1 dark:bg-zinc-700 focus:border-orange-500 transition-[border] duration-250"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                </div>
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