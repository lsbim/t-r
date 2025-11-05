import { debounce } from "es-toolkit";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import FacilityIcon from "../../commons/icon/FacilityIcon";
import Slide from "../../commons/rdx/Slide";
import { facilities } from "../../data/facilities";
import { FacilitySimRequest } from "../../types/sim/simTypes";
import { Facility, FacilityEn } from "../../types/trickcalTypes";
import { translateFacility } from "../../utils/function";

const labPlatformList: FacilityEn[] = ['lab', 'hall', 'hq', 'adv',];

const SimFacilityInput = ({ facilityInput, setFacilityInput }
    : {
        facilityInput: FacilitySimRequest,
        setFacilityInput: Dispatch<SetStateAction<FacilitySimRequest>>
    }
) => {

    const handleSlider = useCallback((name: FacilityEn, num: [number, number]) => {
        const [smallVal, bigVal] = num;

        const krName = translateFacility(name)! as Facility;
        const maxlvl = maxFacilityLvl(krName);

        const clampedSmall = Math.max(1, Math.min(smallVal, maxlvl));
        const clampedBig = Math.max(1, Math.min(bigVal, maxlvl));

        setFacilityInput((prev) => {
            const next = { ...prev };

            switch (name) {
                case "lab":
                    next.currentLab = clampedSmall;
                    next.target = { ...next.target, lab: clampedBig };
                    break;
                case "hall":
                    next.currentHall = clampedSmall;
                    next.target = { ...next.target, hall: clampedBig };
                    break;
                case "hq":
                    next.currentHq = clampedSmall;
                    next.target = { ...next.target, hq: clampedBig };
                    break;
                case "adv":
                    next.currentAdv = clampedSmall;
                    next.target = { ...next.target, adv: clampedBig };
                    break;
                default:
                    break;
            }

            return next;
        });
    }, [setFacilityInput])

    const validateFacility = (name: FacilityEn) => {
        const hqLvl = Math.max(facilityInput.currentHq, facilityInput.target.hq);

        if (name === 'hall') {
            const hallLvl = Math.max(facilityInput.currentHall, facilityInput.target.hall);
            if (hallLvl > 1 && hqLvl / 2 < hallLvl) {
                return (
                    <span>
                        {`${translateFacility(name)} ${hallLvl}레벨 조건: 본부 ${hallLvl * 2}레벨`}
                    </span>
                )
            }
        } else if (name === 'lab') {
            const labLvl = Math.max(facilityInput.currentLab, facilityInput.target.lab);
            if (labLvl < 10 && hqLvl + 1 < labLvl) {
                return (
                    <span>
                        {`${translateFacility(name)} ${labLvl}레벨 조건: 본부 ${labLvl + 1}레벨`}
                    </span>
                )
            } else if (labLvl >= 10 && hqLvl < 10) {
                return (
                    <span>
                        {`${translateFacility(name)} ${labLvl}레벨 조건: 본부 10레벨`}
                    </span>
                )
            }
        } else if (name === 'hq') {
            if (hqLvl > 3) {
                return (
                    <span className="text-orange-600 dark:text-orange-500">
                        {`${translateFacility(name)} ${hqLvl}레벨 조건: 교주 ${(hqLvl - 3) * 10}레벨`}
                    </span>
                )
            }
        } else if (name === 'adv') {
            const advLvl = Math.max(facilityInput.currentAdv, facilityInput.target.adv);
            if (advLvl - 1 > hqLvl) {
                return (
                    <span>
                        {`${translateFacility(name)} ${advLvl}레벨 조건: 본부 ${advLvl - 1}레벨`}
                    </span>
                )
            }
        }
    }


    return (
        <div className="lg:w-[992px] w-full mx-auto flex flex-col dark:text-zinc-200">
            <div className="flex justify-center mb-3 md:ml-[60px] ml-[50px] text-[15px] gap-x-20 w-full font-bold">
                <span>
                    현재 레벨
                </span>
                <span>
                    목표 레벨
                </span>
            </div>
            <div className="flex flex-col justify-start gap-y-3 text-[14px]">
                {labPlatformList.map(p => {

                    let currentV = 1;
                    let highV = 1;

                    switch (p) {
                        case "lab":
                            currentV = facilityInput.currentLab;
                            highV = facilityInput.target.lab;
                            break;
                        case "hall":
                            currentV = facilityInput.currentHall;
                            highV = facilityInput.target.hall;
                            break;
                        case "hq":
                            currentV = facilityInput.currentHq;
                            highV = facilityInput.target.hq;
                            break;
                        case "adv":
                            currentV = facilityInput.currentAdv;
                            highV = facilityInput.target.adv;
                            break;
                    }

                    return (
                        <div
                            key={'sim_lab_input' + p}
                            className="mx-auto w-full flex items-center justify-center md:gap-x-10 gap-x-4">
                            <FacilityIcon name={p} />
                            <div className="flex flex-col items-center justify-start w-[240px] min-h-[80px] mb-auto">
                                <div className="min-h-[20px] text-[12px] text-red-600 dark:text-red-500 font-bold">
                                    {validateFacility(p)}
                                </div>
                                <div className="w-[200px] flex gap-x-10 justify-center mx-auto font-bold text-[16px] mb-2">
                                    <div className="w-[30px] flex justify-center">
                                        {currentV}
                                    </div>
                                    <div className="w-[30px] flex justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </div>
                                    <div className="w-[30px] flex justify-center">
                                        {highV}
                                    </div>
                                </div>
                                <Slide
                                    max={maxFacilityLvl(translateFacility(p)!)}
                                    value={[currentV, highV]}
                                    handle={(v) => handleSlider(p, v)} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

function maxFacilityLvl(name: Facility): number {

    const facil = facilities[name];
    if (!facil) return 0;

    const maxLvl = parseInt(Object.keys(facilities[name]!).at(-1)!, 10);

    return maxLvl;
}


export default React.memo(SimFacilityInput);