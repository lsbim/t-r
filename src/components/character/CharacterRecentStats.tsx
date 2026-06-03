import {
    CategoryScale,
    ChartData,
    Chart as ChartJS,
    ChartOptions,
    Filler,
    Legend,
    LinearScale,
    LineElement, PointElement,
    Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../hooks/useTheme';
import { ContentRecentStats, RecentSeasonStat } from '../../types/character/characterStatsTypes';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, ChartDataLabels);


const CONTENT_CONFIG: Record<keyof ContentRecentStats, { label: string; color: string; bgColor: string }>
    = {
    clash: { label: '대충돌', color: '#8884d8', bgColor: 'rgba(136,132,216,0.1)' },
    frontier: { label: '프론티어', color: '#82ca9d', bgColor: 'rgba(130,202,157,0.1)' },
    clashV2: { label: '대충돌 2.0', color: '#ffc658', bgColor: 'rgba(255,198,88,0.1)' },
};

const formatSeasonLabel = (seasonNumber: number) =>
    seasonNumber > 10000 ? `시즌B${seasonNumber - 10000}` : `시즌${seasonNumber}`;

const CharacterRecentStats = ({ recentStats }: { recentStats: ContentRecentStats }) => {

    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? 'rgb(244,244,245)' : 'rgb(82,82,91)';
    const gridColor = theme === 'dark' ? 'rgb(39,39,42)' : 'rgb(228,228,231)';

    const charts = useMemo(() => {
        return (Object.entries(recentStats) as [keyof ContentRecentStats, RecentSeasonStat[]][])
            .filter(([, arr]) => arr.length > 0)
            .map(([key, arr]) => {
                const { label, color } = CONTENT_CONFIG[key];
                const sorted = [...arr].reverse(); // 기본이 시간 내림차순이므로 역순 만들기

                const dataMax = sorted.length > 0 ? Math.max(...sorted.map(s => s.pickRate)) : 0;
                const yMax = Math.ceil(Math.max(dataMax * 1.2, 5));

                const chartData: ChartData<'line'> = {
                    labels: sorted.map(s => formatSeasonLabel(s.seasonNumber)),
                    datasets: [{
                        label,
                        data: sorted.map(s => s.pickRate),
                        borderColor: color,
                        backgroundColor: (context) => {
                            const chart = context.chart;
                            const { ctx, chartArea, scales } = chart;

                            if (!chartArea) {
                                return color + '1a';
                            }

                            const maxVal = sorted.length > 0 ? Math.max(...sorted.map(s => s.pickRate)) : 0;

                            let yTop = scales.y.getPixelForValue(maxVal);

                            if (yTop >= chartArea.bottom) yTop = chartArea.bottom - 1;

                            const gradient = ctx.createLinearGradient(0, yTop, 0, chartArea.bottom);

                            // 투명도 그라디언트
                            gradient.addColorStop(0, color + '15');
                            gradient.addColorStop(1, color + '00');

                            return gradient;
                        },
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
                    }],
                };

                const options: ChartOptions<'line'> = {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                title: ctx => {
                                    const s = sorted[ctx[0].dataIndex];
                                    return s.name
                                        ? `${formatSeasonLabel(s.seasonNumber)} ${s.name}${s.personality ? `(${s.personality})` : ''}`
                                        : formatSeasonLabel(s.seasonNumber);
                                },
                                label: ctx => ` 픽률: ${ctx.parsed.y}%`,
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
                            display: ctx => ctx.dataset.data[ctx.dataIndex] !== 0,
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
            <span className="text-[18px] font-bold dark:text-zinc-200">컨텐츠 별 픽률</span>
            <div className="flex-1 gap-y-2 flex flex-col">
                {charts.map(({ key, label, chartData, options }) => (
                    <div key={key} className="flex flex-col gap-1">
                        <span className="text-[16px] font-bold text-gray-600 dark:text-zinc-400">{label}</span>
                        <div className="h-[180px]">
                            <Line
                                data={chartData}
                                options={options}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CharacterRecentStats