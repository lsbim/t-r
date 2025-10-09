export interface ResearchSimRequest {
    type: 'research';
    currentTier: number;
    currentStep: number;
    target: {
        tier: number;
        step: number;
    }
}

export interface FacilitySimRequest {
    type: 'facility';
    currentLab: number;
    currentHall: number;
    currentHq: number;
    currentAdv: number;
    target: {
        lab: number;
        hall: number;
        hq: number;
        adv: number;
    }
}

export interface SimResponse {
    gold?: number;
    krName: string;
    name: string;
    numlvl: number;
    result: SimResult
}

export interface SimResult {
    acquisitionPlans: (MaterialAcquisitionPlan | null)[],
    finalAdventureRuns?: Map<string, { min: number, max: number }>,
    inventory?: Map<string, number>
}

// 모험 수행 결과를 담는 인터페이스
export interface AdventureRequirement {
    adventureName: string;         // 수행할 모험 이름
    targetMaterial: string;        // 목표 재료 이름
    requiredAdvLvl: number;        // 필요한 모험회 레벨
    estimatedRuns: { min: number; max: number };         // 예상 수행 횟수
    efficiency: number;            // 효율성 점수
}

// 재료 획득 계획을 담는 인터페이스
export interface MaterialAcquisitionPlan {
    material: string;              // 재료 이름
    quantity: number;              // 필요한 수량
    method: 'adventure' | 'craft' | 'inventory'; // 획득 방법 (모험 or 제작 or 인벤토리)
    adventures?: AdventureRequirement[];  // 모험으로 획득하는 경우
    craftingMaterials?: MaterialAcquisitionPlan[]; // 제작하는 경우 필요한 하위 재료들
}
