export interface SimRequest {
    currentLab: number;
    currentAdv: number;
    currentHq: number;
    target: {
        lab?: number;
        adv?: number;
        hq?: number;
    }
}

export interface SimResponse {
    target: {
        name: string; // 시설 연구단계 등 컨텐츠 이름
        targetLvl: number;
        createTime?: string;
        researchTime?: string;
        gold?: number;
        materials: {
            name: string;
            qty: number;
            // 모험에서 캘 수 없는 재료라면 제작해야 한다(모험회 레벨 부족, 제작으로만 수급 가능 등)
            recipe?: { name: string; qty: number; adv: string; try: number; }[];
            adv?: {
                name: string;
                try: number
            };
        }[];
    }[];
    totalCreateTime?: string;
    totalResearchTime?: string;
    totalGold?: number;

    totalMaterials?: { name: string, qty: number }[];
    totalAdv?: { name: string, try: number }[];
    totalDays?: number;
}