import { Adventure, adventure, MATERIAL_YIELD_TYPES } from "../data/adventures";
import { facilities } from "../data/facilities";
import { materials } from "../data/materials";
import { SimRequest, SimResponse } from "../types/sim/simTypes";
import { Facility } from "../types/trickcalTypes";
import { translateFacility } from "./function";

const materialMap = new Map(materials.map(m => [m.name, m]));
const memo = new Map();

export const simFacility = (request: SimRequest) => {

    const targets = Object.entries(request.target);
    const materialMap = new Map();
    const advYieldMap: Map<string, Adventure[]> = createAdventureYieldMap();
    const resultMap: SimResponse = {
        target: []
    };

    console.log(advYieldMap)

    // console.log(targets);
    targets.forEach(([key, value]) => {

        const krName = translateFacility(key);
        if (!krName) return;

        // console.log(request.currentLab)

        // console.log(krName, value)

        const facilityObj = Object.entries(facilities[krName] || {});
        // console.log(facilityObj);


        for (const [lvl, cost] of facilityObj) {
            const numlvl = parseInt(lvl, 10);

            if (numlvl > value) break;
            const needMaterials = new Map();

            needMaterials.set('gold', (needMaterials.get('gold') || 0) + cost.gold);

            cost.cost.forEach(({ name, qty }) => {
                needMaterials.set(name, (needMaterials.get(name) || 0) + qty);
            })

            // console.log(needMaterials, 'asd')
            const result = calculateRequiredAdventures(krName, 10, needMaterials, advYieldMap);
        }
    })
}

export function calculateRequiredAdventures(
    facilityName: Facility,
    advLvl: number,
    needMaterials: Map<string, object>,
    advYieldMap: Map<string, object>
) {
    const targetResult = {};

    // console.log(needMaterials)

    for (const [material, quantity] of needMaterials.entries()) {
        if (advYieldMap.has(material)) {
            // console.log(material, advYieldMap.get(material))
            const advSet = new Set();

            const materialData = advYieldMap.get('설탕');

            console.log(materialData)
            if (materialData) {
                const bestAdv = Object.values(materialData).reduce((best, cur) => {
                    if (!best || !best.yieldType) {
                        return cur.advLvl > advLvl ? null : cur;
                    }

                    // 모험 1레벨 기준 평균드랍량 가장높은 모험 채택
                    const bestCost = (MATERIAL_YIELD_TYPES as any)[best.yieldType][1];
                    const bestAvgCost = (bestCost.min + bestCost.max) / 2

                    const cost = (MATERIAL_YIELD_TYPES as any)[cur.yieldType][1];
                    const avgCost = (cost.min + cost.max) / 2

                    return (best === null || avgCost > bestAvgCost) ? cur : best;
                }, {});

                console.log(bestAdv)
                // A 모험이 재료 3~6개, B 모험이 재료 2~3개를 주니 A모험이 BEST일것같지만, 
                // B 모험이 다른 재료의 하위재료를 주기 때문에 B모험을 골라야하는데, 어떻게 해야할지?
            }
        } else {
            const low = materialMap.get(material)
            // console.log(low)
        }
    }

}


// 키: 재료 명
// 값: 재료획득 가능한 모험 객체
function createAdventureYieldMap() {
    const map = new Map();

    Object.entries(adventure).forEach(([adventureName, adventureData]) => {
        adventureData.yieldMaterials.forEach(material => {
            if (!map.has(material.name)) {
                map.set(material.name, []);
            }

            map.get(material.name).push({
                adventureName,
                yieldType: material.yieldType, // 키에 해당하는 재료의 타입
                ...adventureData
            });
        });
    });

    return map;
};