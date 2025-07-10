import { charInfo } from "../../data/trickcalChar";
import { ClashExternalData } from "../../types/clashTypes";
import { FrontierExternalData } from "../../types/frontierTypes";
import { BaseLine } from "../../types/trickcalTypes";
import { processExternalData } from "../../utils/function";

const ExternalPickRateChart = ({ data, season }:
    {
        data: ClashExternalData | FrontierExternalData,
        season?: string
    }) => {

    const processData = processExternalData(data).sort((a, b) => b.percent - a.percent);

    const lineList: BaseLine[] = ["후열", "중열", "전열"];

    // console.log("pick rate processData", processData);

    if (!processData) {
        <div>
            asd..
        </div>
    }

    // const globalMax = Math.max(...processData.map((i) => i.percent));

    return (
        <div className="flex overflow-x-scroll">
            <div className="w-[1024px] flex mx-auto justify-center">
                {lineList.map((line, li) => {

                    // 1) 이 라인에 최소 한 번이라도 등장한 캐릭터
                    let bucket = processData
                        .filter(item => item.line === line)
                        .sort((a, b) => b.count - a.count);

                    if (bucket.length === 0) return null;
                    // console.log("bucket", bucket);

                    const charSum = bucket.reduce((sum, b) => sum + b.count, 0);
                    const maxLineCount = Math.max(...bucket.map(({ count }) => count));

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
                                {bucket.map((item) => {
                                    // 가로 바 채우기 비율
                                    const fillPct = maxLineCount
                                        ? (item.count / maxLineCount) * 100
                                        : 0;

                                    // console.log("item: ", item)
                                    // console.log(charInfo[item.name].line === item.line)

                                    return (
                                        <div
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
                                                    {item.count}
                                                </span>

                                                <span
                                                    data-tooltip="픽률"
                                                    className="w-12 flex justify-end text-[12px] text-gray-500 hover:text-gray-800">
                                                    {/* {Math.round((item?.percentByLine[line as "전열" | "중열" | "후열"] * 3) * 10) / 10}% */}
                                                    {/* {Math.round((item.count / (charSum / 3)) * 100 * 10) / 10}% */}
                                                </span>

                                                {/* 3) 레이블(퍼센트) */}
                                                <span
                                                    data-tooltip={`전체 비중`}
                                                    className="w-12 flex justify-end text-[12px] text-gray-300 hover:text-gray-800">
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

export default ExternalPickRateChart;