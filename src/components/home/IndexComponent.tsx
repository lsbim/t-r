import { Link } from "react-router-dom";
import PersonalityIcon from "../../commons/icon/PersonalityIcon";
import { LatestData } from "../../types/latestTypes";


const IndexComponent = ({ latest }: { latest: LatestData }) => {

    return (
        <>
            <div className="sm:w-[600px] w-full dark:bg-zinc-900 dark:text-zinc-200 mx-auto flex flex-col mt-4 bg-white p-4 shadow-md">
                <div className="flex gap-x-3 justify-center items-center">
                    <img
                        src="/images/boss/l1ly.png"
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
            <div className="sm:w-[600px] w-full mx-auto dark:bg-zinc-900 bg-white p-4">
                <div className="font-bold text-[16px] mb-2 dark:text-zinc-200">
                    최근 컨텐츠
                </div>
                <div className="mx-auto flex gap-x-1">
                    {Object.entries(latest).map(([key, value]) => {

                        let krName = '';
                        let krShortName = '';

                        if (key === 'clash') {
                            krName = '차원 대충돌';
                            krShortName = '대충돌';
                        } else if (key === 'frontier') {
                            krName = '엘리아스 프론티어';
                            krShortName = '프론티어';
                        } else if (key === 'clashV2') {
                            krName = '차원 대충돌 2.0';
                            krShortName = '대충돌 2.0';
                        }

                        const raidBGColor = 'personality' in value ? `bg-${value.personality}`
                            : `bg-[rgb(21,30,81)]`;
                        const raidTextColor = 'personality' in value ? `` : 'text-zinc-200';
                        const typeLink = key.startsWith('clash') ?
                            key.includes('V2') ? `clash/v2` : `clash/v1`
                            : key;

                        return (
                            <Link
                                to={`/${typeLink}/${value.seasonNumber}`}
                                className={`w-[33%] ${raidBGColor} ${raidTextColor} xs:text-[16px] text-[13px] p-2 shadow-md hover:animate-pulse`}
                                key={krName}>
                                <div className="font-bold mb-2 xs:inline hidden">
                                    {krName}
                                </div>
                                <div className="font-bold mb-2 xs:hidden inline">
                                    {krShortName}
                                </div>
                                <div className="font-bold mb-4">
                                    <span>{value.name}</span>
                                    {value.personality && (
                                        <span className="xs:inline hidden">
                                            {` - ${value.personality}`}
                                        </span>
                                    )}
                                </div>
                                <div className="">
                                    <div>
                                        {Number(value.seasonNumber) >= 10000 ? `베타 시즌${Number(value.seasonNumber) - 10000}` : `시즌${value.seasonNumber}`}
                                    </div>
                                    <div className="text-[14px]">
                                        {`${value.startDate} ~ ${value.endDate}`}
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </>
    );
}

export default IndexComponent;