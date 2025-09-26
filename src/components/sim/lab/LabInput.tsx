import { useState } from "react";
import { Facility, MaterialName } from "../../../types/trickcalTypes";
import { facilities } from "../../../data/facilities";
import { factory } from "typescript";
import { SimRequest } from "../../../types/sim/simTypes";
import { simFacility } from "../../../utils/simFuntions";

interface LabInput {
    lab: number;
    Headquarters: number;
    adventureClub: number;

    materials: Partial<Record<MaterialName, number>>;
}

const labPlatformList: Facility[] = ['생산 랩', '교단 본부', '모험회'];

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

    const handleSim = () => {
        const simRequestObj: SimRequest = {
            currentLab: 1,
            currentAdv: 1,
            currentHq: 1,
            target: {
                lab: 5
            }
        }

        simFacility(simRequestObj);
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
                <div className="p-2 bg-sky-400 text-[18px] font-bold cursor-pointer" onClick={() => handleSim()}>
                    버튼
                </div>
            </div>
        </div>
    );
}

export default LabInput;