import { useQuery } from "@tanstack/react-query";
import { ClashSummary } from "../types/clashTypes";
import { ClashV2Summary } from "../types/clashV2Types";
import { FrontierSummary } from "../types/frontierTypes";
import { LatestData } from "../types/latestTypes";
import { TrickcalRaidEn } from "../types/trickcalTypes";


const fetchSummaryData = async (type: TrickcalRaidEn | 'latest') => {

    const typeDir = type === 'clashV2' ? 'clash_v2' : type

    let response = await fetch(`/data/${typeDir}/summaries.json`);

    // 처음에 null로 해놓는 것보다 예외적인 부분에서만 덮어씌우는 방식이 낫다고 함
    if (type === 'latest') {
        response = await fetch(`/data/latest.json`);
    }

    if (!response.ok) {
        console.log(`시즌 데이터를 찾을 수 없습니다.`);
    }

    return response.json();
};

export const useSummaryData = <T extends ClashSummary | FrontierSummary | ClashV2Summary | LatestData>
    (type: TrickcalRaidEn | 'latest') => {

    return useQuery<T, Error>({
        queryKey: ["summary", type],
        queryFn: () => fetchSummaryData(type),

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