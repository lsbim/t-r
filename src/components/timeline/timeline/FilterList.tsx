import React from 'react'
import { PatchCategory } from '../../../data/patchNotes';
import { label } from 'framer-motion/client';

const FilterList = () => {
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

    return (
        <div className="flex gap-x-2">
            {PATCH_CATEGORY_GROUPS.map(group => (
                <div>
                    <span className="text-[12px]">
                        {group.label}
                    </span>
                    <div>
                        {group.categories.map(cate => (
                            <div>
                                {cate}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FilterList