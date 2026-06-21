type TimelineNodeType = "character" | "clash" | "clashV2" | "frontier";

export interface TimelineNode {
    type: TimelineNodeType;
    name: string;
    personality?: string;
    startDate: string; // 사도 출시일 혹은 레이드 시작일
    endDate?: string; // 레이드 종료일
}

export type TimelineMap = Record<string, TimelineNode[]>;