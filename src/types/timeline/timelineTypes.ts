import { Personality } from "../trickcalTypes";

export type TimelineNodeType = "character" | "clash" | "clashV2" | "frontier";

export interface TimelineNode {
    type: TimelineNodeType;
    name: string;
    personality: Personality | null;
}

export interface RaidNodeBase extends TimelineNode {
    startDate: string;
    endDate: string;
    season: string;
}

export interface ClashNode extends RaidNodeBase {
    type: "clash";
    rules: string[];
}

export interface ClashV2Node extends RaidNodeBase {
    type: "clashV2";
    rules: string[];
    sideSkills: string[];
}

export interface FrontierNode extends RaidNodeBase {
    type: "frontier";
    power: number[];
}

export type RaidNode = ClashNode | ClashV2Node | FrontierNode;

export interface CharacterNode extends TimelineNode {
    birthDate: string;
}

export type TimelineMap = Record<string, (RaidNode | CharacterNode)[]>;

export function isCharacterNode(node: CharacterNode | RaidNode): node is CharacterNode {
    return node.type === "character";
}

export function isRaidNode(node: CharacterNode | RaidNode): node is RaidNode {
    return node.type === "clash" || node.type === "clashV2" || node.type === "frontier";
}