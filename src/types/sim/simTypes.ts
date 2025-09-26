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