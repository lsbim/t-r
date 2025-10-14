export interface SelectChar {
    cName: string;
    cLine: string;
}

// 사도 요약 데이터
export interface CharacterSeasonData {
    season: string;
    pickRate: number;
};

// 사도 요약 데이터
export interface CharacterSummaryData {
    [characterName: string]: {
        frontier?: CharacterSeasonData[];
        clash?: CharacterSeasonData[];
    };
};