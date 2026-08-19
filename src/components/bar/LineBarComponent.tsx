import { charInfo } from "../../data/trickcalChar";
import { SummaryData } from "../../types/trickcalTypes";

const LineBarComponent = ({
    data,
    line,
}: {
    data: SummaryData[],
    line?: string,
}) => {

    const lineData = line
        ? data?.filter(d =>
            d.line === line
        )
        : data;
    // console.log("lineData: ", lineData)

    // 성격별 count 합산
    const sumPersonality = lineData.reduce<Record<string, number>>((acc, d) => {
        const p = charInfo[d.name]?.personality;
        acc[p] = (acc[p] || 0) + d?.count
        return acc;
    }, {})

    // 가나다 순 정렬된 배열로 변환
    const segments = Object.keys(sumPersonality)
        .sort((a, b) => a.localeCompare(b, "ko"))
        .map((personality) => ({
            personality,
            count: sumPersonality[personality],
        }));

    // 총합 (라인 내 100% 재스케일 하려면 이 값을 사용)
    const total = Object.values(sumPersonality).reduce((sum, count) => sum + count, 0);

    return (
        <div
            className="w-full h-[24px] flex overflow-hidden text-[13px] dark:brightness-90 rounded-md">
            {segments.map((seg) => {
                // (seg.percent/total)*100 으로 재스케일하거나,
                // 전체 백분율 그대로 seg.percent 사용
                const w = (seg.count / total) * 100;
                return (
                    <div
                        key={seg.personality}
                        className={`flex items-center justify-center bg-${seg.personality} overflow-hidden cursor-pointer`}
                        style={{
                            flexGrow: seg.count,
                            flexShrink: 1,
                            flexBasis: 0,
                        }}
                        title={`${line ? line : ''} ${seg.personality} ${w.toFixed(1)}%`}
                    >
                        <span className="whitespace-nowrap">
                            {Math.round(w)}%
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default LineBarComponent;