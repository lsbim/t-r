import { PatchCategory, PatchNote } from "../../data/patchNotes";
import { Personality } from "../trickcalTypes";

export type TimelineNodeType = "character" | "clash" | "clashV2" | "frontier" | "patchNote";

export interface TimelineNode {
    type: TimelineNodeType;
}

// 레이드 노드
export interface RaidNodeBase extends TimelineNode {
    startDate: string;
    endDate: string;
    season: string;
    name: string;
    personality: Personality | null;
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

// 사도 노드
export interface CharacterNode extends TimelineNode {
    birthDate: string;
    name: string;
    personality: Personality | null;
}

// 패치 노드
export interface PatchNoteItem {
    content: string;
    category?: PatchCategory;
    prevDays?: number;
}

export interface PatchNoteNode extends TimelineNode {
    type: "patchNote";
    date: string;
    items: PatchNoteItem[];
}

export type TimelineMap = Record<string, (RaidNode | CharacterNode | PatchNoteNode)[]>;

export function isCharacterNode(node: any): node is CharacterNode {
    return node.type === "character";
}

export function isRaidNode(node: any): node is RaidNode {
    return node.type === "clash" || node.type === "clashV2" || node.type === "frontier";
}