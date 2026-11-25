import { getPersonalityColor, getPersonalityDarkColor } from '@/types/trickcalTypes';
import {
    CategoryScale,
    ChartData,
    ChartDataset,
    Chart as ChartJS,
    ChartOptions,
    Filler,
    Legend,
    LinearScale,
    LineElement, Point, PointElement,
    Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../../hooks/useTheme';
import { containerDarkBG } from '../../../styles/container';
import {
    ContentRecentStats,
    DeepClashPersonalityStat,
    RecentSeasonStat,
} from '../../../types/character/characterStatsTypes';

// ChartDataLabels를 register에서 제거
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);


const CONTENT_CONFIG: Record<keyof ContentRecentStats, { label: string; color: string; }> = {
    clash: { label: '차원 대충돌', color: '#fe4a75' },
    frontier: { label: '엘리아스 프론티어', color: '#3095d2', },
    clashV2: { label: '차원 대충돌 2.0', color: '#107535', },
    deepClash: { label: '심해 대격돌', color: '#113485', },
};

const formatSeasonLabel = (seasonNumber: number) =>
    seasonNumber > 10000 ? `시즌B${seasonNumber - 10000}` : `시즌${seasonNumber}`;

const DEEP_CLASH_PERSONALITY_ORDER = ['순수', '냉정', '광기', '활발', '우울'] as const;

const CharacterRecentStats = ({
    recentStats,
    deepClashPersonalityStats = [],
}: {
    recentStats: ContentRecentStats;
    deepClashPersonalityStats?: DeepClashPersonalityStat[];
}) => {

    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? 'rgb(244,244,245)' : 'rgb(82,82,91)';
    const gridColor = theme === 'dark' ? 'rgb(39,39,42)' : 'rgb(228,228,231)';

    const charts = useMemo(() => {

        return (Object.entries(recentStats) as [keyof ContentRecentStats, RecentSeasonStat[]][])
            .filter(([, arr]) => arr.length > 0)
            .map(([key, arr]) => {
                const { label, color } = CONTENT_CONFIG[key];
                const sorted = [...arr].reverse(); // 기본이 시간 내림차순이므로 역순 만들기

                const hasBossPersonality = key !== 'frontier';

                const pointColors = hasBossPersonality
                    ? sorted.map(s => {
                        if (!s.personality) return color;

                        return theme === 'dark'
                            ? getPersonalityDarkColor(s.personality)
                            : getPersonalityColor(s.personality);
                    })
                    : color;

                const hasSideData = sorted.some(s => s.sidePickRate !== undefined);
                const dataMaxMain = sorted.length > 0 ? Math.max(...sorted.map(s => s.pickRate)) : 0;
                const dataMaxSide = hasSideData ? Math.max(...sorted.map(s => s.sidePickRate ?? 0)) : 0;
                // const yMax = Math.ceil(Math.max(dataMax * 1.2, 5));
                const yMax = Math.ceil(Math.max(Math.max(dataMaxMain, dataMaxSide) * 1.2, 5));

                // 기본 데이터셋
                const datasets: ChartDataset<"line", (number | Point | null)[]>[] = [{
                    label: hasSideData ? '셰이디의 차원' : label,
                    data: sorted.map(s => s.pickRate),
                    fill: false,
                    pointBackgroundColor: pointColors,
                    borderColor: color,
                    borderWidth: 1,
                    tension: 0.1,
                    pointBorderColor: pointColors,
                    pointRadius: 9,
                    pointHoverRadius: 9,
                    spanGaps: false,
                }];

                // 대충돌 2.0일 경우 림의 이면세계 데이터셋 추가
                if (hasSideData) {
                    const sideColor = '#fd974e';

                    datasets.push({
                        label: '림의 이면세계',
                        data: sorted.map(s => s.sidePickRate ?? 0),
                        borderColor: sideColor,
                        fill: false,
                        pointBackgroundColor: pointColors,
                        borderWidth: 1,
                        pointBorderColor: pointColors,
                        tension: 0.1,
                        pointRadius: 9,
                        pointHoverRadius: 9,
                        spanGaps: false,
                    });
                }

                const chartData: ChartData<'line'> = {
                    labels: sorted.map(s => formatSeasonLabel(s.seasonNumber)),
                    datasets: datasets
                };

                const options: ChartOptions<'line'> = {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        legend: {
                            display: hasSideData, // 대충돌 2.0일 때 범례 출력
                            labels: {
                                color: tickColor,
                                font: {
                                    size: 11
                                },
                                boxWidth: 12,
                                boxHeight: 2
                            },
                            position: "bottom"
                        },
                        tooltip: {
                            callbacks: {
                                title: ctx => {
                                    const s = sorted[ctx[0].dataIndex];
                                    return s.name
                                        ? `${formatSeasonLabel(s.seasonNumber)} ${s.name}${s.personality ? `(${s.personality})` : ''}`
                                        : formatSeasonLabel(s.seasonNumber);
                                },
                                label: ctx => hasSideData ? ` ${ctx.dataset.label}: ${ctx.parsed.y}%` : ` 픽률: ${ctx.parsed.y}%`,
                            },
                            backgroundColor: 'rgba(30,30,33,0.85)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: '#52525b',
                            borderWidth: 1,
                            cornerRadius: 6,
                        },
                        // 점 위에 픽률 텍스트 출력
                        datalabels: {
                            align: 'top',
                            anchor: 'end',
                            color: tickColor,
                            font: { size: 11, weight: 'bold' },
                            formatter: (value: number) => `${value}%`,
                            display: (ctx) => {
                                // ctx.dataset.data = 시즌별 픽률[] 3.3, 21.3, 0.3 ...
                                // ctx.dataIndex = 몇 번째 시즌인지 인덱스
                                const val = Number(ctx.dataset.data[ctx.dataIndex]) || 0;
                                if (val === 0) return false;

                                const allDatasets = ctx.chart.data.datasets;
                                // 데이터셋이 셰이디/림월드로 길이가 2인가?
                                if (allDatasets.length > 1) {
                                    const otherDatasetIdx = ctx.datasetIndex === 0 ? 1 : 0;
                                    const otherVal = Number(allDatasets[otherDatasetIdx].data[ctx.dataIndex]) || 0;

                                    // 비교 값보다 작으면 숨김
                                    if (val < otherVal) return false;
                                    // 픽률 동일하면 0번인덱스 출력
                                    if (val === otherVal && ctx.datasetIndex !== 0) return false;
                                }
                                return true;
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: { color: tickColor, font: { size: 12 } },
                            grid: { display: false },
                        },
                        y: {
                            min: 0,
                            max: yMax,
                            ticks: {
                                color: tickColor,
                                font: { size: 11 },
                                padding: 16,
                                callback: val => Number(val) > 100 ? '' : `${val}%`,
                            },
                            grid: { display: false },
                        },
                    },
                    layout: {
                        padding: { top: 24, right: 16, left: 0, bottom: 8 },
                    },
                };

                return { key, label, color, chartData, options };
            });
    }, [recentStats, tickColor, gridColor, theme]);

    const deepClashPersonalityChart = useMemo(() => {
        if (deepClashPersonalityStats.length === 0) return null;

        const seasonNumbers = [...new Set(deepClashPersonalityStats.map(stat => stat.seasonNumber))]
            .sort((a, b) => a - b);
        const personalities = DEEP_CLASH_PERSONALITY_ORDER.filter(personality =>
            deepClashPersonalityStats.some(stat => stat.personality === personality)
        );
        const statsBySeasonAndPersonality = new Map(
            deepClashPersonalityStats.map(stat => [`${stat.seasonNumber}:${stat.personality}`, stat])
        );
        const seasonStats = new Map(
            deepClashPersonalityStats.map(stat => [stat.seasonNumber, stat])
        );

        const chartData: ChartData<'line'> = {
            labels: seasonNumbers.map(formatSeasonLabel),
            datasets: personalities.map(personality => {
                const color = theme === 'dark'
                    ? getPersonalityDarkColor(personality)
                    : getPersonalityColor(personality);

                return {
                    label: `${personality}`,
                    data: seasonNumbers.map(seasonNumber =>
                        statsBySeasonAndPersonality.get(`${seasonNumber}:${personality}`)?.pickRate ?? null
                    ),
                    borderColor: color,
                    backgroundColor: color,
                    pointBackgroundColor: color,
                    pointBorderColor: color,
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: personalities.length > 1 ? 4.5 : 9,
                    pointHoverRadius: personalities.length > 1 ? 4.5 : 9,
                    fill: false,
                    spanGaps: false,
                };
            }),
        };

        const options: ChartOptions<'line'> = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    display: personalities.length > 1,
                    labels: {
                        color: tickColor,
                        font: { size: 11 },
                        boxWidth: 12,
                        boxHeight: 2,
                    },
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        title: context => {
                            const seasonNumber = seasonNumbers[context[0].dataIndex];
                            const stat = seasonStats.get(seasonNumber);
                            return `${formatSeasonLabel(seasonNumber)}${stat?.name ? ` ${stat.name}` : ''}`;
                        },
                        label: context => ` ${context.dataset.label}: ${context.parsed.y}%`,
                    },
                    backgroundColor: 'rgba(30,30,33,0.85)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#52525b',
                    borderWidth: 1,
                    cornerRadius: 6,
                },
                datalabels: {
                    align: 'top',
                    anchor: 'end',
                    color: tickColor,
                    font: { size: 11, weight: 'bold' },
                    formatter: (value: number) => `${value}%`,
                    display: context => {
                        const currentValue = Number(context.dataset.data[context.dataIndex]);
                        if (currentValue === 0) return false;
                        if (context.chart.data.datasets.length === 1) return true;

                        const valuesAtSeason = context.chart.data.datasets.map(dataset =>
                            Number(dataset.data[context.dataIndex] ?? 0)
                        );
                        const maxValue = Math.max(...valuesAtSeason);
                        return currentValue === maxValue && valuesAtSeason.indexOf(maxValue) === context.datasetIndex;
                    },
                },
            },
            scales: {
                x: {
                    ticks: { color: tickColor, font: { size: 12 } },
                    grid: { display: false },
                },
                y: {
                    min: 0,
                    // 100% 값 위에 원과 데이터 라벨이 들어갈 여백을 확보
                    max: 120,
                    ticks: {
                        color: tickColor,
                        font: { size: 11 },
                        padding: 16,
                        stepSize: 20,
                        // 기존 픽률 차트와 같이 120%는 여백으로만 사용하고 눈금에서는 숨김
                        callback: value => Number(value) > 100 ? '' : `${value}%`,
                    },
                    grid: { display: false },
                },
            },
            layout: { padding: { top: 24, right: 16, left: 0, bottom: 8 } },
        };

        const title = personalities.length === 1
            ? `심해 대격돌 ${personalities[0]} 해역`
            : '심해 대격돌 성격 해역';

        return {
            title,
            chartData,
            options,
            hasMultipleSeries: personalities.length > 1,
        };
    }, [deepClashPersonalityStats, tickColor, theme]);

    return (
        <div className={`w-full mx-auto flex flex-col gap-y-4 ${containerDarkBG} p-4 rounded-xl border border-zinc-300 dark:border-zinc-700`}>
            <div className="flex flex-col">
                <span className="text-[18px] font-bold dark:text-zinc-200">픽률 통계</span>
                <span className="text-[12px] dark:text-zinc-400 text-gray-700">
                    콘텐츠별 최대 10개 시즌의 데이터를 제공합니다.
                </span>
            </div>
            <div className="flex-1 gap-y-2 flex flex-col">
                {charts
                    .filter(({ key }) => recentStats[key].length > 0)
                    .map(({ key, label, chartData, options }) => (
                        <div key={key} className="flex flex-col gap-1">
                            <span className="text-[16px] font-bold text-gray-700 dark:text-zinc-400">{label}</span>
                            <div className={key === 'clashV2' ? 'h-[210px]' : 'h-[180px]'}>
                                <Line
                                    data={chartData}
                                    options={options}
                                    // ChartDataLabels를 특정 차트에서 plugin으로 사용해야 다른 그래프에 적용이 안 됨.
                                    plugins={[ChartDataLabels]}
                                />
                            </div>
                        </div>
                    ))}
                {deepClashPersonalityChart && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[16px] font-bold text-gray-700 dark:text-zinc-400">
                            {deepClashPersonalityChart.title}
                        </span>
                        <div className={deepClashPersonalityChart.hasMultipleSeries ? 'h-[210px]' : 'h-[180px]'}>
                            <Line
                                data={deepClashPersonalityChart.chartData}
                                options={deepClashPersonalityChart.options}
                                plugins={[ChartDataLabels]}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CharacterRecentStats
