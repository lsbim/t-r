import { disassemble, getChoseong } from "es-hangul";

// 이름이 검색어와 일치하는지 체크
export function matchesSearchTerm(name: string, term: string): boolean {
    if (!term) return true;
    const normalizedName = name.replace(/\s+/g, "");
    return normalizedName.includes(term) || getChoseong(normalizedName).includes(disassemble(term));
}