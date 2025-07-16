import React from "react";
import MyAccordion from "../../commons/MyAccordion";
import { ClashSummary } from "../../types/clashTypes";
import PersonalityIcon from "../../commons/PersonalityIcon";

const NoticeComponent = ({ data }: { data: ClashSummary }) => {

    if (!data) {
        return <></>;
    }

    const seasons = Object.entries(data);

    console.log(seasons)

    const items = [
        {
            id: 'item-1',
            header: (
                <div className="">
                    일부 시즌은 기록이 제공되지 않습니다.
                </div>
            ),
            content: (
                <div className="px-4 py-[10px]">
                    <div className="">
                        <span className="font-bold">차원 대충돌: </span>
                        {seasons && seasons.map(([season, val], i) => (
                            <div key={"notice1" + i} className="flex items-center gap-y-2 gap-x-2">
                                <span className="text-red-500">{season}시즌</span>
                                <span>{val.startDate}</span>
                                <div className="flex items-center gap-x-1">
                                    <span className="text-[13px]"> {val.name}</span>
                                    <PersonalityIcon personality={val.personality} size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2">
                        <span className="font-bold">엘리아스 프론티어: </span>
                        <div className="flex gap-x-2 items-center">
                            <span className="text-red-500">3시즌</span>
                            <span>2024-09-05</span>
                            <span className="text-[13px]">R41-리뉴아</span>
                        </div>
                    </div>
                </div>
            )
        }
    ]

    return (
        <div className="sm:w-[600px] w-full mx-auto flex flex-col mt-2">
            <div className="flex justify-center">
                <div className="w-full mx-auto">
                    <div className="text-[15px] mb-2 flex justify-start bg-white p-4 rounded-t-md font-bold shadow-sm">
                        공지사항
                    </div>
                    <div className="flex justify-between text-[13px] text-gray-800 w-full">
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