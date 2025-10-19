import { Adventure, adventure, AdventureDetail, MATERIAL_YIELD_TYPES, MaterialYieldTypesData } from "../data/adventures";
import { facilities } from "../data/facilities";
import { materials } from "../data/materials";
import { research } from "../data/research";
import { FacilitySimRequest, MaterialAcquisitionPlan, ResearchSimRequest, SimFacilityResult, SimResponse, SimResult } from "../types/sim/simTypes";
import { translateFacility } from "./function";
import { getResearchStep } from "./researchFuntion";

// 게임 데이터 모음
const allGameData = {
    facilities,
    materials,
    research,
    adventure,
    MATERIAL_YIELD_TYPES,
};

// 재료 정보를 빠르게 찾기 위한 Map
const materialMap = new Map(materials.map(m => [m.name, m]));

// 재료의 가치(동일 등급의 재료끼리만 한 모험 내에서 비교)
const materialVaules = calculateMaterialValues(allGameData);

// 시설 업그레이드
export const simFacility = (request: FacilitySimRequest, curInventory?: Map<string, number>): SimFacilityResult => {
    const targets = Object.entries(request.target);
    const resultArr: SimResponse[] = [];
    const inventory = new Map(curInventory || []);

    // console.log("facility", inventory)
    // console.log('--------------------------------------------------')

    // 목표(타겟) 항목 갯수만큼 반복
    targets.forEach(([key, value]) => {
        const krName = translateFacility(key);
        if (!krName) return;

        // console.log(krName)

        const facilityObj = Object.entries(facilities[krName] || {});

        let startLvl: number = 0;

        // 건물 추가 시 잊지말고 추가
        switch (key) {
            case 'lab':
                startLvl = request.currentLab
                break;
            case 'hall':
                startLvl = request.currentHall
                break;
            case 'hq':
                startLvl = request.currentHq
                break;
            case 'adv':
                startLvl = request.currentAdv
                break;
        }

        for (const [lvl, cost] of facilityObj) {

            const numlvl = parseInt(lvl, 10);
            if (numlvl < startLvl + 1) continue;
            if (numlvl > value) break; // 목표 레벨을 따라잡으면 중지

            const needMaterials = new Map();
            needMaterials.set('gold', (needMaterials.get('gold') || 0) + cost.gold);

            cost.cost.forEach(({ name, qty }) => {
                needMaterials.set(name, (needMaterials.get(name) || 0) + qty);
            });

            // console.log(`needMaterials: `,needMaterials)

            // 현재 모험회 레벨을 전달
            const result = createIntegratedPlan(
                krName === '모험회'
                    ? Math.max(numlvl - 1, request.currentAdv)
                    : request.currentAdv || 1,
                needMaterials,
                inventory,
                true
            );

            resultArr.push({
                result,
                krName,
                name: key,
                numlvl,
                gold: needMaterials.get('gold')
            });
        }
    });

    return {
        result: resultArr,
        remainingInventory: inventory
    };
}

// 연구 개발 (단계 단위, 주제x)
export const simResearch = (request: ResearchSimRequest, curInventory?: Map<string, number>): SimResponse[] => {
    const { currentTier, currentStep, target } = request;
    const { tier: targetTier, step: targetStep } = target;

    const resultArr: SimResponse[] = [];
    const inventory = new Map(curInventory || []);
    // console.log("research", inventory)

    // currentTier부터 targetTier까지 각 단계를 순회
    for (let t = currentTier; t <= targetTier; t++) {

        // 단계 단위 재료 Map
        const needMaterials = new Map<string, number>();
        const researchInfo = research[t];
        if (!researchInfo) continue;

        // currentTier의 시작 step. currentStep + 1부터 시작 ex) 1~5번 주제 => 2,3,4,5번 계산
        const startStep = (t === currentTier) ? currentStep + 1 : 1;
        const endStep = (t === targetTier) ? targetStep : researchInfo.maxStep;

        if (startStep > endStep) {
            continue;
        }

        // step 범위만큼 재료 구하기
        for (let s = startStep; s <= endStep; s++) {
            const stepInfo = getResearchStep(t, s);
            if (!stepInfo) continue;

            // 골드 누적
            needMaterials.set('gold', (needMaterials.get('gold') || 0) + stepInfo.gold);
            // 재료 누적
            stepInfo.cost.forEach(({ name, qty }) => {
                needMaterials.set(name, (needMaterials.get(name) || 0) + qty);
            });
        }

        // 해당 Tier에서 필요한 재료가 없으면 다음 Tier로 넘어감
        if (needMaterials.size === 0) {
            continue;
        }

        const result = createIntegratedPlan(
            request.currentAdv || 1,
            needMaterials,
            inventory,
            true
        );


        resultArr.push({
            result,
            krName: `연구 ${t}단계`,
            name: 'research',
            tier: t,
            numlvl: endStep, // 해당 Tier에서 도달한 마지막 Step을 레벨로 표시
            gold: needMaterials.get('gold') || 0,
        });
    }

    return resultArr;
};

// sim 최상위 함수
export function createIntegratedPlan(
    currentAdvLvl: number,
    needMaterials: Map<string, number>,
    inventory: Map<string, number>,
    isMutateInventory: boolean = false
): SimResult {

    // 해당 단계에서 사용될 컨텍스트
    // 같은 모험에서 나올 부산물 체크 용도
    const context: PlanContext = {
        inventory: isMutateInventory
            ? (inventory || new Map())  // 원본을 직접 사용
            : new Map(inventory || []),
        adventureRuns: new Map(),
    };

    const acquisitionPlans = Array.from(needMaterials.entries())
        .filter(([materialName, _]) => materialName !== 'gold')
        .map(([materialName, quantity]) => {
            return planAcquisitionRecursive(materialName, quantity, currentAdvLvl, context);
        });

    // console.log(context);

    return {
        acquisitionPlans: acquisitionPlans.filter(p => p !== null), // null이 아닌 계획만 필터링
        finalAdventureRuns: context.adventureRuns,
        inventory: context.inventory,
    };
}


// 재료명으로 순회하는 수급계획수립(모험, 제작)
function planAcquisitionRecursive(
    materialName: string,
    quantity: number,
    currentAdvLvl: number,
    context: PlanContext // 공유 컨텍스트를 매개변수로 받음
): MaterialAcquisitionPlan | null {

    // 인벤토리를 확인하여 이전에 부산물로 얻은게 있는지 확인
    const alreadyMat = context.inventory.get(materialName) || 0;
    const neededQuantity = quantity - alreadyMat;

    // console.log(`${materialName}, 보유: ${alreadyMat}, 필요: ${quantity} => ${neededQuantity}`);

    // 인벤토리에 있는 재료로 충분할 경우
    if (neededQuantity <= 0) {
        context.inventory.set(materialName, alreadyMat - quantity);
        // console.log(`${materialName}: 이미 충분하므로 계획이 필요 없음, ${quantity}개 필요, ${alreadyMat}개 보유, ${alreadyMat - quantity}개 남음`);

        return {
            material: materialName,
            quantity: quantity,
            inventoryQty: quantity,
            method: 'inventory'
        };
    }

    const bestAdventure = findBestAdventure(materialName, currentAdvLvl, allGameData);

    // 모험 수급 시
    if (bestAdventure) {
        const requiredRuns = calculateRequiredRuns(materialName, neededQuantity, bestAdventure.details);
        if (typeof requiredRuns === 'number') return null; // 실행 횟수 계산 불가 시

        const advName = bestAdventure.name;
        const currentRuns = context.adventureRuns.get(advName) || { min: 0, max: 0 };

        // 재료 A가 5회, B가 7회 요구하면 7회로 결정
        const newTotalRuns = {
            min: Math.max(currentRuns.min, requiredRuns.min),
            max: Math.max(currentRuns.max, requiredRuns.max),
        };
        context.adventureRuns.set(advName, newTotalRuns);

        // 늘어난 모험 횟수만큼 얻게 될 모든 재료를 인벤토리에 추가
        const deltaRuns = {
            min: newTotalRuns.min - currentRuns.min,
            max: newTotalRuns.max - currentRuns.max,
        };

        if (deltaRuns.min > 0) { // 최소 횟수가 증가했을 때 인벤토리 업데이트

            bestAdventure.details.yieldMaterials.forEach(mat => {
                const yields = (MATERIAL_YIELD_TYPES as any)[mat.yieldType];

                // // 평균 획득량 계산 (레벨 2, 3, 4의 평균 합)
                // const avgYield = (
                //     (yields[2].min + yields[2].max) / 2 +
                //     (yields[3].min + yields[3].max) / 2 +
                //     (yields[4].min + yields[4].max) / 2
                // ); // 운이 좋지 않을 경우 대비해서 최소 획득량으로 해야할지?

                const avgYield = (
                    yields[2].min +
                    yields[3].min +
                    yields[4].min
                );

                const gainedQty = Math.ceil(avgYield * deltaRuns.min); // 최소 획득량을 기준

                // 재료 사용 후 인벤토리 업데이트
                if (mat.name === materialName) { // 목표 재료
                    const usedAmount = Math.min(gainedQty + alreadyMat, neededQuantity);
                    const remaining = gainedQty + alreadyMat - usedAmount;
                    context.inventory.set(mat.name, remaining);
                    // console.log(`${materialName} ${remaining}개 저장`)
                } else { // 부가 재료
                    const currentStock = context.inventory.get(mat.name) || 0;
                    context.inventory.set(mat.name, currentStock + gainedQty);
                    // console.log(`${mat.name} ${currentStock + gainedQty}개 저장`)
                }


                // context.inventory.set(mat.name, (context.inventory.get(mat.name) || 0) + gainedQty);
            });
        }


        return {
            material: materialName,
            inventoryQty: alreadyMat,
            quantity: quantity,
            method: 'adventure',
            adventures: [{
                adventureName: advName,
                targetMaterial: materialName,
                requiredAdvLvl: bestAdventure.requiredAdvLvl,
                estimatedRuns: requiredRuns,
                efficiency: bestAdventure.efficiencyScore
            }]
        };
    }

    // 모험 수급 불가능 시 제작 탐색(재귀)
    const materialInfo = materialMap.get(materialName);
    // console.log(materialInfo);
    if (materialInfo && materialInfo.ingredient) {
        const subPlans: MaterialAcquisitionPlan[] = [];

        for (const ingredient of materialInfo.ingredient) {
            const subPlan = planAcquisitionRecursive(
                ingredient.name,
                ingredient.qty * neededQuantity, // 실제 부족한 상위 재료만큼만 하위 재료 필요
                currentAdvLvl,
                context
            );
            if (subPlan) {
                subPlans.push(subPlan);
            }
        }

        // 제작 완료: actualNeeded만큼 생산했으므로
        // 인벤토리 기존 보유량 + 새로 제작한 양 - 실제 사용량
        const totalAvailable = alreadyMat + neededQuantity;
        const remaining = totalAvailable - quantity;
        context.inventory.set(materialName, remaining);

        return {
            material: materialName,
            quantity: quantity,
            inventoryQty: alreadyMat,
            method: 'craft',
            craftingMaterials: subPlans,
        };
    }

    // 재료가 모험과 제작으로 얻을 수 없으면 null
    if (materialName !== 'gold') {
        // console.warn(`${materialName}을(를) 획득할 방법을 찾을 수 없습니다.`);
    }
    return {
        material: materialName,
        quantity: quantity,
        method: 'impossible'
    };
}

interface PlanContext {
    inventory: Map<string, number>; // 계획상 획득할 모든 재료의 종합 인벤토리
    adventureRuns: Map<string, { min: number, max: number }>; // 모험별 최종 필요 횟수
}


// 해당 재료를 수급할 수 있는 최적의 모험 반환
function findBestAdventure(
    targetMaterial: string,
    currentAdvLvl: number,
    data: typeof allGameData
): BestAdventureResult | null {

    // 모든 재료의 가치를 계산
    const adventureScores = new Map<string, number>();

    // 각 모험의 효율성 점수 계산
    for (const [advName, advDetails] of Object.entries(data.adventure)) {
        let totalEfficiencyScore = 0;

        for (const materialDrop of advDetails.yieldMaterials) {
            const { name: materialName, yieldType } = materialDrop;
            const value = materialVaules.get(materialName) || 0;
            const yields = (data.MATERIAL_YIELD_TYPES as MaterialYieldTypesData)[yieldType];

            if (!yields) continue;

            // 평균 획득량 계산 (레벨 2, 3, 4의 평균 합)
            const avgYield = (
                (yields[2].min + yields[2].max) / 2 +
                (yields[3].min + yields[3].max) / 2 +
                (yields[4].min + yields[4].max) / 2
            );

            totalEfficiencyScore += value * avgYield;
        }

        adventureScores.set(advName, totalEfficiencyScore);
    }

    // 목표 재료를 획득할 수 있는 모험들 중에서 현재 레벨로 수행 가능한 것만 필터링
    const candidateAdventures: BestAdventureResult[] = Object.entries(data.adventure)
        .filter(([_, details]) => {
            // 목표 재료를 드롭하는지 확인
            const dropsTarget = details.yieldMaterials.some(m => m.name === targetMaterial);
            // 현재 모험회 레벨로 수행 가능한지 확인
            const isAccessible = details.advLvl <= currentAdvLvl;

            return dropsTarget && isAccessible;
        })
        .map(([name, details]) => ({
            name,
            details,
            requiredAdvLvl: details.advLvl,
            efficiencyScore: adventureScores.get(name) || 0,
        }));

    if (candidateAdventures.length === 0) {
        // 현재 레벨로 수행 가능한 모험이 없으면 null 반환
        return null;
    }

    // 효율성이 가장 높은 모험 선택 - 점수 내림차순으로 0번인덱스 채택
    candidateAdventures.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
    return candidateAdventures[0];
}


// 재료, 수량을 받고 목표수량에 도달하기 위한 모험 수행 횟수 계산
function calculateRequiredRuns(
    materialName: string,
    targetQuantity: number,
    adventureDetails: AdventureDetail
): { min: number, max: number } | number {

    // 해당 모험에서 목표 재료의 yieldType 찾기
    const materialYield = adventureDetails.yieldMaterials.find(m => m.name === materialName);
    if (!materialYield) return 0;

    // 해당 모험에서 특정 재료 수급량
    const yields = (MATERIAL_YIELD_TYPES as MaterialYieldTypesData)[materialYield.yieldType];
    if (!yields) return 0;

    // 모험 최소, 최대 수행횟수
    const minYield = yields[2].min + yields[3].min + yields[4].min;
    const maxYield = yields[2].max + yields[3].max + yields[4].max;

    // 필요한 수행 횟수 = 목표 수량 / 평균 획득량 (올림)
    return { min: Math.ceil(targetQuantity / minYield), max: Math.ceil(targetQuantity / maxYield) };
}

interface BestAdventureResult {
    name: string;
    details: AdventureDetail;
    requiredAdvLvl: number;
    efficiencyScore: number;
}

// --------------------------------------자료 생성용----------------------------------------------



// 재료별로 가치 부여, 상위 제작에 사용되는 재료일수록 가치가 높다
function calculateMaterialValues(data: typeof allGameData): Map<string, number> {
    // 사용처 맵: 각 재료가 어떤 상위 아이템을 만드는데 사용되는지 추적
    const usageMap = new Map<string, { name: string; grade: number }[]>();

    // 맵 초기화. 재료 명, 빈 배열
    data.materials.forEach(m => usageMap.set(m.name, []));

    // 해당 재료가 제작재료로 쓰이는 상위재료 리스트 작성
    data.materials.forEach(material => {
        if (material.ingredient) {
            material.ingredient.forEach(ing => {
                usageMap.get(ing.name)?.push({
                    name: material.name,
                    grade: material.grade
                });
            });
        }
    });

    // 시설 건설에 사용되는 재료들에 높은 가치 부여
    Object.entries(data.facilities).forEach(([facilityName, facilityValues]) => {
        Object.entries(facilityValues).forEach(([level, levelInfo]) => {
            levelInfo.cost.forEach(item => {
                usageMap.get(item.name)?.push({
                    name: `${facilityName}_${level}`,
                    grade: 5
                });
            });
        });
    });

    const memo = new Map<string, number>();

    // 재귀함수) 각 재료의 가치 계산
    const getRecursiveValue = (materialName: string): number => {
        if (memo.has(materialName)) {
            return memo.get(materialName)!;
        }

        const usages = usageMap.get(materialName) || [];

        // 기본 가치 1 + 상위 아이템들의 가치를 재귀적으로 합산,
        // 최하위 재료일 시 usages가 빈 배열이므로 값은 1, usages.length === 0.
        let calculatedValue = 1 + usages.reduce((sum, usage) => {
            return sum + (getRecursiveValue(usage.name) * usage.grade);
        }, 0);

        // 최종 제작물(다른 것을 만드는 데 사용되지 않는 재료)에 보너스 점수
        if (usages.length === 0) {
            calculatedValue += 100;
        }

        memo.set(materialName, calculatedValue);
        return calculatedValue;
    };

    // 모든 재료의 가치 계산
    const finalValues = new Map<string, number>();
    data.materials.forEach(m => finalValues.set(m.name, getRecursiveValue(m.name)));

    return finalValues;
};

// 재료별로 획득 가능한 모험 목록. 키: 재료 명, 값: 모험 목록
function createAdventureYieldMap(): Map<string, Adventure[]> {
    const map = new Map<string, Adventure[]>();

    Object.entries(adventure).forEach(([adventureName, adventureData]) => {
        adventureData.yieldMaterials.forEach(material => {
            if (!map.has(material.name)) {
                map.set(material.name, []);
            }

            map.get(material.name)!.push({
                adventureName,
                yieldType: material.yieldType,
                ...adventureData
            } as any);
        });
    });

    return map;
}

// --------------------------------------컴포넌트에서 사용됨----------------------------------------------

export const calculateMaxDepth = (plan: MaterialAcquisitionPlan | null): number => {
    if (!plan) return 0;

    // craftingMaterials가 있으면 재귀적으로 하위 깊이 계산
    if (plan.craftingMaterials && plan.craftingMaterials.length > 0) {
        const childDepths = plan.craftingMaterials.map(child => calculateMaxDepth(child));
        return 1 + Math.max(...childDepths);
    }

    // 최하위 노드면 1 반환 (모험 수행이나 인벤토리)
    return 1;
};