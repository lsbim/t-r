import { charInfo } from "../data/trickcalChar";
import { FrontierExternalData, FrontierPlayerData, FrontierSeasonData } from "../types/frontierTypes";

export interface EnrichedFrontierChartData {
    name: string;
    percent: number;
    count: number;
    line: string;
    positions: Record<number, number>;
    percentByLine: Record<"전열" | "중열" | "후열", number>;  // 추가
}

export function processFrontierArrData(data: FrontierPlayerData[]): EnrichedFrontierChartData[] {
    const all: string[] = data.flatMap(d => d.arr);
    const total = all.length; // 최대 900

    // { 벨라: 17.3 }
    const counts: { [key: string]: number } = all.reduce((acc: { [key: string]: number }, name: string) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {}); // 초기값으로 빈 객체를 전달합니다.

    // 몇번째 인덱스에 위치했는지 기록
    const positions: Record<string, Record<number, number>> = {};
    data.forEach(({ arr }) => {
        arr.forEach((name, idx) => {

            // 인덱스별 등장 횟수 누적용 map 초기화
            if (!positions[name]) {
                positions[name] = {
                    0: 0, 1: 0, 2: 0,
                    3: 0, 4: 0, 5: 0,
                    6: 0, 7: 0, 8: 0,
                };
            }
            positions[name][idx] += 1;
        });
    });

    // 라인 별 출전 횟수 카운트
    const lineBuckets: Record<"전열" | "중열" | "후열", number[]> = {
        전열: [0, 1, 2],
        중열: [3, 4, 5],
        후열: [6, 7, 8],
    };

    const lineTotals: Record<"전열" | "중열" | "후열", number> = {
        전열: 0, 중열: 0, 후열: 0
    };

    for (const name in positions) {
        for (const line of ["전열", "중열", "후열"] as const) {
            lineTotals[line] += lineBuckets[line]
                .reduce((sum, idx) => sum + (positions[name][idx] || 0), 0);
        }
    }

    // 가나다순 정렬
    const categories = Object.keys(counts).sort((a, b) => a.localeCompare(b, 'ko'));

    // 차트 데이터 형식으로 변환
    const chartData: EnrichedFrontierChartData[] = categories.map((name) => {
        const info = (charInfo as Record<string, any>)[name] || {};
        const count = counts[name];

        const percentByLine = {
            전열: lineTotals.전열
                ? lineBuckets.전열.reduce((sum, idx) => sum + (positions[name][idx] || 0), 0) / lineTotals.전열 * 100
                : 0,
            중열: lineTotals.중열
                ? lineBuckets.중열.reduce((sum, idx) => sum + (positions[name][idx] || 0), 0) / lineTotals.중열 * 100
                : 0,
            후열: lineTotals.후열
                ? lineBuckets.후열.reduce((sum, idx) => sum + (positions[name][idx] || 0), 0) / lineTotals.후열 * 100
                : 0,
        };

        return {
            name,
            count,
            percent: Math.round((counts[name] / total) * 100 * 10) / 10,
            personality: info.personality,
            line: info.line,
            positions: positions[name],
            percentByLine
        };
    });

    return chartData;
}

export function processFrontierPickData<T extends FrontierSeasonData | FrontierExternalData>
    (data: T, prevData: T) {

        

}