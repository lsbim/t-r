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
import { useTheme } from '../../hooks/useTheme';
import { ContentRecentStats, RecentSeasonStat } from '../../types/character/characterStatsTypes';

// ChartDataLabels를 register에서 제거
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);


const CONTENT_CONFIG: Record<keyof ContentRecentStats, { label: string; color: string; }>
    = {
    clash: { label: '대충돌', color: '#fe4a75' },
    frontier: { label: '프론티어', color: '#3095d2', },
    clashV2: { label: '대충돌 2.0', color: '#107535', },
};

const formatSeasonLabel = (seasonNumber: number) =>
    seasonNumber > 10000 ? `시즌B${seasonNumber - 10000}` : `시즌${seasonNumber}`;

const CharacterRecentStats = ({ recentStats }: { recentStats: ContentRecentStats }) => {

    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? 'rgb(244,244,245)' : 'rgb(82,82,91)';
    const gridColor = theme === 'dark' ? 'rgb(39,39,42)' : 'rgb(228,228,231)';

    const charts = useMemo(() => {

        const getGradient = (ctxObj: any, hexColor: string, max: number) => {
            const { ctx, chartArea, scales } = ctxObj.chart;
            if (!chartArea) {
                return hexColor + '1a';
            }
            let yTop = scales.y.getPixelForValue(max);
            if (yTop >= chartArea.bottom) yTop = chartArea.bottom - 1;

            const gradient = ctx.createLinearGradient(0, yTop, 0, chartArea.bottom);
            gradient.addColorStop(0, hexColor + '15');
            gradient.addColorStop(1, hexColor + '00');

            return gradient;
        };

        return (Object.entries(recentStats) as [keyof ContentRecentStats, RecentSeasonStat[]][])
            .filter(([, arr]) => arr.length > 0)
            .map(([key, arr]) => {
                const { label, color } = CONTENT_CONFIG[key];
                const sorted = [...arr].reverse(); // 기본이 시간 내림차순이므로 역순 만들기

                const hasSideData = sorted.some(s => s.sidePickRate !== undefined);
                const dataMaxMain = sorted.length > 0 ? Math.max(...sorted.map(s => s.pickRate)) : 0;
                const dataMaxSide = hasSideData ? Math.max(...sorted.map(s => s.sidePickRate ?? 0)) : 0;
                // const yMax = Math.ceil(Math.max(dataMax * 1.2, 5));
                const yMax = Math.ceil(Math.max(Math.max(dataMaxMain, dataMaxSide) * 1.2, 5));

                // 기본 데이터셋
                const datasets: ChartDataset<"line", (number | Point | null)[]>[] = [{
                    label: hasSideData ? '셰이디의 차원' : label,
                    data: sorted.map(s => s.pickRate),
                    borderColor: color,
                    backgroundColor: (ctx: any) => getGradient(ctx, color, dataMaxMain),
                    fill: 'origin',
                    pointBackgroundColor: color,
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: color,
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2,
                    spanGaps: false,
                }];

                // 대충돌 2.0일 경우 림의 이면세계 데이터셋 추가
                if (hasSideData) {
                    const sideColor = '#fd974e';

                    datasets.push({
                        label: '림의 이면세계',
                        data: sorted.map(s => s.sidePickRate ?? 0),
                        borderColor: sideColor,
                        backgroundColor: (ctx: any) => getGradient(ctx, sideColor, dataMaxSide),
                        fill: 'origin',
                        pointBackgroundColor: sideColor,
                        borderWidth: 2,
                        tension: 0.1,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointHoverBackgroundColor: sideColor,
                        pointHoverBorderColor: '#ffffff',
                        pointHoverBorderWidth: 2,
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
                            grid: { color: gridColor },
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
                            grid: { color: gridColor },
                        },
                    },
                    layout: {
                        padding: { top: 24, right: 16, left: 0, bottom: 8 },
                    },
                };

                return { key, label, color, chartData, options };
            });
    }, [recentStats, tickColor, gridColor]);

    return (
        <div className="w-full mx-auto flex flex-col gap-y-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-300 dark:border-zinc-700">
            <div className="flex flex-col">
                <span className="text-[18px] font-bold dark:text-zinc-200">픽률 통계</span>
                <span className="text-[12px] dark:text-zinc-400 text-gray-600">
                    컨텐츠 별 5개 시즌의 데이터를 제공합니다.
                </span>
            </div>
            <div className="flex-1 gap-y-2 flex flex-col">
                {charts
                    .filter(({ key }) => recentStats[key].length > 0)
                    .map(({ key, label, chartData, options }) => (
                        <div key={key} className="flex flex-col gap-1">
                            <span className="text-[16px] font-bold text-gray-600 dark:text-zinc-400">{label}</span>
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
            </div>
        </div>
    );
};

export default CharacterRecentStats