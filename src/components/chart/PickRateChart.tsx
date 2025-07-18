import { useMemo } from "react";
import { ClashExternalData, ClashSeasonData } from "../../types/clashTypes";
import { FrontierExternalData, FrontierSeasonData } from "../../types/frontierTypes";
import { BaseLine, ExternalSummaryData, lineList, SummaryData } from "../../types/trickcalTypes";
import { processExternalData, processRankingArrData } from "../../utils/chartFunction";

const PickRateChart = ({ data, season, setSelect, prevData }:
    {
        data: ClashSeasonData | FrontierSeasonData,
        season?: string, setSelect: React.Dispatch<React.SetStateAction<string>>,
        prevData?: ClashSeasonData | FrontierSeasonData | ClashExternalData | FrontierExternalData,
    }) => {

    const processData = processRankingArrData(data?.data).sort((a, b) => b.percent - a.percent);
    let processPrevData: SummaryData[] | ExternalSummaryData[] | null = null;

    if (prevData) {
        processPrevData = prevData?.type === 'season' ?
            processRankingArrData(prevData?.data).sort((a, b) => b.percent - a.percent) :
            processExternalData(prevData).sort((a, b) => b.percent - a.percent);

        // console.log("processPrevData: ", processPrevData);
    }

    const lineBuckets: Record<BaseLine, number[]> = {
        전열: [0, 1, 2],
        중열: [3, 4, 5],
        후열: [6, 7, 8],
    };

    const prevSeasonPickRates = useMemo(() => {
        if (!processPrevData) return null;

        const rateMap = new Map<string, number>();

        lineList.forEach(line => {
            const idxs = lineBuckets[line];

            const prevBucket = (
                'positions' in processPrevData![0]
                    // SummaryData[] 분기
                    ? (processPrevData as SummaryData[])
                        .map(item => ({
                            name: item.name,
                            lineCnt: idxs.reduce((s, pos) => s + (item.positions[pos] || 0), 0)
                        }))
                        .filter(x => x.lineCnt > 0)
                    // ExternalSummaryData[] 분기
                    : (processPrevData as ExternalSummaryData[])
                        .filter(item => item.line === line)
                        .map(item => ({
                            name: item.name,
                            lineCnt: item.count
                        }))
            );

            if (prevBucket.length === 0) return;

            const prevCharSum = prevBucket.reduce((sum, b) => sum + b.lineCnt, 0);

            prevBucket.forEach(({ name, lineCnt }) => {
                if (prevCharSum > 0) {
                    const pickRate = (lineCnt / (prevCharSum / 3)) * 100;
                    // '캐릭터이름-라인' 형태의 고유한 키로 픽률 저장
                    rateMap.set(`${name}-${line}`, pickRate);
                }
            });
        });

        return rateMap;
    }, [processPrevData]);

    console.log(prevSeasonPickRates)


    console.log("pick rate processData", processData);


    // const globalMax = Math.max(...processData.map((i) => i.percent));

    return (
        <div className="flex overflow-x-scroll">
            <div className="w-[1024px] flex mx-auto justify-center">
                {lineList.map((line, li) => {
                    const idxs = lineBuckets[line];

                    // 1) 이 라인에 최소 한 번이라도 등장한 캐릭터
                    let bucket = processData
                        .filter(item => item.line === line)
                        .map(item => item);

                    if (bucket.length === 0) return null;
                    console.log("bucket", bucket)

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

                                    // console.log(charInfo[item.name].line === item.line) // 라인 검수

                                    let changeText = '-';
                                    let changeClassName = 'text-gray-400'; // 기본 스타일
                                    // 현재 시즌 픽률 계산
                                    const currentPickRate = charSum > 0 ? (item.count / (charSum / 3)) * 100 : 0;

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
                                                    {item.count}
                                                </span>

                                                <span
                                                    data-tooltip="픽률"
                                                    className="w-12 flex justify-end text-[12px] text-gray-500 hover:text-gray-800 cursor-pointer">
                                                    {Math.round((item?.count / charSum * 100 * 3) * 10) / 10}%
                                                </span>

                                                <span
                                                    data-tooltip="전 시즌 대비"
                                                    className={`w-12 flex justify-end text-[12px] hover:brightness-90 cursor-pointer ${changeClassName}`}
                                                >
                                                    {changeText}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })
                }
            </div>
        </div>
    );
}

export default PickRateChart;