import { useState } from "react";
import { Facility, MaterialName } from "../../../types/trickcalTypes";
import { facilities } from "../../../data/facilities";
import { factory } from "typescript";

interface LabInput {
    lab: number;
    Headquarters: number;
    adventureClub: number;

    materials: Partial<Record<MaterialName, number>>;
}

const labPlatformList: Facility[] = ['생산 랩', '교단 본부', '모험회'];
const labMaterialList = ['스륵스륵 철가루', '바삭바삭 금박', '지구에서 온 납', '조각조각 기판', 'MUSIM 칩', 'S전자 반도체'
    , '배터리 팩', 'MUSIM 칩'
];

function maxFacilityLvl(name: string): number {
    if (name in facilities) {
        const f = (facilities as any)[name];
        return Object.keys(f).length;
    }
    return 0;
}

const LabInput = () => {

    const [labInput, setLabInput] = useState({})

    const handleSetLabInput = (name: string, num: number) => {

        if (!name) return;

        if (name in facilities) {
            const maxlvl = maxFacilityLvl(name);
            num > maxlvl && (num = maxlvl);
        }
    }


    return (
        <div className="lg:w-[992px] w-full mx-auto flex flex-col bg-white p-4 shadow-md mt-4 overflow-x-auto">
            <div className="flex justify-start gap-x-3 text-[14px]">
                {labPlatformList.map(p => (
                    <div
                        key={'sim_lab_input' + p}
                        className="w-[65px] flex items-center justify-center flex-col gap-y-1">
                        <div className="">{p}</div>
                        <input
                            defaultValue={1}
                            max={15}
                            maxLength={2}
                            type="number"
                            className="border-2 border-black p-1 focus:outline-none w-[35px] text-center" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LabInput;