export interface GachaInput {
    startDate: string;
    endDate: string;

    spend: {
        candyCharge: number;
        starCandyCharge: number;
    }

    pass: { // 패스 구매 여부
        trickcalPass: boolean; // 트릭컬 패스
        skinPass: boolean; // 사복 패스
        gemPass: boolean; // 데일리 엘리프 공물
        starCandyPass: boolean; // 데일리 별사탕 공물
    }

    raid: { // 레이드 지역보상, 시즌보상
        clash: {
            stage: number;
            reward: number;
        };
        clashV2: {
            stage: number;
            reward: number;
        };
        frontier: {
            // 프론티어는 스테이지 클리어 보상에 엘리프 X
            coin: number;
            reward: number;
        };
    }

    pvp: {
        maxRank: number; // n찍
        rewardRank: number; // 시즌 보상 순위
    }

    shop: {
        dailyGem: boolean;
        weeklyGem: boolean;
        monthlyGem: boolean;

        productCheck: boolean; // 상품 확인 시 10 엘리프 제공
    }

    character: {
        interview: boolean; // 사도 면접
    }

    archive: boolean; // 기록소 엘리프 수령 여부
}