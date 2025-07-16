import { ClashSeasonData } from "../../types/clashTypes";
import { FrontierSeasonData } from "../../types/frontierTypes";
import { BaseLine, lineList } from "../../types/trickcalTypes";
import { processRankingArrData } from "../../utils/function";

const PickRateChart = ({ data, season, setSelect }:
    {
        data: ClashSeasonData | FrontierSeasonData,
        season?: string, setSelect: React.Dispatch<React.SetStateAction<string>>
    }) => {

    const processData = processRankingArrData(data?.data).sort((a, b) => b.percent - a.percent)

    const lineBuckets: Record<BaseLine, number[]> = {
        전열: [0, 1, 2],
        중열: [3, 4, 5],
        후열: [6, 7, 8],
    };

    // console.log("pick rate processData", processData);


    // const globalMax = Math.max(...processData.map((i) => i.percent));

    return (
        <div className="flex overflow-x-scroll">
            <div className="w-[1024px] flex mx-auto justify-center">
                {lineList.map((line, li) => {
                    const idxs = lineBuckets[line];

                    // 1) 이 라인에 최소 한 번이라도 등장한 캐릭터
                    let bucket = processData
                        .map((item) => {
                            // 이 아이템의 이 줄에서의 총 등장 횟수
                            const lineCnt = idxs.reduce((s, pos) => s + (item.positions[pos] || 0), 0);
                            return { item, lineCnt };
                        })
                        .filter(({ lineCnt }) => lineCnt > 0)
                        .sort((a, b) => b.lineCnt - a.lineCnt);

                    if (bucket.length === 0) return null;
                    // console.log("bucket", bucket)

                    const charSum = bucket.reduce((sum, b) => sum + b.lineCnt, 0);
                    const maxLineCount = Math.max(...bucket.map(({ lineCnt }) => lineCnt));

                    // console.log("charSum: ", charSum)
                    // console.log("maxLineCnt: ", maxLineCount)

                    return (
                        <div key={'clash' + season + line} className={`shadow-md p-2 w-[320px] bg-white ${li === 2 ? 'mr-0' : 'mr-4'}`}>
                            <div className="text-xl font-semibold mb-2 justify-between flex items-center">
                                <span className="">{line}</span>
                                <span className="text-[16px]">{charSum}</span>
                            </div>

                            {/* flex-col 으로 세로 나열 */}
                            <div className="flex flex-col">
                                {bucket.map(({ item, lineCnt }) => {
                                    // 가로 바 채우기 비율
                                    const fillPct = maxLineCount
                                        ? (lineCnt / maxLineCount) * 100
                                        : 0;

                                    // console.log("item: ", item)

                                    return (
                                        <div
                                            onClick={() => setSelect(item?.name)}
                                            key={"clash" + item.name}
                                            className="flex items-center w-full">
                                            <div
                                                className="w-[90px] whitespace-nowrap overflow-hidden text-ellipsis mr-4 text-[15px]"
                                                title={item.name === "시온" ? "시온 더 다크불릿" : item.name}>
                                                {item.name === "시온" ? "시온 더 다크불릿" : item.name}
                                            </div>

                                            {/* 2) 가로 바 컨테이너 */}
                                            <div className="flex-1 bg-gray-200 h-4 overflow-hidden text-[12px] hover:brightness-90">
                                                <div
                                                    className={`h-full bg-${item.personality}`}
                                                    style={{ width: `${fillPct}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center h-full">
                                                <span
                                                    className="w-12 flex justify-end text-sm">
                                                    {idxs.reduce((s, pos) => s + (item.positions[pos] || 0), 0)}
                                                </span>

                                                <span
                                                    data-tooltip="픽률"
                                                    className="w-12 flex justify-end text-[12px] text-gray-500 hover:text-gray-800 cursor-pointer">
                                                    {Math.round((item?.percentByLine[line as "전열" | "중열" | "후열"] * 3) * 10) / 10}%
                                                </span>

                                                {/* 3) 레이블(퍼센트) */}
                                                <span
                                                    data-tooltip={`전체 비중`}
                                                    className="w-12 flex justify-end text-[12px] text-gray-300 hover:text-gray-800 cursor-pointer">
                                                    {Math.round(item?.percent * 10) / 10}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PickRateChart;