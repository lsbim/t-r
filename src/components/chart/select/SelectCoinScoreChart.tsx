import React, { useMemo } from 'react';
import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../../hooks/useTheme';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
);

interface SelectCoinScoreChartItem {
    label: string;
    coinHigh: number;
    coinLow: number;
    unusedAvgRank: number | null;
    unusedCount: number;
    usedAvgRank: number;
    usedCount: number;
}

interface SelectCoinScoreChartProps {
    comparisonData: SelectCoinScoreChartItem[];
}

const USED_COLOR = '#D97706';   // 선택 사도 사용
const UNUSED_COLOR = '#8884d8'; // 미사용

const SelectCoinScoreChart: React.FC<SelectCoinScoreChartProps> = ({ comparisonData }) => {
    
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? 'rgb(244,244,245)' : 'rgb(82,82,91)';
    const gridColor = theme === 'dark' ? 'rgb(39,39,42)' : 'rgb(228,228,231)';

    const chartData = useMemo(() => ({
        labels: comparisonData.map(b => b.label),
        datasets: [
            {
                label: '사용',
                data: comparisonData.map(b => b.usedAvgRank),
                borderColor: USED_COLOR,
                backgroundColor: USED_COLOR,
                pointBackgroundColor: USED_COLOR,
                pointRadius: 4,
                tension: 0.1,
                spanGaps: true,
            },
            {
                label: '미사용',
                data: comparisonData.map(b => b.unusedAvgRank),
                borderColor: UNUSED_COLOR,
                backgroundColor: UNUSED_COLOR,
                pointBackgroundColor: UNUSED_COLOR,
                // pointStyle: 'triangle',
                pointRadius: 4,
                borderDash: [6, 4],
                tension: 0.1,
                spanGaps: true,
            },
        ],
    }), [comparisonData]);

    const chartOptions: ChartOptions<'line'> = useMemo(() => ({
        interaction: {
            intersect: false,
            mode: 'index',
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                    color: tickColor
                },
            },
            tooltip: {
                callbacks: {
                    title: ([item]) => `실체의 코인 ${comparisonData[item.dataIndex]?.label}`,
                    label: (context) => {
                        const bin = comparisonData[context.dataIndex];
                        const n = context.datasetIndex === 0 ? bin.usedCount : bin.unusedCount;
                        const value = context.parsed.y;

                        if (value == null) return `${context.dataset.label}: 표본 없음`;

                        return `${context.dataset.label}: 평균 ${Math.round(value)}위 (${n}명)`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: tickColor,
                    maxRotation: 0
                },
                grid: { display: false },
            },
            y: {
                reverse: true,
                min: 1,
                ticks: {
                    color: tickColor,
                    callback: (value) => `${value}위`,
                },
                grid: { color: gridColor },
                border: { display: false },
            },
        },
        layout: {
            padding: {
                top: 5,
                right: 10,
                left: 0,
                bottom: 0
            },
        },
    }), [comparisonData, tickColor, gridColor]);

    return (
        <div className="w-full px-3 py-1 h-[250px] flex flex-col justify-center items-center gap-y-3 bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-xl border border-zinc-300">
            <span className="font-bold pt-2">
                코인 구간별 평균 순위 비교
            </span>
            <div className="flex-1 min-h-0 dark:brightness-90 w-full">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default React.memo(SelectCoinScoreChart);