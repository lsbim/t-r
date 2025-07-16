import { useQuery } from "@tanstack/react-query";
import { ClashSummary } from "../types/clashTypes";
import { FrontierSummary } from "../types/frontierTypes";


const fetchNonData = async () => {

    const response = await fetch(`/data/clash/non_data.json`);

    if (!response.ok) {
        console.log(`데이터를 찾을 수 없습니다.`);
    }

    return response.json();
};

export const useNonData = <T extends ClashSummary | FrontierSummary>() => {

    return useQuery<any, Error>({
        queryKey: ["non_data"],
        queryFn: async () => {
            const rawData = await fetchNonData();
            return processNonData(rawData);
        },

        // 데이터가 한 번 로드되면 거의 변하지 않으므로 긴 캐시 시간 설정
        staleTime: 1000 * 60 * 60, // 1시간동간 fresh상태. 재요청이 필요없는 상태
        gcTime: 1000 * 60 * 60, // 1시간동안 메모리에 유지. 이후 GC가 처형

        // 백그라운드에서 리페치 비활성화 (정적 데이터이므로)
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,

        // 재시도 설정 (네트워크 문제나 일시적 오류 대응)
        retry: 1,
    });
};

function processNonData(data: ClashSummary | FrontierSummary) {

    console.log(data)

    return data;
}