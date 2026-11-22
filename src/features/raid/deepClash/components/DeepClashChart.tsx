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
import type { ScriptableContext } from 'chart.js';
import { useMemo } from 'react';
import { Line } from "react-chartjs-2";
import InfoIcon from "../../../../components/icons/InfoIcon";
import { useTheme } from "../../../../hooks/useTheme";
import { containerDarkBG } from "../../../../styles/container";
import { DeepClashPlayerData, DeepClashSeasonData, DeepClashType } from "../../../../types/deepClashTypes";
import { parseResonanceBaseName } from "../../../../utils/resonanceFunction";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// 오리카 전용
const lineCount = (score: number) => {
    const c = 0.5681983931;
    const k = 1.42003098e-6;
    return -c + Math.sqrt(c * c + k * score);
};

const formatLineCount = (score: number) =>
    (Math.floor(lineCount(score) * 100) / 100).toFixed(2);

// processDeepClashData로 만든 데이터를 받는다. 보스는 score, 성격해역은 grade(수심)/duration
const DeepClashChart = ({
    data,
    type,
    select,
    durationAxisMax
}: {
    data: DeepClashSeasonData,
    type: DeepClashType,
    select?: string,
    durationAxisMax?: number
}) => {

    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? 'rgb(244,244,245)' : 'rgb(82,82,91)';
    const gridColor = theme === 'dark' ? 'rgb(39,39,42)' : 'rgb(228,228,231)';

    const arr = data?.data;
    const isBoss = type === 'boss';
    const selectedBaseName = select ? parseResonanceBaseName(select)?.baseName ?? select : undefined;
    const depthStats = useMemo(() => {
        if (isBoss) return null;
        const depths = arr
            .map(item => item.personalities[type].depth)
            .filter(Number.isFinite);
        if (depths.length === 0) return null;

        const maxDepth = Math.max(...depths);
        const minDepth = Math.min(...depths);
        return {
            average: depths.reduce((sum, depth) => sum + depth, 0) / depths.length,
            max: maxDepth,
            maxCount: depths.filter(depth => depth === maxDepth).length,
            min: minDepth,
            minCount: depths.filter(depth => depth === minDepth).length,
        };
    }, [arr, isBoss, type]);

    // 선택한 사도를 사용한 유저 (공명 사도는 본명으로 선택해도 성격 변형을 포함)
    const isSelected = (item: DeepClashPlayerData) =>
        !!select && item.arr.some(name =>
            name === select || (parseResonanceBaseName(name)?.baseName ?? name) === selectedBaseName
        );

    const chartData = {
        labels: arr?.map(item => item.rank) || [],
        datasets: type === 'boss'
            ? [
                {
                    label: '점수(단위: 억)',
                    data: arr.map(item => item.score / 100000000),
                    borderColor: '#8884d8',
                    backgroundColor: 'rgba(136, 132, 216, 0.1)',
                    yAxisID: 'y_main',
                    tension: 0.1,
                    // 캐릭터 선택 시 선택 기록을 강조하고, 선택이 없으면 기존 표시를 유지
                    pointRadius: arr.map(item => !select ? 0 : isSelected(item) ? 5 : 1.5),
                    pointBackgroundColor: '#8884d8',
                    pointBorderWidth: 0,
                    pointHoverRadius: (context: ScriptableContext<'line'>) => !select ? 0 : isSelected(arr[context.dataIndex]) ? 5 : 1.5,
                    pointHoverBorderWidth: 0,
                },
            ]
            : [
                // 해역 기록은 순위순이 아니라서 선 대신 점만 표시
                {
                    label: '클리어 시간',
                    data: arr.map(item => item.personalities[type].duration),
                    backgroundColor: '#8884d8',
                    pointBackgroundColor: '#8884d8',
                    yAxisID: 'y_main',
                    showLine: false,
                    pointRadius: 3,
                    pointHoverRadius: 3,
                    pointHoverBorderWidth: 0,
                },
                {
                    label: '수심',
                    data: arr.map(item => item.personalities[type].depth),
                    backgroundColor: '#82ca9d',
                    pointBackgroundColor: '#82ca9d',
                    yAxisID: 'y_depth',
                    showLine: false,
                    pointRadius: 3,
                    pointHoverRadius: 3,
                    pointHoverBorderWidth: 0,
                },
            ]
    };

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: !isBoss,
                position: 'bottom' as const,
                labels: {
                    color: tickColor
                }
            },
            tooltip: {
                callbacks: {
                    title: function (context) {
                        return `순위: ${context[0].label}`;
                    },
                    label: function (context) {
                        if (context.dataset.label === '클리어 시간') return `클리어 시간: ${context.formattedValue}초`;
                        if (isBoss && context.dataset.label === '점수(단위: 억)') {
                            const score = arr[context.dataIndex]?.score;
                            if (score !== undefined) {
                                return `${context.dataset.label}: ${context.formattedValue} (약 +${formatLineCount(score)}줄)`;
                            }
                        }
                        return `${context.dataset.label}: ${context.formattedValue}`;
                    },
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: tickColor
                },
                grid: {
                    color: gridColor,
                    display: false
                }
            },
            // 왼쪽 Y축 (보스: 점수, 해역: 클리어 시간)
            y_main: {
                type: 'linear',
                position: 'left',
                max: isBoss ? undefined : durationAxisMax,
                ticks: {
                    color: '#8884d8',
                    ...(!isBoss && { stepSize: 20 }),
                },
                grid: {
                    color: gridColor,
                }
            },
            // 오른쪽 Y축 (해역: 수심)
            ...(!isBoss && {
                y_depth: {
                    type: 'linear' as const,
                    position: 'right' as const,
                    beginAtZero: true,
                    ticks: {
                        color: '#82ca9d',
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            })
        },
        layout: {
            padding: {
                top: 5,
                right: 10,
                left: 0,
                bottom: 10
            },
        }
    };

    if (isBoss) {
        return (
            <div className={`w-full mx-auto flex flex-col h-[466px] gap-y-3 ${containerDarkBG} dark:text-zinc-200 p-4 rounded-xl border dark:border-zinc-700 border-zinc-300 overflow-x-auto overflow-y-hidden`}>
                <div className='flex shrink-0 items-center'>
                    <span className="text-xl font-bold mr-2">점수</span>
                    <InfoIcon text="해당 유저의 보스 점수를 제공합니다." />
                </div>
                <div className='min-h-0 flex-1 dark:brightness-90'>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        );
    }

    const createPersonalityChartData = (metric: 'depth' | 'duration', label: string, color: string) => ({
        labels: arr.map(item => item.rank),
        datasets: [{
            label,
            data: arr.map(item => item.personalities[type][metric]),
            // 측정값 색(수심/시간)은 선택 상태와 관계없이 유지하고,
            // 선택 사도 포함 기록은 크게, 그 외 기록은 작게 표시한다.
            backgroundColor: color,
            pointBackgroundColor: color,
            showLine: false,
            pointRadius: arr.map(item =>
                !select ? 3 : isSelected(item) ? 5 : 1.5
            ),
            pointHoverRadius: (context: ScriptableContext<'line'>) => !select ? 3 : isSelected(arr[context.dataIndex]) ? 5 : 1.5,
            pointHoverBorderWidth: 0,
        }],
    });

    const createPersonalityChartOptions = (
        label: string,
        unit: string,
        max?: number
    ): ChartOptions<'line'> => ({
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    title: context => `순위: ${context[0].label}`,
                    label: context => `${label}: ${context.formattedValue}${unit}`,
                },
            },
        },
        scales: {
            x: {
                ticks: { color: tickColor, maxTicksLimit: 12 },
                grid: { color: gridColor, display: false },
            },
            y: {
                type: 'linear',
                beginAtZero: true,
                ...(max !== undefined && { max }),
                ticks: {
                    color: label === '수심' ? '#82ca9d' : '#8884d8',
                    ...(max !== undefined && { stepSize: 20 }),
                },
                grid: { color: gridColor },
            },
        },
        layout: { padding: { top: 5, right: 10, left: 0, bottom: 4 } },
    });

    const depthData = createPersonalityChartData('depth', '수심', '#82ca9d');
    const durationData = createPersonalityChartData('duration', '클리어 시간', '#8884d8');
    const depthOptions = createPersonalityChartOptions('수심', '', undefined);
    const durationOptions = createPersonalityChartOptions('클리어 시간', '초', durationAxisMax);

    return (
        <div className={`w-full mx-auto flex flex-col h-[420px] gap-y-2 ${containerDarkBG} dark:text-zinc-200 p-4 rounded-xl border dark:border-zinc-700 border-zinc-300 overflow-x-auto overflow-y-hidden`}>
            <div className="flex flex-1 min-h-0 flex-col gap-y-3">
                <div className="flex flex-1 min-h-0 flex-col gap-y-2">
                    <div className="flex h-6 shrink-0 items-center">
                        <span className="text-base font-bold mr-2">수심</span>
                    </div>
                    <div className="min-h-0 flex-1 dark:brightness-90">
                        <Line data={depthData} options={depthOptions} />
                    </div>
                </div>
                <div className="flex flex-1 min-h-0 flex-col gap-y-2">
                    <div className="flex h-6 shrink-0 items-center">
                        <span className="text-base font-bold mr-2">클리어 시간</span>
                    </div>
                    <div className="min-h-0 flex-1 dark:brightness-90">
                        <Line data={durationData} options={durationOptions} />
                    </div>
                </div>
            </div>
            {depthStats && (
                <div className="flex min-h-8 shrink-0 flex-wrap items-center justify-center gap-x-10 gap-y-1 text-[13px]">
                    <span>평균 수심 <strong>{depthStats.average.toFixed(1)}m</strong></span>
                    <span>최고 수심 <strong>{depthStats.max}m</strong> ({depthStats.maxCount}명)</span>
                    <span>최저 수심 <strong>{depthStats.min}m</strong> ({depthStats.minCount}명)</span>
                </div>
            )}
        </div>
    );
}

export default DeepClashChart;
