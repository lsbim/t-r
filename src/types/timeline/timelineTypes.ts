import { Personality } from "../trickcalTypes";

export type TimelineNodeType = "character" | "clash" | "clashV2" | "frontier";

export interface TimelineNode {
    type: TimelineNodeType;
    name: string;
    personality: Personality | null;
}

export interface RaidNode extends TimelineNode {
    startDate: string;
    endDate: string;
}

export interface CharacterNode extends TimelineNode {
    birthDate: string;
}

export type TimelineMap = Record<string, (RaidNode | CharacterNode)[]>;