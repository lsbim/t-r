import Summary from "../../commons/component/Summary";
import { FrontierSummary } from "../../types/frontierTypes";

const IndexComponent = ({ summary }: { summary: FrontierSummary }) => {
    // console.log(summary)

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl w-[992px] max-w-full my-8">
            <div className="p-4 pl-6 mb-2 flex flex-col border-b-4 border-gray-200 dark:border-zinc-800 gap-y-2">
                <div className="flex flex-col justify-start dark:text-zinc-200">
                    <h1 className="text-[20px] font-bold mr-2">엘리아스 프론티어 집계</h1>
                    <span className="flex xs:text-[14px] text-[11px]">막대 차트 클릭 시 해당 시즌의 상세 집계 페이지로 이동합니다.</span>
                </div>
            </div>
            
            <Summary summary={summary} type="frontier" />
        </div>
    );
}

export default IndexComponent;