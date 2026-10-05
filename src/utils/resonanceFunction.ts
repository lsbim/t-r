import { RESONANCE_BASE_NAMES } from "@/data/trickcalChar";
import { Personality, personalityBaseList } from "@/types/trickcalTypes";

/* 
    공명 사도 본명 파싱 함수
*/
export function parseResonanceBaseName(name: string): { baseName: string; personality: Personality } | null {
    const base = RESONANCE_BASE_NAMES.find(b => name.startsWith(b)); // ex) b = "우로스", "비비(신성)"...
    if (!base) return null;

    const suffix = name.slice(base.length); // ex) "(냉정)"
    const match = suffix.match(/^\((.+)\)$/);
    if (!match) return null;
    if (!personalityBaseList.includes(match[1])) return null;

    return { baseName: base, personality: match[1] as Personality }; // ex) { baseName: "우로스", personality: "냉정" }
}