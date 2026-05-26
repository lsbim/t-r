import Summary from "../../commons/component/Summary";
import { FrontierSummary } from "../../types/frontierTypes";

const IndexComponent = ({ summary }: { summary: FrontierSummary }) => {
    // console.log(summary)

    return (
        <div className="w-[992px] max-w-full my-8">
            <div className="p-2 mb-2 flex flex-col gap-y-2">
                <div className="flex flex-col justify-start dark:text-zinc-200">
                    <h1 className="text-[20px] font-bold mr-2">엘리아스 프론티어 집계</h1>
                </div>
            </div>

            <Summary summary={summary} type="frontier" />
        </div>
    );
}

export default IndexComponent;