import { useQuery } from "@tanstack/react-query";
import { TrickcalRaidEn } from "../types/trickcalTypes";


const fetchCharData = async (name: string) => {
    if (!name) {
        console.log('유효하지 않은 사도 이름입니다.');
    }
    const response = await fetch(`/data/characters/${name}.json`);

    if (!response.ok) {
        console.log(`${name} 데이터를 찾을 수 없습니다.`);
    }

    return response.json();
};

export type CharacterPickRateData = {
    season: string;
    pickRate: number;
}
export type CharacterPickRateObj = {
    [K in TrickcalRaidEn]: CharacterPickRateData;
}
export type CharacterPickRateObjMulti = {
    [key: string]: CharacterPickRateObj;
}

export const useCharData = <CharacterPickRateData>
    (name: string | undefined) => {

    return useQuery<CharacterPickRateData, Error>({
        queryKey: [name, 'character'],
        queryFn: async () => {
            if (name === '우로스') {
                const result: { [key: string]: Promise<CharacterPickRateObj> } = {};
                const fivePers = ['순수', '냉정', '광기', '활발', '우울'];

                await Promise.all(
                    fivePers.map(async pers => {
                        try {
                            const data = await fetchCharData(`${name}(${pers})`);
                            result[pers] = data;
                        } catch (err) {
                        }
                    })
                );

                return result;
            }
            const data = fetchCharData(name!);

            return data;
        },


        // 데이터가 한 번 로드되면 거의 변하지 않으므로 긴 캐시 시간 설정
        staleTime: 1000 * 60 * 60 * 1, // 1시간동간 fresh상태. 재요청이 필요없는 상태
        gcTime: 1000 * 60 * 60 * 1, // 1시간동안 메모리에 유지. 이후 GC가 처형

        enabled: !!name,

        // 백그라운드에서 리페치 비활성화 (정적 데이터이므로)
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,

        // 재시도 설정 (네트워크 문제나 일시적 오류 대응)
        retry: 1,
    });
};