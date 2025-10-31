import React, { useEffect, useMemo, useRef, useState } from "react";
import { materialNames, materials } from "../../data/materials";
import ItemIcon from "../../commons/icon/ItemIcon";
import { getChoseong } from "es-hangul";

const MaterialBag = ({
    inventory,
    handleBagOpen,
    handleInventory
}: {
    inventory: Map<string, number>,
    handleBagOpen: () => void,
    handleInventory: (name: string, value?: number) => void
}) => {
    const [search, setSearch] = useState('');
    const [isEdit, setIsEdit] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const itemRef = useRef<HTMLDivElement>(null);

    // 아이템 바깥 클릭 시 커밋
    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (itemRef.current &&
                !itemRef.current.contains(e.target as Node)) {
                handleCommit();
            }
        }

        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, [isEdit]);

    // {재료명:초성} 객체
    const initMatMap = useMemo(() => {
        return Object.fromEntries( // [k,v] 구조를 {k:v} 구조로 바꿈.
            materialNames.map(mat => {
                return [mat, getChoseong(mat.trim())]
            })
        );
    }, [materialNames])

    const filtered = useMemo(() => {
        const key = search.trim();
        if (!key) return materialNames;

        return materialNames.filter(name => {
            const initails = initMatMap[name];
            return (
                name.includes(key) ||
                initails.includes(key)
            )
        });
    }, [search]);

    // 클릭 시 수정 활성화
    const handleEditStart = (name: string) => {
        if (name === isEdit) return;

        if (isEdit && isEdit !== name) {
            const currentValue = inputRef.current?.value || '';
            const newValue = parseInt(currentValue, 10) || 0;
            handleInventory(isEdit, newValue);
        }

        setIsEdit(name);
    }
    // 수정 확인
    const handleCommit = () => {
        if (!isEdit) return;
        const currentValue = inputRef.current?.value || '';
        const newValue = parseInt(currentValue, 10) || 0;
        handleInventory(isEdit, newValue);
        setIsEdit(''); // 편집 모드 종료
    };
    // Enter / Esc로 Input 벗어나기
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            handleCommit();
        }
    };

    useEffect(() => {
        if (inputRef.current && isEdit) {
            inputRef.current.focus();
            inputRef.current.value = String(inventory.get(isEdit) || '');
        }
    }, [isEdit]);

    return (
        <div
            className="bg-white dark:bg-zinc-900 dark:text-zinc-100 xs:h-[300px] xs:w-[300px] w-full h-[240px] xs:absolute fixed xs:top-[152px] xs:left-[-260px] bottom-0 left-0 z-[999] shadow-md border-t border-gray-400 dark:border-zinc-300 shadow-gray-400 dark:shadow-zinc-300 rounded-md flex flex-col">
            <div className="mx-auto text-[13px] py-1">
                보유중인 재료를 입력할 수 있습니다.
            </div>
            <div className={`flex items-center gap-x-1 border-y-[1px] border-orange-500 p-2 `}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                    type="text"
                    placeholder="재료 검색"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    className="text-[13px] focus:outline-none w-[90%] dark:bg-zinc-900"
                />
            </div>
            <div className="flex m-auto p-2 overflow-y-auto">
                {filtered?.length === 0 ? (
                    <div className="font-bold text-gray-400">
                        검색 결과가 없습니다.
                    </div>
                ) : (
                    <div
                        ref={itemRef}
                        className="flex flex-wrap items-start justify-center gap-1">
                        {filtered.map(mat => {
                            const isOwn = inventory?.has(mat) && inventory.get(mat)! > 0

                            return (
                                <div
                                    title={mat}
                                    key={`material_bag_${mat}`}
                                    className="relative w-[60px] h-[60px]"
                                    onClick={() => handleEditStart(mat)}>
                                    <ItemIcon
                                        name={mat}
                                        opacity={!isOwn ? 0.4 : 1}
                                        value={inventory.get(mat)}
                                    />
                                    {isEdit === mat && (
                                        <div className="z-20">
                                            <input
                                                ref={inputRef}
                                                type="number"
                                                onInput={(e) => {
                                                    const target = e.target as HTMLInputElement;
                                                    if (target.value.length > 7) {
                                                        target.value = target.value.slice(0, 7);
                                                    }
                                                }}
                                                onKeyDown={handleKeyDown}
                                                className="bg-white text-black border-2 border-black absolute w-full bottom-1 left-0 focus:outline-none text-[14px]"
                                            />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            {/* 비우기 */}
            <div className="flex mt-2 h-6 w-full font-bold">
                <div
                    onClick={() => {
                        if (inventory.size === 0) return;

                        handleInventory('clear')
                    }}
                    className="bg-gray-200 dark:bg-zinc-600 flex items-center justify-center cursor-pointer w-[50%] hover:bg-gray-400 dark:hover:bg-zinc-500 transition-colors duration-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span className="text-[14px]">
                        비우기
                    </span>
                </div>
                <div
                    onClick={handleBagOpen}
                    className="bg-gray-200 dark:bg-zinc-600 flex items-center justify-center cursor-pointer w-[50%] hover:bg-gray-400 dark:hover:bg-zinc-500 transition-colors duration-100">
                    <span className="text-[14px]">
                        닫기
                    </span>
                </div>
            </div>
        </div>
    );
}

export default React.memo(MaterialBag);