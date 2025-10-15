import PersonalityIcon from "../../commons/icon/PersonalityIcon";
import { charInfo } from "../../data/trickcalChar";
import { CostumeMapItem } from "../../pages/costume/IndexPage";

const MostAndLeast = ({ most, least }: { most: CostumeMapItem[], least: CostumeMapItem[] }) => {


    return (
        <div className="md:w-[768px] w-full flex mx-auto bg-white shadow-md p-2">
            <div className="w-[50%] flex flex-col gap-y-3">
                <div className="flex justify-center">
                    <span className="text-[18px] font-bold">
                        가장 많은 사도
                    </span>
                </div>
                <div className="flex justify-start flex-col gap-y-2">
                    {most.map((c, i) => (
                        <div
                            className="border-l-4 border-orange-500 pl-4 pb-2"
                            key={"costume_most" + i}>
                            <div className="flex items-center gap-x-2">
                                <div className="text-[16px] md:text-[18px] font-bold">{c.charName}</div>
                                <div className="text-orange-500 font-bold">{c.count}개</div>
                            </div>
                            <div className="text-gray-500 text-[14px] flex my-1">
                                <PersonalityIcon personality={charInfo[c.charName].personality} size={22} />
                                <span className="ml-1">
                                    • {charInfo[c.charName].line} • {charInfo[c.charName].grade}성
                                </span>
                            </div>
                            <div className="md:text-[14px] text-[12px] text-gray-700">마지막 사복: {c.latestDate}</div>
                        </div>
                    ))}
                    {most.length > 5 && (
                        <div className="text-[14px] text-orange-500 my-2">
                            외 {least.length - 5}명의 사도
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
                                className="border-l-4 border-gray-300 pl-4 pb-2"
                                key={"costume_least" + i}>
                                <div className="flex items-center gap-x-2">
                                    <div className="text-[16px] md:text-[18px] font-bold">{c.charName}</div>
                                    <div className="text-gray-500 font-bold">{c.count}개</div>
                                </div>
                                <div className="text-gray-500 text-[14px] flex my-1">
                                    <PersonalityIcon personality={charInfo[c.charName].personality} size={22} />
                                    <span className="ml-1">
                                        • {charInfo[c.charName].line} • {charInfo[c.charName].grade}성
                                    </span>
                                </div>
                                <div className="md:text-[14px] text-[12px] text-gray-700">마지막 사복: {c.latestDate === '2023-09-27' ? '無' : c.latestDate}</div>
                            </div>
                        );
                    })}
                    {least.length > 5 && (
                        <div className="text-[14px] text-gray-500 my-2">
                            외 {least.length - 5}명의 사도
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MostAndLeast;