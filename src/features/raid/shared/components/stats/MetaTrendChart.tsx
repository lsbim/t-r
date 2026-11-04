import { lineList } from "@/types/trickcalTypes";
import { getSeasonName } from "@/utils/function";
import { RaidStatsView } from "../../types/statTypes";
import MiniTrendCard from "./MiniTrendCard";
import StatSection from "./StatSection";

// 메타 다양성(유효/고유 조합 수, 1위 조합 점유, 필수 사도)과 메타 변화량(전체/열별)
const MetaTrendChart = ({ view }: { view: RaidStatsView }) => {
    const { seasons, diversities, essentials, metaChanges } = view;
    const seasonLabels = seasons.map(season => getSeasonName(season.season));
    const essentialNames = essentials[essentials.length - 1].map(char => char.name);

    const difficultyChanges = seasons
        .map((season, index) => ({
            index,
            level: season.maxLvl,
        }))
        .filter((season, index, arr) =>
            index === 0 ||
            season.level !== arr[index - 1].level
        );

        console.log(metaChanges)

    return (
        <>
            <StatSection
                title="메타 다양성">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <MiniTrendCard
                        label="유효 조합 수"
                        tooltip="사실상 몇 가지 조합만 쓰였는지"
                        values={diversities.map(d => d.effectiveCount)}
                        seasonLabels={seasonLabels}
                        format={value => `${value.toFixed(1)}개`}
                        difficultyChanges={difficultyChanges}
                    />
                    <MiniTrendCard
                        label="고유 조합 수"
                        tooltip="서로 다른 조합이 전부 몇 가지인지"
                        values={diversities.map(d => d.uniqueCount)}
                        seasonLabels={seasonLabels}
                        format={value => `${value}개`}
                        difficultyChanges={difficultyChanges}
                    />
                    <MiniTrendCard
                        label="최다 사용 조합 점유"
                        tooltip="가장 많이 쓰인 조합을 쓴 팀 비율"
                        values={diversities.map(d => d.top1Share)}
                        seasonLabels={seasonLabels}
                        format={value => `${Math.round(value)}%`}
                        yRange={{ min: 0, max: 100 }}
                        difficultyChanges={difficultyChanges}
                    />
                    <MiniTrendCard
                        label="필수 사도"
                        tooltip="픽률 90% 넘는 사도"
                        values={essentials.map(list => list.length)}
                        seasonLabels={seasonLabels}
                        format={value => `${value}명`}
                        difficultyChanges={difficultyChanges}>
                        <div className="flex flex-wrap gap-1 mt-2 text-[12px] text-gray-800 dark:text-zinc-200">
                            {essentialNames.map(name => (
                                <span key={name} className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </MiniTrendCard>
                </div>
            </StatSection >

            <StatSection
                title="메타 변화량"
                info="지난 시즌과 비교해 사도 자리 중 몇 %가 다른 사도로 바뀌었는지를 나타냅니다.
                0%는 똑같음, 100%는 전부 바뀜입니다.">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <MiniTrendCard
                        label="전체"
                        values={metaChanges.map(change => change?.total ?? null)}
                        seasonLabels={seasonLabels}
                        format={value => `${Math.round(value)}%`}
                        yRange={{ min: 0, max: 100 }}
                        difficultyChanges={difficultyChanges} />
                    {lineList.map(line => (
                        <MiniTrendCard
                            key={line}
                            label={line}
                            values={metaChanges.map(change => change?.lines[line] ?? null)}
                            seasonLabels={seasonLabels}
                            format={value => `${Math.round(value)}%`}
                            yRange={{ min: 0, max: 100 }}
                            difficultyChanges={difficultyChanges} />
                    ))}
                </div>
            </StatSection>
        </>
    );
};

export default MetaTrendChart;