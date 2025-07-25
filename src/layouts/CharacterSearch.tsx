import { useEffect, useMemo, useRef, useState } from "react";
import { charInfo } from "../data/trickcalChar";
import { Link } from "react-router-dom";

const CharacterSearch = () => {

    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const searchList = useMemo(() => {
        if (!search.trim()) return [];

        return Object.keys(charInfo)
            .filter(name => name.includes(search))
    }, [search])

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (containerRef.current &&
                !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    // console.log(searchList)

    return (
        <div ref={containerRef} className=" relative w-[150px]">
            <div className={`flex items-center gap-x-1 border-[1px] border-orange-500 rounded-md p-2 ${open && searchList.length > 0 ? 'border-white shadow-md rounded-b-none' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                    type="text"
                    placeholder="사도 검색"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    onFocus={() => setOpen(true)}
                    className="text-[13px] focus:outline-none w-[100px]"
                />
            </div>
            {open && search.trim().length > 0 && searchList.length > 0 && (
                <div className="absolute z-10 bg-white text-[12px] flex-col flex gap-y-1 shadow-md w-full py-2">
                    {searchList.map(name => (
                        <Link
                            to={`/character/${name}`}
                            onClick={() => setOpen(false)}
                            key={'search_character' + name}
                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 text-gray-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <span>

                                {name}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CharacterSearch;