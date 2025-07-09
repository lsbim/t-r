import { Link } from "react-router-dom";
import { SummaryData } from "../../types/trickcalTypes";
import { charInfo } from "../../data/trickcalChar";

const LineBarComponent = ({ data, line, season, type }
    : { data: SummaryData[], line: string, season: number, type: string }) => {

    const lineData = data.filter(d =>
        d.line === line
    );
    // console.log("lineData: ", lineData)

    // 성격별 count 합산
    const sumPersonality = lineData.reduce<Record<string, number>>((acc, d) => {
        const p = charInfo[d.name].personality;
        acc[p] = (acc[p] || 0) + d.count
        return acc;
    }, {})

    // console.log("sumPersonality: ", sumPersonality)

    // 3) 가나다(ko) 순 정렬된 배열로 변환
    const segments = Object.keys(sumPersonality)
        .sort((a, b) => a.localeCompare(b, "ko"))
        .map((personality) => ({
            personality,
            count: sumPersonality[personality],
        }));

    // console.log(segments)

    // 총합 (라인 내 100% 재스케일 하려면 이 값을 사용)
    const total = Object.values(sumPersonality).reduce((sum, count) => sum + count, 0);

    console.log("total: ", total)

    return (
        <Link
            to={`/${type}/${season}`}
            className="w-full h-[24px] flex overflow-hidden text-[13px] border border-black"
        >
            {segments.map((seg) => {
                // (seg.percent/total)*100 으로 재스케일하거나,
                // 전체 백분율 그대로 seg.percent 사용
                const w = (seg.count / total) * 100;
                return (
                    <div
                        key={seg.personality}
                        className={`flex items-center justify-center bg-gradient-to-r from-${seg.personality} to-${seg.personality}/80 overflow-hidden cursor-pointer`}
                        style={{ width: `${w}%` }}
                        // data-tooltip={`${line} ${seg.personality} ${w.toFixed(1)}%`}
                        title={`${line} ${seg.personality} ${w.toFixed(1)}%`}
                    >
                        <span className="whitespace-nowrap">
                            {Math.round(w)}%
                        </span>
                    </div>
                );
            })}
        </Link>
    );
}

export default LineBarComponent;