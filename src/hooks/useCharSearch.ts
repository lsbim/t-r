import { useMemo } from "react";
import { disassemble, getChoseong } from "es-hangul";
import { charInfo } from "../data/trickcalChar";

interface CharSearchProps {
    search: string;
    showAllWhenEmpty: boolean;
}

export const useCharSearch = ({ search, showAllWhenEmpty = true }: CharSearchProps) => {

    const searchData = useMemo(() => {
        return Object.entries(charInfo)
            .filter(([key]) => !key.startsWith('우로스(')) // 성격별 우로스 제외
            .map(([key, info]) => {
                // i18n 도입 시 적용할 것
                // const allNames = [
                //     info.names.ko,
                //     info.names.en,
                //     info.names['zh-CN'],
                //     key
                // ].map(n => n?.toLowerCase().replace(/\s+/g, "") || "");

                return {
                    key,
                    // names: allNames,
                    choseong: getChoseong(key.replace(/\s+/g, ""))
                };
            });
    }, []);

    const searchList = useMemo(() => {
        const term = search.trim().toLowerCase().replace(/\s+/g, "");

        if (!term) return showAllWhenEmpty ? searchData.map(item => item.key) : [];

        return searchData
            .filter(item =>
                // item.names.some(name => name.includes(term)) || // 어떤 언어든 포함되면 통과
                item.key.includes(term) || // i18n 도입 시 위 코드와 교체
                item.choseong.includes(disassemble(term)) // 초성 검색
            )
            .map(item => item.key);
    }, [search, searchData, showAllWhenEmpty]);

    return searchList;
};