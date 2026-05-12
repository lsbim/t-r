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
        <div className="bg-white w-[992px] dark:bg-zinc-900 rounded-2xl max-w-full my-8">
            <div className="p-4 pl-6 mb-2 flex flex-col border-b-4 border-gray-200 dark:border-zinc-800 gap-y-2">
                <div className="flex flex-col justify-start mb-3 dark:text-zinc-200">
                    <h1 className="text-[20px] font-bold mr-2">차원 대충돌 집계</h1>
                    <span className="flex xs:text-[14px] text-[11px]">막대 차트 클릭 시 해당 시즌의 상세 집계 페이지로 이동합니다.</span>
                </div>
                <span className="text-[12px] text-orange-500 font-bold">
                    정렬 기준
                </span>
                <SlideColorNav
                    color="text-black dark:text-zinc-200"
                    size={16}
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