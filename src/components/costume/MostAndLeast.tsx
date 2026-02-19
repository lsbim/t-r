import React from "react";
import CharacterIcon from "../../commons/icon/CharacterIcon";
import PersonalityIcon from "../../commons/icon/PersonalityIcon";
import { charInfo } from "../../data/trickcalChar";
import { CostumeMapItem } from "../../pages/costume/IndexPage";
import CostumeAccordion from "./CostumeAccordion";

const MostAndLeast = ({ most, least }: { most: CostumeMapItem[], least: CostumeMapItem[] }) => {

    return (
        <div className="md:w-[768px] w-full flex mx-auto bg-white dark:bg-zinc-900 dark:text-zinc-200 shadow-md p-2">
            <div className="w-[50%] flex flex-col gap-y-3">
                <div className="flex justify-center">
                    <span className="text-[18px] font-bold">
                        가장 많은 사도
                    </span>
                </div>
                <div className="flex justify-start flex-col gap-y-2">
                    {most.sort((a, b) => {
                        const safeDate = (item: CostumeMapItem) => item.latestDate ?? '9999-12-31';

                        return safeDate(a).localeCompare(safeDate(b));
                    }).map((c, i) => {

                        if (i > 4) return;

                        return (
                            <div
                                className="border-l-4 border-orange-500 pl-4 pb-2 pt-1 flex h-[90px]"
                                key={"costume_most" + i}>
                                <div className="sm:w-1/2 w-full">
                                    <div className="flex items-center gap-x-2">
                                        <CharacterIcon
                                            name={c.charName}
                                            type="micro"
                                        />
                                        <div className="text-[16px] md:text-[18px] font-bold">{c.charName}</div>
                                        <div className="text-orange-500 font-bold">{c.count}개</div>
                                    </div>
                                    <div className="text-gray-500 dark:text-zinc-400 text-[14px] flex my-1">
                                        <PersonalityIcon personality={charInfo[c.charName].personality} size={22} />
                                        <span className="ml-1">
                                            • {charInfo[c.charName].line} • {charInfo[c.charName].grade}성
                                        </span>
                                    </div>
                                    <div className="md:text-[14px] text-[12px] text-gray-700 dark:text-zinc-200">마지막 사복: {c.latestDate}</div>
                                </div>
                                <div className="sm:w-1/2 sm:inline hidden mr-1">
                                    <CostumeAccordion
                                        items={c?.costumes.toReversed()}
                                    />
                                </div>
                            </div>
                        )
                    })}
                    {most.length > 5 && (
                        <div
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={most
                                .slice(5)
                                .map(m => m.charName)
                                .join(', ')}
                            className="text-[14px] text-orange-500 w-[80px] cursor-pointer font-bold dark:text-zinc-400 my-2">
                            외 {most.length - 5}명의 사도
                        </div>
                    )}
                </div>
            </div>
            <div className="w-[50%] flex flex-col gap-y-3">
                <div className="flex justify-center">
                    <span className="text-[18px] font-bold">
                        가장 적은 사도
                    </span>
                </div>
                <div className="flex justify-center flex-col gap-y-2">
                    {least.map((c, i) => {

                        if (i > 4) return;

                        return (
                            <div
                                className="border-l-4 border-gray-300 pl-4 pb-2 pt-1 flex"
                                key={"costume_least" + i}>
                                <div className="sm:w-1/2 w-full">
                                    <div className="flex items-center gap-x-2">
                                        <CharacterIcon
                                            name={c.charName}
                                            type="micro"
                                        />
                                        <div className="text-[16px] md:text-[18px] font-bold">{c.charName}</div>
                                        <div className="text-orange-500 font-bold">{c.count}개</div>
                                    </div>
                                    <div className="text-gray-500 dark:text-zinc-400 text-[14px] flex my-1">
                                        <PersonalityIcon personality={charInfo[c.charName].personality} size={22} />
                                        <span className="ml-1">
                                            • {charInfo[c.charName].line} • {charInfo[c.charName].grade}성
                                        </span>
                                    </div>
                                    <div className="md:text-[14px] text-[12px] text-gray-700 dark:text-zinc-200">마지막 사복: {c.latestDate}</div>
                                </div>
                                <div className="sm:w-1/2 sm:inline hidden mr-1">
                                    <CostumeAccordion
                                        items={c?.costumes.reverse()}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    {least.length > 5 && (
                        <div
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={least
                                .slice(5)
                                .map(m => m.charName)
                                .join(', ')}
                            className="text-[14px] text-gray-500 dark:text-zinc-400 my-2 w-[80px] cursor-pointer font-bold">
                            외 {least.length - 5}명의 사도
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default React.memo(MostAndLeast);