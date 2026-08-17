import { Link } from "react-router-dom";
import { LatestSummary } from "../../types/latestTypes";
import BossProfile from "../icon/BossProfile";
import { containerDarkBG } from "../../styles/container";

const HomeRaidCard = ({ data, raidType, rounded }: {
    data: LatestSummary,
    raidType: 'clash' | 'clashV2' | 'frontier',
    rounded?: 'left' | 'right'
}) => {

    const borderColor = 'border-[3px] ' + ('personality' in data ? `border-${data.personality}`
        : `border-[oklch(0.262_0.094_270.913)] dark:border-[oklch(0.35_0.094_270.913)]`);

    const bgColor = 'personality' in data ? `bg-${data.personality}`
        : `bg-[oklch(0.262_0.094_270.913)] dark:bg-[oklch(0.35_0.094_270.913)]`;

    const headerTextColor = 'personality' in data ? `` : 'text-zinc-200';

    let krName = '';
    let krShortName = '';

    if (raidType === 'clash') {
        krName = '차원 대충돌';
        krShortName = '대충돌';
    } else if (raidType === 'frontier') {
        krName = '엘리아스 프론티어';
        krShortName = '프론티어';
    } else if (raidType === 'clashV2') {
        krName = '차원 대충돌 2.0';
        krShortName = '대충돌 2.0';
    }

    const typeLink = raidType.startsWith('clash') ?
        raidType.includes('V2') ? `clash/v2` : `clash/v1`
        : raidType;

    return (
        <Link
            to={`/${typeLink}/${data.seasonNumber}`}
            // 서브픽셀 문제는 will-change-transform 도입으로 해결
            className={`w-full flex flex-col rounded-lg will-change-transform ${borderColor} ${containerDarkBG} dark:shadow-zinc-900`}>
            <div className={`h-1/8 p-1 py-2 font-bold text-[12px] ${bgColor} ${headerTextColor} text-center`}>
                <span className="mb-2 xs:inline hidden text-[18px]">
                    {krName}
                </span>
                <span className="mb-2 xs:hidden inline text-[15px]">
                    {krShortName}
                </span>
                <div className="mt-1 flex sm:flex-row flex-col gap-x-1 items-center justify-center">
                    <span className="text-[12px]">
                        {Number(data.seasonNumber) >= 10000 ? `베타 시즌${Number(data.seasonNumber) - 10000}` : `시즌${data.seasonNumber}`}
                    </span>
                    <span className=" text-[11px]">
                        {data.name}
                    </span>
                </div>
            </div>
            <div className="relative min-h-[30px] overflow-hidden">
                <div className="absolute right-0 ml-[-60px]">
                    <BossProfile
                        name={data?.name}
                        personality={data?.personality}
                    />
                </div>
            </div>
            <div className="text-[12px] justify-center items-center p-2 text-zinc-700 dark:text-gray-400 flex sm:flex-row flex-col">
                <span>
                    {`${data.startDate} ~`}
                </span>
                <span>
                    {` ${data.endDate}`}
                </span>
            </div>
        </Link>
    );
}

export default HomeRaidCard;