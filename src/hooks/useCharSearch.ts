import { useMemo } from "react";
import { charInfo } from "../data/trickcalChar";
import { parseResonanceBaseName } from "../utils/chartFunction";
import { matchesSearchTerm } from "../utils/searchFunction";

interface CharSearchProps {
    search: string;
    showAllWhenEmpty: boolean;
}

export const useCharSearch = ({ search, showAllWhenEmpty = true }: CharSearchProps) => {

    const searchData = useMemo(() => {
        return Object.keys(charInfo).filter(key => !parseResonanceBaseName(key));
    }, []);

    const searchList = useMemo(() => {
        const term = search.trim().toLowerCase().replace(/\s+/g, "");
        if (!term) return showAllWhenEmpty ? searchData : [];

        return searchData.filter(key => matchesSearchTerm(key, term));
        
    }, [search, searchData, showAllWhenEmpty]);

    return searchList;
};