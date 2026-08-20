import { dimensionLabStatCategories, dimensionResearch, labStatCategories, research, sunnyrainCost } from "../data/research";
import { dimensionIterableStep, races, researchIterableStep } from "../types/trickcalTypes";

const RACES = races;
const ROLE = ['딜러', '탱커', '서포터'];

// 해당 단계 + 주제의 연구 객체를 반환함
export function getResearchStep(tier: number, step: number, researchType: 'research' | 'dimension') {
    const STATS = researchType === 'research' ? researchIterableStep : dimensionIterableStep;

    if (!Number.isInteger(tier) || tier <= 0) return null;
    if (!Number.isInteger(step)) return null;

    const maxTier = parseInt(Object.keys(researchType === 'research'
        ? research
        : dimensionResearch).at(-1)!, 10);

    if (tier > maxTier) return null;

    const researchInfo = researchType === 'research'
        ? research[tier]
        : dimensionResearch[tier];

    if (!researchInfo) return null;

    // console.log(`tier: ${tier}, step: ${step}`)

    const { maxStep, step: stepData } = researchInfo;
    // console.log(stepData)

    if (stepData[step]) {
        if (researchType === 'dimension') {
            return {
                ...stepData[step],
                sunnyrain: sunnyrainCost[tier - 1]
            }
        } else {
            return stepData[step];
        }
    }

    const uniqueStepCount = researchType === 'research'
        ? Object.keys(stepData).length - 2
        : Object.keys(stepData).length - 3
        ; // 'iterable', 마지막 주제 제외

    if (step > uniqueStepCount && step < maxStep) {
        if (researchType === 'research') {
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
        } else {
            const iterableData = stepData.iterable;

            // iterable 구간 내에서의 순서
            const iterableIndex = step - uniqueStepCount - 1;

            // 한 역할 당 순회할 스탯 목록 길이
            const numStats = STATS.length;

            // 역할 계산(딜러, 탱커, 서포터)
            const roleIndex = Math.floor(iterableIndex / numStats);
            const currentRole = ROLE[roleIndex];

            // 스탯 계산
            const statIndex = iterableIndex % numStats;
            const stat = STATS[statIndex];

            // 스탯 카테고리 명
            let categoryName: '공격력' | '방어력' | 'HP' | '치명';
            if (stat.includes('공격력')) {
                categoryName = '공격력';
            } else if (stat.includes('방어력')) {
                categoryName = '방어력';
            } else if (stat.includes('치명')) {
                categoryName = '방어력';
            } else {
                categoryName = 'HP';
            }

            // 카테고리와 단계에 맞는 값 찾기
            const category = dimensionLabStatCategories.find(c => c.name === categoryName);
            // tier는 1부터 시작하지만 배열 인덱스는 0부터 시작하므로 tier - 1
            const value = category ? category.v[tier - 1] : 0;

            const dynamicName = `${currentRole} ${stat} ${value} 증가`;

            // 차원연구실 이터러블 구간 재료
            const tierQtyMap = [
                { q1: 1, q2: 1 },
                { q1: 1, q2: 2 },
                { q1: 2, q2: 3 },
                { q1: 3, q2: 5 },
                { q1: 4, q2: 8 },
            ];
            const currentQty = tierQtyMap[tier - 1] || { q1: 0, q2: 0 };

            const isOddSequence = iterableIndex % 2 === 0;

            const item1Name = isOddSequence ? '급상승 차트' : '말랑 딱딱 인형';
            const item2Name = '꾹꾹이 화석';

            const currentCost = [
                { name: item1Name, qty: currentQty.q1 },
                { name: item2Name, qty: currentQty.q2 },
            ];

            // 연구 이름과 객체 내용물 반환
            return {
                ...iterableData,
                name: dynamicName,
                cost: currentCost,
                sunnyrain: sunnyrainCost[tier - 1]
            };
        }
    }
}