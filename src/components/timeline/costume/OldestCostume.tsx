import PersonalityIcon from "../../../commons/PersonalityIcon";
import { charInfo } from "../../../data/trickcalChar";
import { CostumeMapItem, getDaysSince } from "../../../pages/timeline/costume/IndexPage";

const OldestCostume = ({ oldest }: { oldest: CostumeMapItem[] }) => {
    return (
        <div className="md:w-[768px] w-full flex mx-auto bg-white shadow-md p-2 flex-col">
            <div className="flex justify-center">
                <span className="text-[18px] font-bold">
                    사복이 나온지 가장 오래된 사도 5인
                </span>
            </div>
            <div className="flex justify-start flex-col gap-y-2 py-2">
                {oldest.map((c, i) => (
                    <div
                        className="border-l-4 border-red-500 pl-4 pb-2"
                        key={"costume_most" + i}>
                        <div className="flex items-center gap-x-2">
                            <div className="text-[18px] font-bold">{c.charName}</div>
                            <div className="text-orange-500 font-bold">{c.count}개</div>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <div className="text-[14px] text-gray-700">마지막 사복: {c.latestDate}</div>
                            <div className="font-bold text-red-500">{getDaysSince(c.latestDate!)}일 전</div>
                        </div>
                        <div className="text-gray-500 text-[14px] flex mt-1">
                            <PersonalityIcon personality={charInfo[c.charName].personality} size={22} />
                            <span className="ml-1">
                                • {charInfo[c.charName].line} • {charInfo[c.charName].grade}성
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OldestCostume;