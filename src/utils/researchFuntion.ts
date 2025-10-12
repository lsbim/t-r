import { labStatCategories, research } from "../data/research";
import { races, researchIterableStep } from "../types/trickcalTypes";

const RACES = races;
const STATS = researchIterableStep;

// 해당 단계 + 주제의 연구 객체를 반환함
export function getResearchStep(tier: number, step: number) {
    if (!Number.isInteger(tier) || tier <= 0) return null;
    if (!Number.isInteger(step)) return null;

    const maxTier = parseInt(Object.keys(research).at(-1)!, 10);
    if (tier > maxTier) return null;

    const researchInfo = research[tier];
    if (!researchInfo) return null;

    // console.log(`tier: ${tier}, step: ${step}`)

    const { maxStep, step: stepData } = researchInfo;

    if (stepData[step]) {
        return stepData[step];
    }

    const uniqueStepCount = Object.keys(stepData).length - 2; // 'iterable', 마지막 주제 제외

    if (step > uniqueStepCount && step < maxStep) {
        const iterableData = stepData.iterable;

        // iterable 구간 내에서의 순서 (0부터 34까지)
        const iterableIndex = step - uniqueStepCount - 1;

        // 종족 계산 (7종)
        const raceIndex = iterableIndex % 7;
        const race = RACES[raceIndex];

        // 스탯 계산 (35단계 = 7종 * 5주기)
        const statIndex = Math.floor(iterableIndex / 7);
        const stat = STATS[statIndex];

        // 스탯 카테고리 명
        let categoryName: '공격력' | '방어력' | 'HP';
        if (stat.includes('공격력')) {
            categoryName = '공격력';
        } else if (stat.includes('방어력')) {
            categoryName = '방어력';
        } else {
            categoryName = 'HP';
        }

        // 카테고리와 단계에 맞는 값 찾기
        const category = labStatCategories.find(c => c.name === categoryName);
        // tier는 1부터 시작하지만 배열 인덱스는 0부터 시작하므로 tier - 1
        const value = category ? category.v[tier - 1] : 0;

        const dynamicName = `${race} ${stat} ${value} 증가`;

        // 연구 이름과 객체 내용물 반환
        return {
            ...iterableData,
            name: dynamicName,
        };
    }
}