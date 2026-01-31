import { charInfo } from "../data/trickcalChar";
import { ClashExternalData, ClashPlayerData } from "../types/clashTypes";
import { ClashV2PlayerData } from "../types/clashV2Types";
import { externalData, FrontierExternalData, FrontierPlayerData } from "../types/frontierTypes";
import { AllLine, BaseLine, ExternalSummaryData, Personality, SummaryData, SynergyItem } from "../types/trickcalTypes";

// 범용은 제네릭으로

const lineBuckets: Record<BaseLine, number[]> = {
    전열: [0, 1, 2],
    중열: [3, 4, 5],
    후열: [6, 7, 8],
};

// AllPickRateChart 전용.
// 인덱스가 아닌 이름별로 카운트를 세어 반환
export function processRankingArrAllData(
    data: Array<ClashPlayerData | FrontierPlayerData | ClashV2PlayerData>,
    type?: 'side'
): SummaryData[] {
    // console.log(data)

    // 이름별 positions 집계
    const charCnt: Record<string, number> = {};
    const targetData = (user: any) => {
        if (type === 'side' && 'sideArr' in user) return user.sideArr;
        return user.arr;
    };

    data.forEach((user) => {
        const arr = targetData(user);

        arr.forEach((name: string, idx: number) => {
            if (!charCnt[name]) {
                charCnt[name] = 0;
            }
            charCnt[name]++;
        });
    });


    // 이름별 전체 count & 총합 계산
    const totalCount = Object.values(charCnt)
        .reduce((a, b) => a + b, 0);

    // 이제 이름 × 라인별 SummaryData 생성
    const result: SummaryData[] = [];

    for (const name in charCnt) {
        const cnt = charCnt[name];
        const info = charInfo[name];

        const percent = Math.round((cnt / totalCount) * 100 * 10) / 10;

        // SummaryData 타입에 맞춰
        result.push({
            name,
            count: cnt,
            percent,
            personality: info.personality,
            line: info.line,
            percentByLine: {
                전열: 0, 중열: 0, 후열: 0
            }
        });
    }

    return result;
}

// PickRateChart 전용.
// 9인 조합 기준
export function processRankingArrData(
    data: Array<ClashPlayerData | FrontierPlayerData | ClashV2PlayerData>,
    type?: 'side'
): SummaryData[] {


    // 1) 먼저 이름별 positions 집계 (기존대로)
    const positions: Record<string, Record<number, number>> = {};

    const targetData = (user: any) => {
        if (type === 'side' && 'sideArr' in user) return user.sideArr;
        return user.arr;
    };

    data.forEach((user) => {
        const arr = targetData(user);
        if (!arr) return;

        arr.forEach((name: string, idx: number) => {
            if (!positions[name]) {
                positions[name] = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
            }
            positions[name][idx] += 1;

            if (import.meta.env.DEV) {
                const info = charInfo[name];
                if (info) {
                    let expectedLine: BaseLine | null = null;
                    let actualLine: BaseLine | null = null;

                    if (idx <= 2) actualLine = "전열";
                    else if (idx <= 5) actualLine = "중열";
                    else actualLine = "후열";

                    if (info.line !== "모든열") {
                        expectedLine = info.line as BaseLine;

                        // 사도 정보의 line과 라인인덱스가 다르면 로그
                        if (expectedLine !== actualLine) {
                            console.warn(
                                `⚠️ [Line Mismatch] Rank ${user.rank || '?'}: ${name} (${expectedLine}) -> 실제위치: ${actualLine} (idx: ${idx})`
                            );
                        }
                    }
                }
            }
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

    return result;
}

// PickRateChart 전용. 차원대충돌 2.0 전용.
// 위치를 인덱스가 아닌 사도 정보의 line으로 입력한다
// 조합 구성이 9인 미만일 경우 포지션(위치)은 제외한다
export function processRankingArrDataV2(
    data: Array<ClashPlayerData | FrontierPlayerData | ClashV2PlayerData>,
    type?: 'side'
): SummaryData[] {

    const aggMap = new Map<string, {
        name: string;
        line: BaseLine;
        count: number;
        positions: Record<number, number>;
    }>();

    let totalCount = 0;

    const targetData = (user: any) => {
        if (type === 'side' && 'sideArr' in user) return user.sideArr;
        return user.arr;
    };

    data.forEach((user) => {
        const arr = targetData(user);
        if (!arr) return;

        const isFullParty = arr.length === 9;

        // 조합이 9인 미만일 경우 로그
        if (!isFullParty && import.meta.env.DEV) {
            console.log(`[Position Skip] Rank ${user.rank || '?'} : ${arr.length}명 편성으로 위치 집계 제외`);
            console.log(`>>> ${arr}`);
        }

        arr.forEach((name: string, idx: number) => {
            totalCount++;

            const info = charInfo[name];
            if (!info) return;

            let targetLine: BaseLine;
            if (info.line === "모든열") {
                if (idx <= 2) targetLine = "전열";
                else if (idx <= 5) targetLine = "중열";
                else targetLine = "후열";
            } else {
                targetLine = info.line as BaseLine;
            }

            const key = `${name}|${targetLine}`;

            if (!aggMap.has(key)) {
                aggMap.set(key, {
                    name,
                    line: targetLine,
                    count: 0,
                    positions: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 }
                });
            }

            const entry = aggMap.get(key)!;

            entry.count += 1;

            if (isFullParty) {
                entry.positions[idx] += 1;
            }
        });
    });

    const result: SummaryData[] = [];
    aggMap.forEach((value) => {
        const { name, line, count, positions } = value;
        const info = charInfo[name];
        const percent = totalCount > 0
            ? Math.round((count / totalCount) * 100 * 10) / 10
            : 0;

        result.push({
            name,
            count,
            percent,
            personality: info?.personality || "",
            line,
            positions,
            percentByLine: { 전열: 0, 중열: 0, 후열: 0 }
        });
    });

    return result;
}

export interface CompStat {
    rank: number;
    count: number;          // 이 조합이 몇 번 등장했는지
    front: string[];       // 전열(0,1,2)에 사용된 멤버들 (0,1,2 위치 캐릭터)
    mid: string[];       // 중열(3,4,5)
    back: string[];       // 후열(6,7,8)
}

// AllPickRateChart 전용. '모든열' 사도의 출전횟수를 모두 더함
export function processExternalAllData(data: ClashExternalData | FrontierExternalData): ExternalSummaryData[] {

    const groupedByName = data.data.reduce((acc, item) => {
        const existing = acc.get(item.name);
        if (existing) {
            // 이미 존재하는 사도면 count를 합산하고, 라인이 다르면 '모든열'로 변경
            existing.count += item.count;
            if (existing.line !== item.line) {
                existing.line = '모든열';
            }
        } else {
            // 새로운 사도면 추가
            acc.set(item.name, { ...item });
        }
        return acc;
    }, new Map());

    // 출전 횟수 합산
    const total = Array.from(groupedByName.values()).reduce((sum, it) => sum + it.count, 0);

    // 3) SummaryData 배열로 매핑
    const result = Array.from(groupedByName.values()).map(item => {
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

    return result;
}


export function processExternalData(data: ClashExternalData | FrontierExternalData): ExternalSummaryData[] {
    // 출전 횟수 합산
    const total = data.data.reduce((sum, it) => sum + it.count, 0);

    // 3) SummaryData 배열로 매핑
    const result = data.data.map(item => {
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

    return result;
}

export function processCompStat(
    data: ClashPlayerData[] | FrontierPlayerData[] | ClashV2PlayerData[],
    select?: string,
    type?: 'side'
): CompStat[] {
    // 조합별 집계(맵) 준비
    const map = new Map<
        string,
        { count: number; front: string[]; middle: string[]; back: string[] }
    >();

    // const normalizeUros = (s: unknown) =>
    //     typeof s === 'string' && s.startsWith('우로스(') ? '우로스' : s;

    // console.log(type)
    for (const item of data) {
        // type 매개변수의 존재 여부에 따라 사용할 배열을 결정
        const targetArr = type && 'sideArr' in item ? item.sideArr : item.arr;

        // console.log(targetArr)

        // 전중후열 단위로 쪼개기 (sort로 인해 배열 내 문자들을 알파벳 순서로 정렬하여 모두 같은 순서가 됨)
        const frontArr = targetArr.slice(0, 3).sort();
        const middleArr = targetArr.slice(3, 6).sort();
        const backArr = targetArr.slice(6, 9).sort();

        // const frontArr = (targetArr.slice(0, 3).map(normalizeUros) as string[]).sort();
        // const middleArr = (targetArr.slice(3, 6).map(normalizeUros) as string[]).sort();
        // const backArr = (targetArr.slice(6, 9).map(normalizeUros) as string[]).sort();

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
    data: ClashPlayerData[] | FrontierPlayerData[] | ClashV2PlayerData[],
    type?: 'side'
): SynergyStat[] {
    // Map< key, { count, synergy } >
    const map = new Map<string, { count: number; synergy: SynergyStat["synergy"] }>();

    for (const item of data) {
        const targetArr = type && 'sideArr' in item ? item.sideArr : item.arr;

        // 3.1) 각 조합의 성격별 빈도 계산
        const freq = targetArr.reduce<Record<string, number>>((acc, charName) => {
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

export function processPersonalityPie(
    data: ClashPlayerData[] | FrontierPlayerData[] | externalData[] | ClashV2PlayerData[],
    type?: 'side'
) {

    if (!data) return;

    // console.log(data);

    const personalityData: PersonalityPieData = {};

    for (const user of data) {
        // console.log(user);

        // 내가 수집한 자료일 때
        if ('arr' in user) {
            if (type === 'side' && 'sideArr' in user) {
                // 캐릭터 배열 순회하며 성격 수++
                for (const name of user.sideArr) {
                    const persty = charInfo[name].personality;
                    // null 또는 undefined 라면 0 할당
                    personalityData[persty] = (personalityData[persty] ?? 0) + 1;
                }
            } else {
                // 캐릭터 배열 순회하며 성격 수++
                for (const name of user.arr) {
                    const persty = charInfo[name].personality;
                    // null 또는 undefined 라면 0 할당
                    personalityData[persty] = (personalityData[persty] ?? 0) + 1;
                }
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