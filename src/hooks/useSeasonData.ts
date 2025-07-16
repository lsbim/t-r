import { useQuery } from "@tanstack/react-query";
import { TrickcalRaidEn } from "../types/trickcalTypes";
import { FrontierExternalData, FrontierSeasonData } from "../types/frontierTypes";
import { ClashExternalData, ClashSeasonData } from "../types/clashTypes";


const fetchSeasonData = async (season: string, type: TrickcalRaidEn) => {
    // 시즌 번호가 유효한지 먼저 확인
    const numSeason = Number(season)
    if (!season || numSeason < 1) {
        console.log('유효하지 않은 시즌 번호입니다.');
    }
    const response = await fetch(`/data/${type}/${numSeason}.json`);

    if (!response.ok) {
        console.log(`시즌 ${numSeason} 데이터를 찾을 수 없습니다.`);
    }

    return response.json();
};

export const useSeasonData = <T extends FrontierSeasonData | FrontierExternalData | ClashSeasonData | ClashExternalData>
    (season: string | undefined, type: TrickcalRaidEn) => {

    return useQuery<T, Error>({
        queryKey: [season, type],
        queryFn: () => fetchSeasonData(season!, type),


        // 데이터가 한 번 로드되면 거의 변하지 않으므로 긴 캐시 시간 설정
        staleTime: 1000 * 60 * 60 * 1, // 1시간동간 fresh상태. 재요청이 필요없는 상태
        gcTime: 1000 * 60 * 60 * 1, // 1시간동안 메모리에 유지. 이후 GC가 처형

        // 시즌 번호가 없으면 쿼리 실행하지 않음
        enabled: !!season,

        // 백그라운드에서 리페치 비활성화 (정적 데이터이므로)
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,

        // 재시도 설정 (네트워크 문제나 일시적 오류 대응)
        retry: 1,
    });
};