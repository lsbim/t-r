import { Link } from "react-router-dom";

type Props = {
    raidValues: Array<{ name: string; startDate: string; endDate: string; personality?: string }>;
    raidKeys: string[]
    getYOffset: (iso: string) => number;
    BASE_DATE_HEIGHT: number;

};

const RaidBlock = ({ getYOffset, raidValues, BASE_DATE_HEIGHT, raidKeys }: Props) => {

    // console.log(raidValues)
    return (
        <>
            {raidValues.map((raid, index) => {
                const y1 = getYOffset(raid.startDate) + (BASE_DATE_HEIGHT / 2)
                const y2 = getYOffset(raid.endDate) + (BASE_DATE_HEIGHT / 2)

                // 블록의 실제 시작점과 높이
                const top = y2
                // 높이는 항상 양수가 되도록 절댓값을 사용합니다
                const height = Math.abs(y2 - y1);

                // console.log(raid)
                // 베이스라인 기준 대충돌 왼쪽 프론티어 오른쪽
                const raidPosition = 'power' in raid ? 'left-1/2'
                    : 'rules' in raid && 'right-1/2';

                const raidBGColor = 'power' in raid ? `bg-[rgb(21,30,81)]`
                    : 'rules' in raid && `bg-${raid.personality}`;
                const raidTextColor = 'power' in raid ? `text-white`
                    : 'rules' in raid && `text-black`;
                const raidUrl = 'power' in raid ? `/frontier/${raidKeys[index]}`
                    : 'sideSummary' in raid ? `/clash/v2/${raidKeys[index]}`
                        : 'rules' in raid ? `/clash/v1/${raidKeys[index]}`
                            : '/';


                return (
                    <Link
                        to={raidUrl}
                        key={"timeline_raid" + raid.startDate + raid.name}
                        className={`absolute dark:brightness-90 ${raidPosition} ${raidBGColor} ${raidTextColor} w-1/4 sm:w-[200px] flex flex-col justify-center items-center hover:animate-pulse transition cursor-pointer z-20`}
                        style={{ top: top, height: height }}
                    >
                        <div className="font-bold">{raid.name}</div>
                        <div className="text-[11px] sm:text-[12px] flex flex-col sm:flex-row">
                            <span>
                                {raid.startDate} ~
                            </span>
                            <span>
                                {raid.endDate}
                            </span>
                        </div>
                    </Link>
                )
            })}
        </>
    );
}

export default RaidBlock;