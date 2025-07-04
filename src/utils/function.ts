import { charInfo } from "../data/trickcalChar";
import { clashPlayerData } from "../types/clashTypes";
import { FrontierPlayerData } from "../types/frontierTypes";
import { Personality, SynergyItem } from "../types/trickcalTypes";

// // 랭킹 데이터를 차트 데이터로 변환
// export interface EnrichedChartData {
//     name: string;
//     percent: number;
//     count: number;
//     personality: string;
//     line: string;
//     positions: Record<number, number>;
//     percentByLine: Record<"전열" | "중열" | "후열", number>;  // 추가
// }

// // 범용은 제네릭으로
// export function processRankingArrData(data: Array<clashPlayerData | FrontierPlayerData>): EnrichedChartData[] {
//     const all: string[] = data.flatMap(d => d.arr);
//     const total = all.length; // 최대 900

//     // { 벨라: 17.3 }
//     const counts: { [key: string]: number } = all.reduce((acc: { [key: string]: number }, name: string) => {
//         acc[name] = (acc[name] || 0) + 1;
//         return acc;
//     }, {}); // 초기값으로 빈 객체를 전달합니다.

//     // 몇번째 인덱스에 위치했는지 기록
//     const positions: Record<string, Record<number, number>> = {};
//     data.forEach(({ arr }, index) => {
//         arr.forEach((name, idx) => {

//             // 인덱스별 등장 횟수 누적용 map 초기화
//             if (!positions[name]) {
//                 positions[name] = {
//                     0: 0, 1: 0, 2: 0,
//                     3: 0, 4: 0, 5: 0,
//                     6: 0, 7: 0, 8: 0,
//                 };
//             }
//             positions[name][idx] += 1;

//             if(name === "벨라" && (idx == 6 || idx == 7 || idx == 8)){
//                 console.log(arr, index)
//             }
//         });
//     });

//     // 라인 별 출전 횟수 카운트
//     const lineBuckets: Record<"전열" | "중열" | "후열", number[]> = {
//         전열: [0, 1, 2],
//         중열: [3, 4, 5],
//         후열: [6, 7, 8],
//     };

//     const lineTotals: Record<"전열" | "중열" | "후열", number> = {
//         전열: 0, 중열: 0, 후열: 0
//     };

//     for (const name in positions) {
//         for (const line of ["전열", "중열", "후열"] as const) {
//             lineTotals[line] += lineBuckets[line]
//                 .reduce((sum, idx) => sum + (positions[name][idx] || 0), 0);
//         }
//     }

//     // 가나다순 정렬
//     const categories = Object.keys(counts).sort((a, b) => a.localeCompare(b, 'ko'));

//     // 차트 데이터 형식으로 변환
//     const chartData: EnrichedChartData[] = categories.map((name) => {
//         const info = (charInfo as Record<string, any>)[name] || {};
//         const count = counts[name];

//         const percentByLine = {
//             전열: lineTotals.전열
//                 ? lineBuckets.전열.reduce((sum, idx) => sum + (positions[name][idx] || 0), 0) / lineTotals.전열 * 100
//                 : 0,
//             중열: lineTotals.중열
//                 ? lineBuckets.중열.reduce((sum, idx) => sum + (positions[name][idx] || 0), 0) / lineTotals.중열 * 100
//                 : 0,
//             후열: lineTotals.후열
//                 ? lineBuckets.후열.reduce((sum, idx) => sum + (positions[name][idx] || 0), 0) / lineTotals.후열 * 100
//                 : 0,
//         };

//         return {
//             name,
//             count,
//             percent: (counts[name] / total) * 100,
//             personality: info.personality,
//             line: info.line,
//             positions: positions[name],
//             percentByLine
//         };
//     });

//     return chartData;
// }

interface CompStat {
    rank: number;           // JSON.stringify(arr) 로 만든 유니크 키
    count: number;          // 이 조합이 몇 번 등장했는지
    front: string[];       // 전열(0,1,2)에 사용된 멤버들 (0,1,2 위치 캐릭터)
    mid: string[];       // 중열(3,4,5)
    back: string[];       // 후열(6,7,8)
}

export function processCompStat(data: clashPlayerData[] | FrontierPlayerData[], select?: string): CompStat[] {
    // 조합별 집계(맵) 준비
    const map = new Map<
        string,
        { count: number; front: string[]; middle: string[]; back: string[] }
    >();

    for (const { arr } of data) {
        // JSON 키 생성 (순서와 위치 포함해서 완전 동일한 조합만 묶임)
        const frontArr = arr.slice(0, 3).sort();
        const middleArr = arr.slice(3, 6).sort();
        const backArr = arr.slice(6, 9).sort();

        const key =
            JSON.stringify(frontArr) + '|' +
            JSON.stringify(middleArr) + '|' +
            JSON.stringify(backArr);

        if (!map.has(key)) {
            map.set(key, { count: 0, front: [], middle: [], back: [] });
        }

        const stat = map.get(key)!;
        stat.count += 1;
    }

    // 배열로 변환해서, 등장빈도 순(내림차순)으로 정렬
    const allStats = Array.from(map.entries())
        .sort(([, a], [, b]) => b.count - a.count)
        .map(([key, { count }], idx) => {
            // compositeKey에서 다시 front/middle/back 복원
            const [f, m, b] = key.split('|').map(s => JSON.parse(s) as string[]);
            return {
                rank: idx + 1,
                count,
                front: f,
                mid: m,
                back: b,
            };
        });

    if (select) {
        return allStats.filter(
            ({ front, mid, back }) =>
                front.includes(select) ||
                mid.includes(select) ||
                back.includes(select)
        );
    }

    return allStats;
}

export function findPersonalityByName(name: string) {
    return charInfo[name]?.personality;
}

const SYNERGY_THRESHOLDS = [2, 4, 6, 7, 9, 10, 11];

// 2) 반환할 통계 타입
export interface SynergyStat {
    rank: number;                   // 1위, 2위…
    count: number;                   // 이 시너지 조합이 몇 번 나왔는지
    synergy: SynergyItem[];
}

// 3) 시너지 통계 함수
export function processSynergyStats(
    data: clashPlayerData[] | FrontierPlayerData[]
): SynergyStat[] {
    // Map< key, { count, synergy } >
    const map = new Map<string, { count: number; synergy: SynergyStat["synergy"] }>();

    for (const { arr } of data) {
        // 3.1) 각 조합의 성격별 빈도 계산
        const freq = arr.reduce<Record<string, number>>((acc, charName) => {
            const p = (charInfo as Record<string, any>)[charName]?.personality;
            if (p) acc[p] = (acc[p] || 0) + 1;
            return acc;
        }, {});

        // 3.2) 시너지 발동된 항목만 뽑아서 리스트로
        const synergyList: SynergyItem[] = Object.entries(freq)
            .filter(([, qty]) => SYNERGY_THRESHOLDS.includes(qty))
            .map(([personality, qty]) => ({ personality: personality as Personality, qty }))
            // 정렬해서 key가 일관되게
            .sort((a, b) => a.personality.localeCompare(b.personality, "ko"));

        // 3.3) 키 생성 (JSON.stringify 로 간편하게)
        const key = JSON.stringify(synergyList);

        // 3.4) Map 에 누적
        if (!map.has(key)) {
            map.set(key, { count: 0, synergy: synergyList });
        }
        map.get(key)!.count += 1;
    }

    // 4) Map → 배열, 횟수 내림차순 정렬, rank 부여
    return Array.from(map.entries())
        .sort(([, a], [, b]) => b.count - a.count)
        .map(([key, { count, synergy }], idx) => ({
            rank: idx + 1,
            count,
            synergy: JSON.parse(key) as SynergyStat["synergy"]
        }));
}