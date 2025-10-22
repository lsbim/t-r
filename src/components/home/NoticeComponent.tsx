import PersonalityIcon from "../../commons/icon/PersonalityIcon";
import MyAccordion from "../../commons/rdx/MyAccordion";
import { ClashSummary } from "../../types/clashTypes";

const NoticeComponent = ({ data }: { data: ClashSummary }) => {

    if (!data) {
        return <></>;
    }

    const seasons = Object.entries(data);

    // console.log(seasons)

    const items = [
        {
            id: 'notice_3',
            header: (
                <div className="">
                    교단 레벨업 비용 계산 기능 추가
                </div>
            ),
            content: (
                <div className="px-4 py-[10px]">
                    <div className="">
                        <div className="mb-2">
                            교단의 시설 레벨업 및 연구 목표에 도달하기 위한 재화와 모험 횟수를 계산합니다.
                        </div>
                        <div className="mb-4">
                            재화의 합, 시설 레벨 별, 연구 단계 별로 제공됩니다.
                        </div>
                        <div className="flex-col flex text-[12px] gap-y-1 font-bold">
                            <span>
                                모험은 2, 3, 4레벨 획득량을 기준
                            </span>
                            <span>
                                부수재료는 최소 획득량 이월
                            </span>
                            <span>
                                모험회 현재 레벨에 수행이 가능한 모험만 소개
                            </span>
                            <span>
                                종합과 단계별 모험 횟수가 다를 수 있습니다.
                            </span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'notice_2',
            header: (
                <div className="">
                    순위 지정 기능 추가
                </div>
            ),
            content: (
                <div className="px-4 py-[10px]">
                    <div className="">
                        <div className="mb-4">
                            <span className="font-bold mr-1">
                                2025-06-12
                            </span>
                            <span>
                                이후 집계된 컨텐츠의 순위를 지정할 수 있는 기능이 추가되었습니다.
                            </span>
                        </div>
                        <div className="mb-2 text-[13px]">
                            <div className="flex gap-x-2 items-center">
                                <span className="font-bold">차원 대충돌 기준: </span>
                                <span className="text-red-500">시즌34</span>
                                <span>2025-06-12</span>
                                <div className="flex items-center gap-x-1">
                                    <span className=""> 릴1리</span>
                                    <PersonalityIcon personality="광기" size={14} />
                                </div>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <span className="font-bold">엘리아스 프론티어 기준: </span>
                                <span className="text-red-500">시즌10</span>
                                <span>2025-06-25</span>
                                <span className="">크레용사용</span>
                            </div>
                        </div>
                        <span className="text-[12px]">차원 대충돌 시즌34는 최대 100위까지 검색이 가능합니다.</span>
                    </div>
                </div>
            )
        },
        {
            id: 'notice_1',
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
                                <span className="text-red-500">시즌{season}</span>
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
                            <span className="text-red-500">시즌3</span>
                            <span>2024-09-05</span>
                            <span className="text-[13px]">R41-리뉴아</span>
                        </div>
                    </div>
                </div>
            )
        }
    ]

    return (
        <div className="sm:w-[600px] w-full mx-auto flex flex-col">
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