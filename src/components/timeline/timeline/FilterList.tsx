import React from 'react'
import { PatchCategory, PatchNote } from '../../../data/patchNotes';
import { label } from 'framer-motion/client';

interface FilterListProps {
    handleFilterSet: (category: PatchCategory | 'etc') => void;
    handleFilterSetGroup: (categories: (PatchCategory | 'etc')[]) => void;
    handleFilterClearAll: () => void;
    filterSet: Set<PatchCategory | 'etc'>
}

const PATCH_CATEGORY_GROUPS: { label: string; categories: PatchCategory[] | 'etc'[] }[] = [
    { label: "밸런스", categories: ["character_balance"] },
    { label: "침략/장비", categories: ["invasion_world", "gear_rank"] },
    { label: "보스 콘텐츠", categories: ["clash_level", "frontier_level", "clash_v2_level"] },
    { label: "모험", categories: ["crash_course", "nururing", "dig_base"] },
    { label: "던전", categories: ["gta_dungeon", "secret_bakery_dungeon", "clone_factory_dungeon"] },
    { label: "교주", categories: ["user_max_level"] },
    { label: "교단", categories: ["research_lab", "worldtree_relic", "kyarot_garden"] },
    { label: "기타", categories: ["etc"] },
];

const PATCH_CATEGORY_CONFIG: Record<PatchCategory | 'etc', string> = {
    character_balance: '밸런스 패치',
    invasion_world: '침략',
    gear_rank: '장비',
    clash_level: '차원 대충돌',
    frontier_level: '엘리아스 프론티어',
    clash_v2_level: '차원 대충돌 2.0',
    crash_course: '단기 속성반',
    nururing: '누루링 버스터즈',
    dig_base: '세계수 굴착기지',
    gta_dungeon: 'GTA',
    secret_bakery_dungeon: '비밀의 베이커리',
    clone_factory_dungeon: '클론 팩토리',
    user_max_level: '교주',
    research_lab: '연구실',
    worldtree_relic: '교단 성물',
    kyarot_garden: '캬롯의 정원',
    etc: '기타'
}

const FilterList: React.FC<FilterListProps> = ({
    handleFilterSet,
    handleFilterSetGroup,
    handleFilterClearAll,
    filterSet,
}) => {

    return (
        <div className="flex flex-wrap gap-x-2 relative">
            {PATCH_CATEGORY_GROUPS.map(group => (
                <div key={`filterList_${group.label}`}>
                    <div
                        onClick={() => handleFilterSetGroup(group?.categories)}
                        className="text-[12px] min-w-[130px] mb-1 cursor-pointer text-zinc-500 font-bold">
                        {group.label}
                    </div>
                    <div className="flex flex-col gap-y-1">
                        {group.categories.map(cate => (
                            <div
                                className={`min-w-[130px] cursor-pointer rounded-2xl bg-white border border-zinc-300 text-[12px] px-2 py-1 flex justify-between items-center`}
                                key={`filterList_${cate}`}
                                onClick={() => handleFilterSet(cate)}
                            >
                                <span>
                                    {PATCH_CATEGORY_CONFIG[cate]}
                                </span>
                                {filterSet.has(cate) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default React.memo(FilterList);