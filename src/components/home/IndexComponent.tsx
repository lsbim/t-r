import { Link } from "react-router-dom";
import PersonalityIcon from "../../commons/icon/PersonalityIcon";
import { LatestData } from "../../types/latestTypes";
import RaidCard from "../../commons/card/RaidCard";


const IndexComponent = ({ latest }: { latest: LatestData }) => {

    return (
        <>
            <div className="sm:w-[600px] w-full dark:bg-zinc-900 dark:text-zinc-200 mx-auto flex flex-col mt-4 bg-white p-4 shadow-md rounded-md">
                <div className="flex gap-x-3 justify-center items-center">
                    <img
                        src="/images/boss/lil1li.webp"
                        className="object-contain aspect-square w-12 h-12 border border-black"
                    />
                    <div>
                        <div className="font-bold text-[22px]">
                            트릭컬 레코드
                        </div>
                        <div className="text-[14px]">
                            차원 대충돌, 엘리아스 프론티어 랭킹 기록을 제공합니다.
                        </div>
                    </div>
                </div>
            </div>
            <div className="sm:w-[600px] w-full mx-auto p-4">
                <div className="mx-auto flex gap-x-1">
                    {Object.entries(latest).map(([key, value]) => {

                        return (
                            <div
                                key={`raid_card_${key}`}
                                className="w-[33%]">
                                <RaidCard
                                    data={value}
                                    raidType={key as 'clash' | 'clashV2' | 'frontier'}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
}

export default IndexComponent;