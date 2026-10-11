import PersonalityIcon from "../../../components/icons/PersonalityIcon";
import MyAccordion from "../../../components/MyAccordion";
import { containerDarkBG } from "../../../styles/container";
import { ClashBase } from "../../../types/clashTypes";
import { FrontierBase } from "../../../types/frontierTypes";

const NoticeComponent = ({ nonData }: { nonData: ClashBase | FrontierBase }) => {

    if (!nonData) {
        return <></>;
    }

    const seasons = Object.entries(nonData);

    // console.log(seasons)

    const items = [
        {
            id: 'notice_1',
            header: (
                <div className="">
                    일부 시즌은 기록이 제공되지 않습니다.

                </div>
            ),
            content: (
                <div className="px-4 py-[10px]">
                    <span className="font-bold">차원 대충돌: </span>
                    {seasons && seasons.sort(([seasonKeyA], [seasonKeyB]) => {
                        const a = Number(seasonKeyA);
                        const b = Number(seasonKeyB);
                        const isBetaA = a > 10000;
                        const isBetaB = b > 10000;

                        if (isBetaA !== isBetaB) {
                            return isBetaA ? -1 : 1;
                        }

                        // 같은 그룹끼리는 내림차순
                        return a - b;
                    }).map(([season, val], i) => {

                        const seasonText = Number(season) > 10000
                            ? `프리시즌${Number(season) - 10000}`
                            : `시즌${season}`;

                        return (
                            <div key={"notice1" + i} className="flex items-center gap-y-2 gap-x-2">
                                <span className="text-red-500">{seasonText}</span>
                                <span>{val.startDate}</span>
                                <div className="flex items-center gap-x-1">
                                    <span className="text-[13px]"> {val.name}</span>
                                    <PersonalityIcon personality={val.personality} size={14} />
                                </div>
                            </div>
                        )
                    })}

                    <span className="font-bold block mt-2">엘리아스 프론티어: </span>
                    <div className="flex gap-x-2 items-center">
                        <span className="text-red-500">시즌3</span>
                        <span>2024-09-05</span>
                        <span className="text-[13px]">R41-리뉴아</span>
                    </div>

                </div>
            )
        }
    ]

    return (
        <div className="sm:w-[600px] w-full mx-auto flex flex-col">
            <div className="flex justify-center">
                <div className={`w-full mx-auto rounded-2xl border border-zinc-300 dark:border-zinc-700 ${containerDarkBG} overflow-hidden`}>
                    <div className="text-[15px] flex justify-start dark:text-zinc-300 p-4 font-bold">
                        공지사항
                    </div>
                    <div className="flex justify-between text-[13px] text-gray-800 dark:text-zinc-200 w-full">
                        <MyAccordion
                            items={items}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}



export default NoticeComponent;