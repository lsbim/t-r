import { useQuery } from "@tanstack/react-query";
import { ClashBase } from "../types/clashTypes";
import { FrontierBase } from "../types/frontierTypes";


const fetchNonData = async (key: 'clash' | 'frontier') => {

    const response = await fetch(`/data/${key}/non_data.json`);

    if (!response.ok) {
        throw new Error(`데이터를 찾을 수 없습니다.`);
    }

    return response.json();
};

export const useNonData = <T extends ClashBase | FrontierBase>(key: 'clash' | 'frontier') => {

    return useQuery<T, Error>({
        queryKey: [`non_data_${key}`],
        queryFn: () => fetchNonData(key),

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