import { useMemo, useState } from "react";
import CharacterIcon from "@/components/icons/CharacterIcon";
import { findPersonalityByName, getSeasonName } from "@/utils/function";
import { useTheme } from "@/hooks/useTheme";
import { NewCharRate, RaidStatSeason, RaidStatsView } from "../../types/statTypes";
import MiniTrendCard from "./MiniTrendCard";
import StatSection from "./StatSection";

// 픽률 구간: 0%는 중립 회색, 1% 이상은 보라 단계색
const RATE_BINS = [
    { max: 0, alpha: 0 },
    { max: 5, alpha: 0.3 },
    { max: 20, alpha: 0.5 },
    { max: 50, alpha: 0.7 },
    { max: 80, alpha: 0.85 },
    { max: 100, alpha: 1 },
];

const getBinIndex = (rate: number) => {
    if (rate <= 0) return 0;

    const index = RATE_BINS.findIndex((bin, i) => i > 0 && rate <= bin.max);
    return index === -1 ? RATE_BINS.length - 1 : index;
};

const getBinColor = (binIndex: number, isDark: boolean) => {
    if (binIndex === 0) return isDark ? "rgba(161,161,170,0.18)" : "rgba(161,161,170,0.25)";

    return `rgba(${isDark ? "136,132,216" : "85,71,175"},${RATE_BINS[binIndex].alpha})`;
};

const formatRate = (rate: number) => `${rate.toFixed(1)}%`;

// 2025-11-20 → 25.11.20
const formatDate = (date: string) => date.slice(2).replace(/-/g, ".");

const daysBetween = (from: string, to: string) =>
    Math.round((Date.parse(to) - Date.parse(from)) / 86400000);

// 열 헤더용 짧은 시즌 표기 (베타 시즌1 → 1)
const getShortSeason = (season: number) => String(season > 10000 ? season - 10000 : season);

// 선택한 사도 요약 (출시일, 첫 집계, 최고, 최신) + 추이 차트
const SelectedCharCard = ({ char, seasons, seasonLabels }: {
    char: NewCharRate;
    seasons: RaidStatSeason[];
    seasonLabels: string[];
}) => {
    // 출시 이후(집계 대상) 시즌만
    const eligible = char.rates.flatMap((rate, index) => (rate === null ? [] : [{ rate, index }]));
    const first = eligible[0];
    if (!first) return null;

    const latest = eligible[eligible.length - 1];
    const prev = eligible.length > 1 ? eligible[eligible.length - 2] : null;
    const peak = eligible.reduce((best, cur) => (cur.rate > best.rate ? cur : best), first);

    const average = eligible.reduce((sum, { rate }) => sum + rate, 0) / eligible.length;
    const delta = prev ? latest.rate - prev.rate : null;
    const waitDays = daysBetween(char.birthdate, seasons[first.index].startDate);

    const stats = [
        {
            label: first.index === 0 ? "구간 시작" : "첫 집계",
            value: formatRate(first.rate),
            sub: `${seasonLabels[first.index]}, 출시 ${waitDays}일 후`,
        },
        {
            label: "최고",
            value: formatRate(peak.rate),
            sub: seasonLabels[peak.index],
        },
        {
            label: "평균",
            value: formatRate(average),
            sub: `${eligible.length}개 시즌 기준`,
        },
    ];

    const releaseMarker = first.index > 0
        ? [{ index: first.index, level: 0, label: `${seasonLabels[first.index]} 첫 집계` }]
        : [];

    return (
        <div className="mb-4 grid gap-3 md:min-h-[206px] md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
            <div className="flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2 w-full min-w-0">
                    <div className={`w-[60px] h-[60px] shrink-0 object-cover overflow-hidden rounded-full border-4 border-${findPersonalityByName(char.name)}-dark`}>
                        <img
                            src={`/images/profile/${char.name}.webp`}
                            alt={char.name}
                        />
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-bold truncate text-start text-[14px] dark:text-zinc-200">
                            {char.name}
                        </span>
                        <span className="truncate text-start text-[12px] text-gray-700 dark:text-zinc-400">
                            {formatDate(char.birthdate)} 출시
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-y-1.5">
                    {stats.map(({ label, value, sub }) => (
                        <div key={label} className="flex flex-wrap items-baseline gap-x-2">
                            <span className="w-[52px] shrink-0 text-[12px] text-gray-700 dark:text-zinc-400">{label}</span>
                            <span className="text-[16px] font-bold dark:text-zinc-200">{value}</span>
                            <span className="text-[12px] text-gray-700 dark:text-zinc-400">{sub}</span>
                        </div>
                    ))}
                </div>
            </div>

            <MiniTrendCard
                label={`픽률`}
                values={char.rates}
                seasonLabels={seasonLabels}
                format={rate => formatRate(rate)}
                yRange={{ min: 0, max: 100 }}
                difficultyChanges={releaseMarker} />
        </div>
    );
};

const NewCharPickGrid = ({ view }: { view: RaidStatsView }) => {
    const { seasons, newChars } = view;
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // 최신 출시가 위로 (출시일 내림차순, 같은 날이면 이름순)
    const chars = useMemo(() => [...newChars].sort((a, b) =>
        a.birthdate < b.birthdate ? 1 : a.birthdate > b.birthdate ? -1 : a.name < b.name ? -1 : 1
    ), [newChars]);

    const [selectedName, setSelectedName] = useState(chars[0]?.name ?? "");
    const selectedChar = chars.find(char => char.name === selectedName) ?? chars[0];

    const seasonLabels = seasons.map(season => getSeasonName(season.season));
    const shortLabels = seasons.map(season => getShortSeason(season.season));
    const isBeta = seasons[0]?.season > 10000;
    const unitLabel = isBeta ? "베타 시즌" : "시즌";

    // 칸 폭은 컨테이너를 꽉 채우고(1fr), 이름 열 폭은 --name-col로 반응형 지정. 헤더와 행이 같은 템플릿을 써서 열을 맞춤
    const rowStyle = {
        gridTemplateColumns: `var(--name-col) repeat(${seasons.length}, minmax(0, 1fr))`,
    } as const;

    return (
        <StatSection
            title="신규 사도 픽률"
        >
            {chars.length === 0 || !selectedChar ? (
                <p className="text-[13px] text-gray-700 dark:text-zinc-400">조회 구간에 새로 집계되는 사도가 없습니다.</p>
            ) : (
                <>
                    <SelectedCharCard char={selectedChar} seasons={seasons} seasonLabels={seasonLabels} />

                    <div className="w-full min-w-0 overflow-x-auto">
                        <div className="w-full min-w-[300px] [--name-col:112px] sm:[--name-col:140px]">
                            {/* 시즌 헤더: 마지막 열 위에만 '최신' (InfoComponent 안내 텍스트 규격) */}
                            <div className="px-1 pb-1 flex flex-col gap-y-1">
                                <div className="grid" style={rowStyle}>
                                    <span
                                        className="text-center text-[12px] font-bold leading-4 text-orange-500"
                                        style={{ gridColumn: seasons.length + 1 }}>
                                        최신
                                    </span>
                                </div>
                                <div className="grid items-end" style={rowStyle}>
                                    {/* 좁은 화면: 왼쪽에 단위 표기, md 이상: 숫자 아래에 표기 (자리는 유지) */}
                                    <span className="pr-1 text-right text-[12px] text-gray-700 dark:text-zinc-400 md:invisible">
                                        {unitLabel}
                                    </span>
                                    {shortLabels.map((label, index) => (
                                        <span
                                            key={seasons[index].season}
                                            className="flex flex-col items-center text-center leading-4">
                                            <span className="text-[14px] font-bold dark:text-zinc-200">
                                                {label}
                                            </span>
                                            <span className="hidden whitespace-nowrap text-[12px] text-gray-700 dark:text-zinc-400 md:block">
                                                {unitLabel}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 사도 목록 */}
                            <div className="flex flex-col">
                                {chars.map(({ name, birthdate, rates, counts }) => {
                                    const isSelected = name === selectedChar.name;
                                    const firstIndex = rates.findIndex(rate => rate !== null);

                                    return (
                                        <button
                                            key={name}
                                            type="button"
                                            aria-pressed={isSelected}
                                            onClick={() => setSelectedName(name)}
                                            className={`grid w-full items-stretch rounded-md px-1 text-left transition-colors hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 dark:hover:bg-zinc-800 ${isSelected ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
                                            style={rowStyle}>
                                            <span className="flex min-w-0 items-center gap-x-1 py-1.5">
                                                <CharacterIcon name={name} type="micro" />
                                                <span className="flex min-w-0 flex-col leading-tight">
                                                    <span className={`truncate text-[14px] dark:text-zinc-200 ${isSelected ? "font-bold" : ""}`}>{name}</span>
                                                    <span className="text-[12px] text-gray-700 dark:text-zinc-400">{formatDate(birthdate)}</span>
                                                </span>
                                            </span>

                                            {rates.map((rate, index) => {
                                                const season = seasons[index];

                                                // 출시 전: 박스 없이 빈칸 (호버 시 안내만)
                                                if (rate === null) {
                                                    return (
                                                        <span
                                                            key={season.season}
                                                            aria-hidden="true"
                                                            data-tooltip-id="my-tooltip"
                                                            data-tooltip-content={`${seasonLabels[index]} ${name} 출시 전`} />
                                                    );
                                                }

                                                let tooltip = `${seasonLabels[index]} ${name}\n${counts[index] ?? 0}/${season.userTotalCount}(${formatRate(rate)})`;

                                                return (
                                                    <span
                                                        key={season.season}
                                                        aria-hidden="true"
                                                        className="group flex items-center px-0.5 sm:px-1"
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content={tooltip}>
                                                        <span
                                                            className="block h-6 w-full rounded-[2px] group-hover:ring-2 group-hover:ring-zinc-700 dark:group-hover:ring-zinc-200"
                                                            style={{ backgroundColor: getBinColor(getBinIndex(rate), isDark) }} />
                                                    </span>
                                                );
                                            })}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </StatSection>
    );
};

export default NewCharPickGrid;