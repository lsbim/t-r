import { useMemo } from "react";
import { ClashExternalData } from "../../types/clashTypes";
import { FrontierExternalData } from "../../types/frontierTypes";
import { BaseLine, ExternalSummaryData } from "../../types/trickcalTypes";
import { processExternalData } from "../../utils/chartFunction";

const EXTERNAL_USER_LENGTH = 100;

const ExternalPickRateChart = ({ data, season, prevData }:
    {
        data: ClashExternalData | FrontierExternalData,
        season?: string,
        prevData?: ClashExternalData | FrontierExternalData,
    }) => {

    const processData = processExternalData(data).sort((a, b) => b.percent - a.percent);

    const lineList: BaseLine[] = ["후열", "중열", "전열"];
    let processPrevData: ExternalSummaryData[] | null = null;
    if (prevData) {
        processPrevData = processExternalData(prevData).sort((a, b) => b.percent - a.percent);
    }

    const prevSeasonPickRates = useMemo(() => {
        if (!processPrevData) return null;

        const safeProcessPrevData = processPrevData as ExternalSummaryData[];
        const rateMap = new Map<string, number>();

        lineList.forEach(line => {

            const prevBucket = safeProcessPrevData
                .filter(item => item.line === line)
                .map(item => ({
                    name: item.name,
                    lineCnt: item.count
                }));

            if (prevBucket.length === 0) return;

            prevBucket.forEach(({ name, lineCnt }) => {
                const pickRate = (lineCnt / EXTERNAL_USER_LENGTH) * 100;
                // '캐릭터이름-라인' 형태의 고유한 키로 픽률 저장
                rateMap.set(`${name}-${line}`, pickRate);
            });
        });

        return rateMap;
    }, [processPrevData]);

    // console.log("processPrevData: ", prevSeasonPickRates);

    // console.log("pick rate processData", processData);

    if (!processData) {
        <div>
            asd..
        </div>
    }

    // const globalMax = Math.max(...processData.map((i) => i.percent));

    return (
        <div id="pickRate" className="flex overflow-x-auto">
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

                                    if (item.line !== line) return null;
                                    // console.log("item: ", item)
                                    // console.log(charInfo[item.name].line === item.line)


                                    let changeText = '-';
                                    let changeClassName = 'text-gray-800'; // 기본 스타일
                                    // 현재 시즌 픽률 계산
                                    const currentPickRate = Math.round(item.count / EXTERNAL_USER_LENGTH * 1000) / 10;

                                    if (prevSeasonPickRates) {
                                        // Map에서 이전 시즌 픽률 조회
                                        const prevPickRate = prevSeasonPickRates.get(`${item.name}-${line}`) || 0;

                                        // console.log(prevPickRate)

                                        if (prevPickRate === 0) { // 이전 시즌 기록이 없는 경우
                                            changeText = 'New';
                                            changeClassName = 'text-red-600 font-semibold';
                                        } else {
                                            const pickRateChange = currentPickRate - prevPickRate;
                                            const roundedChange = Math.round(pickRateChange * 10) / 10;

                                            if (roundedChange > 0.0) {
                                                changeText = `+${roundedChange.toFixed(1)}%`;
                                                changeClassName = 'text-red-600';
                                            } else if (roundedChange < 0.0) {
                                                changeText = `-${Math.abs(roundedChange).toFixed(1)}%`;
                                                changeClassName = 'text-blue-600';
                                            }
                                        }
                                    }

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
                                                    data-tooltip-id="my-tooltip"
                                                    data-tooltip-content="픽률"
                                                    className="w-12 flex justify-end text-[12px] text-gray-500 hover:text-gray-800 cursor-pointer">
                                                    {Math.round((item.count / EXTERNAL_USER_LENGTH) * 100 * 10) / 10}%
                                                </span>
                                                {/* <div className="w-12" /> */}
                                                {'personality' in data ? (
                                                    <span
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content="전체 비중"
                                                        className="w-12 flex justify-end text-[12px] text-gray-300 hover:text-gray-800 cursor-pointer">
                                                        {Math.round(item?.percent * 10) / 10}%
                                                    </span>
                                                ) : (
                                                    <span
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content="전 시즌 대비"
                                                        className={`w-12 flex justify-end text-[12px] hover:brightness-90 cursor-pointer ${changeClassName}`}
                                                    >
                                                        {changeText}
                                                    </span>
                                                )}
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