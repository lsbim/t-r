import { useQuery } from "@tanstack/react-query";
import { ClashSummary } from "../types/clashTypes";
import { BaseLine, BaseSummary, TrickcalRaidEn } from "../types/trickcalTypes";
import { FrontierSummary } from "../types/frontierTypes";
import { charInfo } from "../data/trickcalChar";
import { PickRank } from "../types/statTypes";


const fetchSummaryData = async (type: TrickcalRaidEn) => {

    const response = await fetch(`/data/${type}/summary.json`);

    if (!response.ok) {
        throw new Error(`시즌 데이터를 찾을 수 없습니다.`);
    }

    return response.json();
};

export const useStatData = (type: TrickcalRaidEn) => {

    return useQuery<any, Error>({
        queryKey: ["stat", type],
        queryFn: async () => {
            const rawData = await fetchSummaryData(type);
            return processStatData(rawData);
        },

        // 데이터가 한 번 로드되면 거의 변하지 않으므로 긴 캐시 시간 설정
        staleTime: 1000 * 60 * 60, // 1시간동간 fresh상태. 재요청이 필요없는 상태
        gcTime: 1000 * 60 * 60, // 1시간동안 메모리에 유지. 이후 GC가 처형

        // (조건) 쿼리 실행하지 않음
        enabled: !!type,

        // 백그라운드에서 리페치 비활성화 (정적 데이터이므로)
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,

        // 재시도 설정 (네트워크 문제나 일시적 오류 대응)
        retry: 1,
    });
};

type CharPerformance = Record<string, Partial<Record<BaseLine, { rates: number[] }>>>;


function processStatData(data: ClashSummary | FrontierSummary): any {

    const recentSeason = Object.keys(data)
        .sort((a, b) => {
            const numA = Number(a);
            const numB = Number(b);

            // 베타시즌
            const isBetaA = numA >= 10000;
            const isBetaB = numB >= 10000;


            // 둘 다 일반 시즌인 경우: 숫자 순서대로 정렬
            if (!isBetaA && !isBetaB) {
                return numA - numB;
            }

            // 둘 다 베타 시즌인 경우: 숫자 순서대로 정렬
            if (isBetaA && isBetaB) {
                return numA - numB;
            }

            // 내림차순 기준, 10, 9, 8... 2, 1, 10002, 10001 순으로 정렬돼야 함
            if (!isBetaA && isBetaB) {
                return 1;
            } else {
                return -1;
            }
        })
        .slice(-5);

    console.log(recentSeason)

    const seasonLineTotals: Record<string, Record<BaseLine, number>> = {};


    recentSeason.forEach(seasonKey => {
        seasonLineTotals[seasonKey] = { '전열': 0, '중열': 0, '후열': 0 };
        for (const info of (data as any)[seasonKey].summary) {

            // console.log("entry: ", entry.count)

            seasonLineTotals[seasonKey][info.line as BaseLine] += info.count;
        }
    });

    const charPerformance: CharPerformance = {};

    // 캐릭터별 객체 선언
    recentSeason.forEach((seasonKey, seasonIndex) => {
        for (const info of (data as any)[seasonKey].summary) {
            const { name, line, count } = info as BaseSummary;
            const lineTotal = seasonLineTotals[seasonKey][line as BaseLine] / 3;


            if (charInfo[name] && (data as any)[seasonKey].startDate <= charInfo[name].birthdate) {
                continue;
            }

            if (lineTotal > 0) {
                const pickRate = Math.round((count / lineTotal) * 100 * 10) / 10;
                if (!charPerformance[name]) charPerformance[name] = {};
                if (!charPerformance[name]![line]) {
                    charPerformance[name]![line] = { rates: Array(5).fill(0) };
                }

                charPerformance[name]![line]!.rates[seasonIndex] = pickRate;
            }
        }
    })

    // 가중평균
    // const weights = [1, 1, 1.1, 1.1, 1.2];
    // 전부 1
    const weights = [1, 1, 1, 1, 1];

    const lineData: PickRank = {
        전열: [],
        중열: [],
        후열: [],
    };

    for (const name in charPerformance) {
        for (const line in charPerformance[name]) {
            const typedLine = line as BaseLine;
            const perfData = charPerformance[name][typedLine];
            let divideNum = 0;
            recentSeason.forEach((season) => {
                if ((data as any)[season].startDate >= charInfo[name].birthdate) {
                    divideNum++;
                }
            })

            if (perfData) {
                let weightScore = perfData.rates.reduce((sum, rate, index) => {
                    return sum + (rate * weights[index]);
                }, 0);

                // console.log(name, weightScore, divideNum);

                weightScore /= divideNum;

                lineData[typedLine].push({
                    name,
                    rates: perfData.rates,
                    weightScore
                });
            }
        }
    }

    for (const line in lineData) {
        lineData[line as BaseLine].sort((a, b) => b.weightScore - a.weightScore);
    }

    // console.log("recentSeason: ", recentSeason)
    // console.log("seasonLineTotals: ", seasonLineTotals)
    // console.log("charPerformance: ", charPerformance)
    // console.log("lineData: ", lineData)

    return lineData;
}