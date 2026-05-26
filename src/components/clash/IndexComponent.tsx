import { useState } from "react";
import SlideColorNav from "../../commons/animation/SlideColorNav";
import Summary from "../../commons/component/Summary";
import { ClashSummary } from "../../types/clashTypes";
import { getClashSortInfo, updateClashSortInfo } from "../../utils/clashLocalStorage";

const IndexComponent = ({ summary }: { summary: ClashSummary }) => {
    const [clashSort, setClashSort] = useState<'boss' | 'pers'>(getClashSortInfo())

    const handleClashSort = (sort: 'boss' | 'pers') => {
        updateClashSortInfo(sort);
        setClashSort(sort)
    }

    const tabs = [
        { id: 'boss', label: '보스정렬' },
        { id: 'pers', label: '성격정렬' },
    ] as const;

    // console.log(summary)

    return (
        <div className="w-[992px] max-w-full my-8">
            <div className="p-2 mb-2 flex flex-col">
                <div className="flex flex-col justify-start mb-3 dark:text-zinc-200">
                    <h1 className="text-[20px] font-bold mr-2">차원 대충돌 집계</h1>
                </div>
                <SlideColorNav
                    color="text-black dark:text-zinc-200"
                    handler={(p) => handleClashSort(p as 'boss' | 'pers')}
                    tabs={tabs}
                    initCategory={getClashSortInfo()}
                />
            </div>

            <Summary summary={summary} type="clash" sort={clashSort} />
        </div>
    );
}

export default IndexComponent;