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
import { Line } from "react-chartjs-2";
import InfoIcon from "../../../../components/icons/InfoIcon";
import { useTheme } from "../../../../hooks/useTheme";
import { containerDarkBG } from "../../../../styles/container";
import { ClashPlayerData, ClashSeasonData } from "../../../../types/clashTypes";
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

const SELECT_COLOR = '#D97706';

// processDeepClashData로 만든 데이터를 받는다. 보스는 score, 성격해역은 grade(수심)/duration
const DeepClashChart = ({ data, type, select }: { data: DeepClashSeasonData, type: DeepClashType, select?: string }) => {

    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? 'rgb(244,244,245)' : 'rgb(82,82,91)';
    const gridColor = theme === 'dark' ? 'rgb(39,39,42)' : 'rgb(228,228,231)';

    const arr = data?.data;
    const isBoss = type === 'boss';

    // 선택한 사도를 사용한 유저 (공명 사도는 본명으로 선택해도 성격 변형을 포함)
    const isSelected = (item: DeepClashPlayerData) =>
        !!select && item.arr.some(name => name === select || parseResonanceBaseName(name)?.baseName === select);

    const dotColors = (color: string) => arr.map(item => isSelected(item) ? SELECT_COLOR : color);

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
                    // 선택한 사도 사용 유저만 점으로 표시
                    pointRadius: arr.map(item => isSelected(item) ? 3 : 0),
                    pointBackgroundColor: dotColors('#8884d8'),
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#8884d8',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3,
                },
            ]
            : [
                // 해역 기록은 순위순이 아니라서 선 대신 점만 표시
                {
                    label: '클리어 시간',
                    data: arr.map(item => item.personalities[type].duration),
                    backgroundColor: dotColors('#8884d8'),
                    yAxisID: 'y_main',
                    showLine: false,
                    pointRadius: 3,
                },
                {
                    label: '수심',
                    data: arr.map(item => item.personalities[type].depth),
                    backgroundColor: dotColors('#82ca9d'),
                    yAxisID: 'y_depth',
                    showLine: false,
                    pointRadius: 3,
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
                ticks: {
                    color: '#8884d8',
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

    return (
        <div className={`w-full mx-auto flex flex-col h-[466px] gap-y-4 ${containerDarkBG} dark:text-zinc-200 p-4 rounded-xl border dark:border-zinc-700 border-zinc-300 overflow-x-auto overflow-y-hidden`}>
            <div className='flex items-center'>
                <span className="text-xl font-bold mr-2">{isBoss ? '순위별 점수' : '수심 및 클리어 시간'}</span>
                <InfoIcon text={isBoss
                    ? '해당 유저의 보스 종합 점수를 제공합니다.'
                    : '해당 유저의 성격해역 수심과 클리어 시간을 제공합니다. 순위는 보스 점수 기준입니다.'} />
            </div>
            <div className='h-[400px] dark:brightness-90'>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default DeepClashChart;
