import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../../hooks/useTheme';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

interface RankBucket {
    label: string;
    startRank: number;
    count: number;
}

interface SelectRankHistogramChartProps {
    rankDistribution: RankBucket[];
    totalUses: number;
}

const SelectRankHistogramChart: React.FC<SelectRankHistogramChartProps> = ({
    rankDistribution,
    totalUses,
}) => {

    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? 'rgb(244,244,245)' : 'rgb(82,82,91)';
    const gridColor = theme === 'dark' ? 'rgb(39,39,42)' : 'rgb(228,228,231)';

    const counts = rankDistribution.map(b => b.count);
    const maxCount = Math.max(...counts, 1);

    // 그라데이션
    const backgroundColors = rankDistribution.map((_, i) => {
        const ratio = i / Math.max(rankDistribution.length - 1, 1);
        const alpha = 0.9 - ratio * 0.5; // 0.9 → 0.4
        // return `rgba(99, 102, 241, ${alpha})`;
        return `#8884d8`;
    });

    const chartData = {
        labels: rankDistribution.map(b => b.label),
        datasets: [
            {
                label: '사용 수',
                data: counts,
                backgroundColor: '#8884d8',
                borderRadius: 0.1,
                barPercentage: 1.0,
                categoryPercentage: 0.97,
                borderSkipped: false,
                maxBarThickness: 30, // 두께 상한
            }
        ]
    };

    const chartOptions: ChartOptions<'bar'> = {
        interaction: { // 바가 있는 칸이면 바를 벗어나도 툴팁 출력
            intersect: false,
            mode: 'index',
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: ([item]) => `${item.label}위`,
                    label: (context) => {
                        const y = context.parsed.y ?? 0;
                        const pct = totalUses > 0
                            ? ((y / totalUses) * 100).toFixed(1)
                            : '0';
                        return `${y}명 (${pct}%)`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    // 30개 레이블을 전부 표기하면 겹치므로 5칸 단위로만 표기
                    callback: (_, i) => {
                        if (i % 5 === 0) return `${rankDistribution[i]?.startRank}위`;
                        return '';
                    },
                    maxRotation: 0,
                    color: tickColor,
                },
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                max: 10, // 구간별 y축 최대값 10으로 고정해서 직관적으로
                ticks: {
                    stepSize: Math.ceil(maxCount / 5),
                    color: tickColor,
                    callback: (value) => value === 0 ? '' : value, // tick 0일땐 미출력
                    display: false
                },
                grid: {
                    color: gridColor,
                },
                border: {
                    display: false,
                },
            },
        },
        layout: {
            padding: {
                top: 5,
                right: 10,
                left: 0,
                bottom: 0,
            },
        },
    };

    return (
        <div className="w-full p-3 h-[200px] flex flex-col justify-center items-center gap-y-3 bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-xl border border-zinc-300">
            <span className="font-bold">
                랭킹 구간별 분포
            </span>
            <div className="flex-1 min-h-0 dark:brightness-90 w-full">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default SelectRankHistogramChart;