import { labStatCategories, research } from "../data/research";
import { races, researchIterableStep } from "../types/trickcalTypes";

const RACES = races;
const STATS = researchIterableStep;

export function getResearchStep(tier: number, step: number) {
    if (!Number.isInteger(tier) || tier <= 0) return null;
    if (!Number.isInteger(step)) return null;

    const maxTier = parseInt(Object.keys(research).at(-1)!, 10);
    if (tier > maxTier) return null;

    const researchInfo = research[tier];
    if (!researchInfo) return null;

    // console.log(`tier: ${tier}, step: ${step}`)

    const { maxStep, step: stepData } = researchInfo;

    if (stepData[step as keyof typeof stepData]) {
        return stepData[step as keyof typeof stepData];
    }

    const uniqueStepCount = Object.keys(stepData).length - 2; // iterable, 마지막 주제 제외

    if (step > uniqueStepCount && step < maxStep) {
        const iterableData = stepData.iterable;

        // iterable 구간 내에서의 순서 (0부터 34까지)
        const iterableIndex = step - uniqueStepCount - 1;

        // 종족 계산 (7단계 주기)
        const raceIndex = iterableIndex % 7;
        const race = RACES[raceIndex];

        // 스탯 계산 (35단계 = 7단계 * 5주기)
        const statIndex = Math.floor(iterableIndex / 7);
        const stat = STATS[statIndex];

        // 1. stat 종류에 따라 참조할 카테고리 이름을 결정
        let categoryName: '공격력' | '방어력' | 'HP';
        if (stat.includes('공격력')) {
            categoryName = '공격력';
        } else if (stat.includes('방어력')) {
            categoryName = '방어력';
        } else {
            categoryName = 'HP';
        }

        // 2. 해당 카테고리를 찾고, tier에 맞는 스탯 값을 가져옴
        const category = labStatCategories.find(c => c.name === categoryName);
        // tier는 1부터 시작하지만 배열 인덱스는 0부터 시작하므로 tier - 1
        const value = category ? category.v[tier - 1] : 0;

        // 3. 이름에 스탯 값을 포함하여 동적 이름 생성
        const dynamicName = `${race} ${stat} ${value} 증가`;

        // 4. 반환 객체에 이름과 함께 value도 추가
        return {
            ...iterableData,
            name: dynamicName,
        };
    }
}