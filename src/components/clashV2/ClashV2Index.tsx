import Summary from "../../commons/component/Summary";
import { ClashV2Summary } from "../../types/clashV2Types";

const ClashV2Index = ({ summary }: { summary: ClashV2Summary }) => {

    return (
        <div className="w-[992px] max-w-full my-8">
            <div className="p-2 mb-2 flex flex-col gap-y-2">
                <div className="flex flex-col justify-start dark:text-zinc-200">
                    <h1 className="text-[20px] font-bold mr-2">차원 대충돌 2.0 집계</h1>
                </div>
            </div>

            <Summary summary={summary} type="clashV2" />
        </div>
    );
}

export default ClashV2Index;