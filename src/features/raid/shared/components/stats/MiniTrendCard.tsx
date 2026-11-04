import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    ChartOptions,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import type { ReactNode } from "react";
import { Line } from "react-chartjs-2";
import { useTheme } from "@/hooks/useTheme";
import InfoIcon from "@/components/icons/InfoIcon";

ChartJS.register(
    annotationPlugin,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
);
interface DifficultyChange {
    index: number;  // 새로운 난이도가 시작되는 시즌 인덱스
    level: string | number;  // 변경된 난이도
}

interface MiniTrendCardProps {
    label: string;
    values: (number | null)[]; // 시즌 순서 (마지막이 최신 시즌)
    seasonLabels: string[]; // values와 같은 순서
    format: (value: number) => string;
    yRange?: { min: number; max: number };
    tooltip?: string;
    difficultyChanges?: DifficultyChange[];
    children?: ReactNode;
}

// 최신 시즌 값 + 직전 시즌 값 + 시즌별 추이 선
const MiniTrendCard = ({
    label,
    values,
    seasonLabels,
    format,
    yRange,
    tooltip,
    difficultyChanges,
    children,
}: MiniTrendCardProps) => {

    const { theme } = useTheme();
    const themeColor = theme === 'dark' ? '#AAAAAA' : '#666666'

    const lastIndex = values.length - 1;
    const current = values[lastIndex];
    const prev = lastIndex > 0 ? values[lastIndex - 1] : null;

    // 난이도 변경 시즌 인덱스와 난이도명
    const difficultyByIndex = new Map(
        (difficultyChanges ?? [])
            .filter(({ index }) => index > 0 && index <= lastIndex)
            .map(({ index, level }) => [index, String(level)])
    );

    // 난이도 변경 경계선
    const difficultyAnnotations: Record<string, any> = {};

    difficultyByIndex.forEach((_, index) => {
        difficultyAnnotations[`difficulty_${index}`] = {
            type: 'line',
            xMin: index - 0.5,
            xMax: index - 0.5,
            borderColor: themeColor,
            borderWidth: 1,
            borderDash: [3, 3],
            drawTime: 'beforeDatasetsDraw',
            clip: false,
        };
    });

    const chartData = {
        labels: seasonLabels,
        datasets: [{
            label,
            data: values,
            borderColor: themeColor,
            backgroundColor: '#8884d8',
            borderWidth: 2,
            tension: 0.1,

            pointRadius: values.map((_, i) => (i === lastIndex ? 4 : 0)),
            pointBackgroundColor: '#8884d8',  // 점 내부 색상
            pointBorderColor: 'transparent',  // 점 테두리 제거
            pointBorderWidth: 0,              // 기본 테두리 두께 제거

            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#8884d8',
            pointHoverBorderColor: 'transparent',
            pointHoverBorderWidth: 0,
            spanGaps: false,
        }],
    };

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 0,
        interaction: { mode: 'index', intersect: false, axis: 'x' },
        plugins: {
            legend: { display: false },
            annotation: {
                annotations: difficultyAnnotations,
            },
            tooltip: {
                filter: item => item.parsed.y !== null,
                callbacks: {
                    title: items => seasonLabels[items[0].dataIndex],
                    label: item => ` ${format(item.parsed.y as number)}`,
                },
                backgroundColor: 'rgba(30, 30, 33, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                cornerRadius: 6,
                displayColors: false,
            },
        },
        scales: {
            x: {
                display: true,

                grid: {
                    display: false,
                },

                border: {
                    display: false,
                },

                ticks: {
                    color: themeColor,
                    font: {
                        size: 11,
                    },
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                    align: 'inner',
                    padding: 2,

                    // 첫 시즌과 마지막 시즌만 표시
                    callback: (_value, index) => {
                        const season = seasonLabels[index];
                        const difficulty = difficultyByIndex.get(index);

                        // 난이도가 변경된 시즌은 두 줄로 표시
                        if (difficulty) {
                            return ['', difficulty.includes('맛') ? difficulty : `${difficulty}단계`];
                        }

                        if (index === 0 || index === lastIndex) {
                            return season;
                        }

                        return '';
                    },
                },
            },
            y: { display: false, grace: '10%', ...yRange },
        },
        layout: {
            padding: {
                top: 15,
                right: 8,
                left: 8,
                bottom: 0,
            },
        },
    };

    return (
        <div className="flex flex-col min-w-0 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
            {/* 지표 제목 + 설명 */}
            <div className="flex items-center gap-x-1">
                <span className="text-[13px] font-bold text-gray-600 dark:text-zinc-400">
                    {label}
                </span>

                {tooltip && <InfoIcon text={tooltip} size={3} />}
            </div>

            {/* 최신 시즌 + 직전 시즌 */}
            <div className="flex lg:flex-row flex-col items-baseline gap-x-2 dark:text-zinc-200">
                <span className="text-2xl font-bold">
                    {current === null ? '-' : format(current)}
                </span>

                {prev !== null && (
                    <span className="text-[12px] text-gray-600 dark:text-zinc-400">
                        {seasonLabels[lastIndex - 1]} {format(prev)}
                    </span>
                )}
            </div>

            {/* 추이 차트 */}
            <div className="h-[120px]">
                <Line data={chartData} options={chartOptions} />
            </div>

            {children}
        </div>
    );
};

export default MiniTrendCard;