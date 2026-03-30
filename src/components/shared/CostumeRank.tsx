import React from "react";
import { ClashSeasonData } from "../../types/clashTypes";
import { ClashV2SeasonData } from "../../types/clashV2Types";
import { FrontierSeasonData } from "../../types/frontierTypes";
import { CostumeStat, processCostumeData, ProcessedCostumeData } from "../../utils/costumeFunction";

const CostumeRank = (
    { data }:
        { data: ClashSeasonData | FrontierSeasonData | ClashV2SeasonData }
) => {


    const cosRankData: ProcessedCostumeData = processCostumeData(data)
    // console.log(cosRankData)

    return (
        <div>

        </div>
    );
}

export default React.memo(CostumeRank);