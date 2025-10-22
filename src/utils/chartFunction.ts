import { charInfo } from "../data/trickcalChar";
import { ClashExternalData, clashPlayerData, ClashSeasonData } from "../types/clashTypes";
import { externalData, FrontierExternalData, FrontierPlayerData, FrontierSeasonData } from "../types/frontierTypes";
import { AllLine, BaseLine, ExternalSummaryData, Personality, SummaryData, SynergyItem } from "../types/trickcalTypes";

// 범용은 제네릭으로

const lineBuckets: Record<BaseLine, number[]> = {
    전열: [0, 1, 2],
    중열: [3, 4, 5],
    후열: [6, 7, 8],
};

export function processRankingArrData(
    data: Array<clashPlayerData | FrontierPlayerData>
): SummaryData[] {
    // 1) 먼저 이름별 positions 집계 (기존대로)
    const positions: Record<string, Record<number, number>> = {};
    data.forEach(({ arr }) => {
        arr.forEach((name, idx) => {
            if (!positions[name]) {
                positions[name] = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
            }
            positions[name][idx] += 1;
        });
    });

    // 2) 이름별 전체 count & 총합 계산
    const totalCount = Object.values(positions)
        .flatMap(pos => Object.values(pos))
        .reduce((a, b) => a + b, 0);

    // 3) 이제 이름 × 라인별 SummaryData 생성
    const result: SummaryData[] = [];

    for (const name in positions) {
        const pos = positions[name];
        const info = charInfo[name] || { personality: "", line: "전열" as BaseLine };

        for (const line of (Object.keys(lineBuckets) as BaseLine[])) {
            // 해당 라인 인덱스들의 합
            const lineCnt = lineBuckets[line].reduce((sum, idx) => sum + (pos[idx] || 0), 0);
            if (lineCnt === 0) continue;  // 등장하지 않았으면 건너뜀

            const percent = Math.round((lineCnt / totalCount) * 100 * 10) / 10;

            // SummaryData 타입에 맞춰
            result.push({
                name,
                count: lineCnt,
                percent,
                personality: info.personality,
                line,                 // 전열 | 중열 | 후열
                positions: pos,       // 기존 positions 전체 맵을 그대로 붙이셔도 되고
                percentByLine: {      // 전열/중열/후열 비율 (옵션)
                    전열: 0, 중열: 0, 후열: 0
                }
            });
        }
    }

    // 4) 가나다순, 혹은 퍼센트 내림차순 정렬
    return result;
}

export interface CompStat {
    rank: number;           
    count: number;          // 이 조합이 몇 번 등장했는지
    front: string[];       // 전열(0,1,2)에 사용된 멤버들 (0,1,2 위치 캐릭터)
    mid: string[];       // 중열(3,4,5)
    back: string[];       // 후열(6,7,8)
}

export function processExternalData(data: ClashExternalData | FrontierExternalData): ExternalSummaryData[] {
    // 출전 횟수 합산
    const total = data.data.reduce((sum, it) => sum + it.count, 0);

    // 2) 가나다순 정렬
    const sorted = data.data.slice().sort((a, b) =>
        a.name.localeCompare(b.name, 'ko')
    );

    // 3) SummaryData 배열로 매핑
    return sorted.map(item => {
        const { name, count, line } = item;
        const percent = total ? Math.round((count / total) * 100 * 10) / 10 : 0;

        // charInfo 에서 personality 등 가져오기 (없으면 빈 문자열)
        const info = charInfo[name] || {};

        return {
            name,
            count,
            percent,
            personality: info.personality,
            line: line as AllLine, // 혹은 item.line
        };
    });
}

export function processCompStat(data: clashPlayerData[] | FrontierPlayerData[], select?: string): CompStat[] {
    // 조합별 집계(맵) 준비
    const map = new Map<
        string,
        { count: number; front: string[]; middle: string[]; back: string[] }
    >();

    for (const { arr } of data) {
        // 전중후열 단위로 쪼개기 (sort로 인해 배열 내 문자들을 알파벳 순서로 정렬하여 모두 같은 순서가 됨)
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

// 성격 시너지의 기준. 2세트 4세트 6세트 ...
const SYNERGY_THRESHOLDS = [2, 4, 6, 7, 9, 10, 11];

// 2) 반환할 통계 타입
export interface SynergyStat {
    rank: number;                   // 1위, 2위…
    count: number;                   // 이 시너지 조합이 몇 번 나왔는지
    synergy: SynergyItem[];
}

function mapToThreshold(qty: number): number | null {
    // qty 보다 작거나 같은 기준치만 필터
    const candidates = SYNERGY_THRESHOLDS.filter(t => t <= qty); // 3이면 2, 5면 4 반환.
    if (candidates.length === 0) return null; // 적용할 시너지 없음
    return candidates[candidates.length - 1];   // 가장 큰 값
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
            .map(([personality, qty]) => {
                const applied = mapToThreshold(qty);
                return applied !== null
                    ? { personality: personality as Personality, qty: applied }
                    : null;
            })
            .filter((x): x is SynergyItem => x !== null)
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

type PersonalityPieData = { [k in Personality]?: number };

export function processPersonalityPie(data: clashPlayerData[] | FrontierPlayerData[] | externalData[]) {

    if (!data) return;

    // console.log(data);

    const personalityData: PersonalityPieData = {};

    for (const user of data) {
        // console.log(user);

        // 내가 수집한 자료일 때
        if ('arr' in user) {

            // 캐릭터 배열 순회하며 성격 수++
            for (const name of user.arr) {
                const persty = charInfo[name].personality;
                // null 또는 undefined 라면 0 할당
                personalityData[persty] = (personalityData[persty] ?? 0) + 1;
            }
        } else {
            // 제공받은 자료일 때
            const persty = charInfo[user?.name].personality;
            personalityData[persty] = (personalityData[persty] ?? 0) + user?.count;
        }

    }
    // console.log(personalityData);
    // console.log(Object.values(personalityData).reduce((a, b) => a + b, 0));

    return personalityData;
}