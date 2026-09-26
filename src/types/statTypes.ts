import { AllLine, BaseLine } from "./trickcalTypes";

export interface PickRankData {
    name: string;
    rates: number[];
    weightScore: number;
}
export type PickRank = {
    [k in BaseLine]: PickRankData[]
}

export type SelectChara = {
    name: string;
    line: AllLine
}