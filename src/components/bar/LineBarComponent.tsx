import { Link } from "react-router-dom";
import { SummaryData } from "../../types/trickcalTypes";

const LineBarComponent = ({ data, line, season, type }
    : { data: SummaryData[], line: string, season: number, type: string }) => {

    const lineData = data.filter(d =>
        d.line === line || d.line === "모든열"
    );

    // 2) 성격별(percent) 합산
    const sumByPersona = lineData.reduce<Record<string, number>>((acc, d) => {
        acc[d.personality] = (acc[d.personality] || 0) + d.percent;
        return acc;
    }, {});

    // 3) 가나다(ko) 순 정렬된 배열로 변환
    const segments = Object.keys(sumByPersona)
        .sort((a, b) => a.localeCompare(b, "ko"))
        .map((personality) => ({
            personality,
            percent: sumByPersona[personality],
        }));

    // 총합 (라인 내 100% 재스케일 하려면 이 값을 사용)
    const total = segments.reduce((sum, seg) => sum + seg.percent, 0);

    // console.log("data", data)

    return (
        <Link
            to={`/${type}/${season}`}
            className="w-full h-[24px] flex overflow-hidden text-[13px] border border-black"
        >
            {segments.map((seg) => {
                // (seg.percent/total)*100 으로 재스케일하거나,
                // 전체 백분율 그대로 seg.percent 사용
                const w = (seg.percent / total) * 100;
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