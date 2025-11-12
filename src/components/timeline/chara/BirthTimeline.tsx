import RaceIcon from "../../../commons/icon/RaceIcon";
import { charInfo } from "../../../data/trickcalChar";
import { Race } from "../../../types/trickcalTypes";
import { getDaysSince, translateRaces } from "../../../utils/function";

const BirthTimeline = ({ charaRaceMap }: { charaRaceMap: Map<Race, string[]> }) => {

    const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

    const dayToVisual = (day: number) => {
        if (day <= 0) return 0;
        return Math.sqrt(day);
        return day;
    }

    const createPositions = (charas: string[]) => {

        return charas.map(char => {
            const days = getDaysSince(charInfo[char]?.birthdate);
            const visualDist = dayToVisual(days);
            return { name: char, days, visualDist };
        });
    }

    // 모든 종족의 최근3사도 중 가장 오래된 사도
    const getGlobalMaxDays = () => {
        let maxDays = 0;
        charaRaceMap.forEach((names) => {
            names.forEach(name => {
                const days = getDaysSince(charInfo[name]?.birthdate);
                const visualDist = dayToVisual(days);
                if (visualDist > maxDays) {
                    maxDays = visualDist;
                }
            });
        });
        return maxDays || 1; // 0으로 나누기 방지
    }
    const globalMaxDays = getGlobalMaxDays();

    // 각 캐릭터의 left 백분율(%) 위치 계산
    const pixelPositions = (position: { name: string, days: number, visualDist: number }[]) => {

        return position.map(pos => ({
            ...pos,
            // (1 - (현재거리 / 최대거리)) * 100
            // (왼쪽: 오래됨, 오른쪽: 최신)
            leftPercent: (1 - (pos.visualDist / globalMaxDays)) * 100
        }));
    }

    const adjustOverlapping = (positions: { name: string, days: number, visualDist: number, leftPercent: number }[]) => {
        const sorted = [...positions].sort((a, b) => a.leftPercent - b.leftPercent);
        const minDistance = 9; // 최소 거리 (%)

        const adjusted = sorted.map((pos, index) => ({ ...pos }));

        // 왼쪽에서 오른쪽으로 순회하며 간격 조정
        for (let i = 1; i < adjusted.length; i++) {
            const prev = adjusted[i - 1];
            const current = adjusted[i];

            // 이전 캐릭터와의 거리가 최소 거리보다 작으면
            if (current.leftPercent - prev.leftPercent < minDistance) {
                // 현재 캐릭터를 오른쪽으로 밀어냄
                adjusted[i].leftPercent = prev.leftPercent + minDistance;
            }
        }


        return adjusted;
    }

    return (
        <div className="bg-white flex dark:bg-zinc-900 flex-col">
            {charaRaceMap.size === 7 && Array.from(charaRaceMap.entries()).map(([race, names]) => {

                const racePositions = createPositions(names);
                const racePixelPositions = pixelPositions(racePositions);
                const finalPositions = adjustOverlapping(racePixelPositions);

                return (
                    <div className="relative h-20 flex items-center w-[600px] mb-1"
                        key={`chara_birth_timeline_${race}`}>
                        {/* <img className="aspect-square w-12 flex items-center" src={`/images/race/${translateRaces(race)}.png`} /> */}
                        <RaceIcon name={race} />
                        <div className="absolute ml-20 z-10 top-1/2 left-0 w-full h-0.5 bg-zinc-900 dark:bg-zinc-500 " />
                        {finalPositions.map((pos, index) => (
                            <div
                                key={pos.name}
                                className={`absolute ml-20 top-0 h-full flex flex-col items-center`}
                                style={{
                                    left: `${pos.leftPercent}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                {/* 수직선 */}
                                <div className={`w-0.5 h-1/2 dark:brightness-90 translate-y-[2px] ${charInfo[pos.name]?.personality === '공명' ? 'resonance-pers' : `bg-${charInfo[pos.name]?.personality}`}`} />
                                {/* 텍스트 (눈금선 아래로) */}
                                <div
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content={charInfo[pos?.name]?.birthdate}
                                    className="text-center whitespace-nowrap mt-1 cursor-pointer">
                                    <div className={`text-[13px] truncate w-[70px] dark:text-zinc-200 font-medium`}>{pos.name}</div>
                                    <div
                                        className={`text-[12px] text-zinc-400`}>
                                        {pos.days <= 0 ? '오늘' : `${pos.days}일 전`}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            })}
        </div>
    );
}

export default BirthTimeline;