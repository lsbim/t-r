export interface ClashInput {
    stage: number;
    rewardRank: number;
}

export interface GachaInput {
    startDate: string;
    endDate: string;

    spend: {
        candyCharge: number;
        starCandyCharge: number;
    }

    pass: { // 패스 구매 여부
        trickcalPass: boolean; // 트릭컬 패스
        trickcalPassFigure: boolean; // 트릭컬 패스 피규어(비싼거)
        skinPass: boolean; // 사복 패스
        gemPass: boolean; // 데일리 엘리프 공물
        starCandyPass: boolean; // 데일리 별사탕 공물
    }

    raid: { // 레이드 지역보상, 시즌보상
        clash: ClashInput;
        clashV2: ClashInput;
        frontier: {
            // 프론티어는 스테이지 클리어 보상에 엘리프 X
            rewardRank: number;
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

        // 레비(졸업) 기준 사도 출시 패키지 15개, 사복 1개
        productCheck: boolean; // 상품 확인 시 10 엘리프 제공

        nice: boolean;
    }

    character: {
        interview: boolean; // 사도 면접
    }

    archive: boolean; // 기록소 엘리프 수령 여부
}

export interface GachaResult {
    lines: ReceiptLine[];    // 고정 순서 보장된 영수증 라인들
    totalGem: number;        // 총 무료 엘리프
    totalPaidGem: number;   // 총 무료 엘리프
    totalTicket: number;     // 총 티켓 
    totalTicketFrag: number; // 총 티켓조각
}

export interface RotationPhase {
    label: string;          // 'clash' | 'frontier' | 'rest' ...
    durationDays: number;   // 이 페이즈가 며칠 동안 지속되는가
    isActive: boolean;      // false면 휴식 기간 (보상 없음)
}

export interface RotationSchedule {
    epochDate: string;      // 첫 번째 페이즈가 시작된 기준 날짜
    phases: RotationPhase[];
}

export interface ReceiptLine {
    id: string;
    label: string;
    gem: number;              // 무료 엘리프
    paidGem?: number;         // 유료 엘리프
    ticket: number;           // 티켓
    ticketFragment: number;   // 티켓조각
}

export interface ReceiptEntry {
    id: string,
    compute: (input: GachaInput, days: number, weeks: number) => ReceiptLine | null;
};

export interface RewardTier {
    rank: number; // 상위 N% / N위
    gem: number;
}

export interface RaidGemResult {
    stageGem: number;
    seasonGem: number;
}

// 레이드 컨텐츠 페이즈 추적용
export interface PhaseOccurrence {
    effectiveStart: Date; // 실질적인 시작일 (프론티어는 금요일, 나머지는 목요일)
    phaseEnd: Date;       // 페이즈 마지막 날 (수요일로 처리)
    restStart: Date;      // 다음 휴식 첫날 = 시즌 보상 수령일 (목요일)
}