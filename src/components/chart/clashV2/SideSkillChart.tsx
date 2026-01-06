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
import { Bar } from "react-chartjs-2";
import InfoIcon from "../../../commons/icon/InfoIcon";
import { useTheme } from "../../../hooks/useTheme";
import { ClashV2SeasonData } from "../../../types/clashV2Types";
import { getSideSkillKrName } from '../../../data/sideSkill';

// Bar 차트에 필요한 요소 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ClashV2SkillChart = ({ data }: { data: ClashV2SeasonData }) => {
    if (!data?.sideSkills?.length) return null;

    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? 'rgb(244,244,245)' : 'rgb(82,82,91)';
    const gridColor = theme === 'dark' ? 'rgb(39,39,42)' : 'rgb(228,228,231)';

    const arr = data?.data || [];

    const getSkillLevel = (sideSkills: { name: string, level: number }[], skillName: string) => {
        return sideSkills?.find(s => s?.name === skillName)?.level || 0;
    };

    const chartData = {
        labels: arr.map(item => item.rank),
        datasets: [
            {
                label: getSideSkillKrName('clashV2Side1'),
                data: arr.map(item => getSkillLevel(item?.sideSkills || [], 'clashV2Side1')),
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 0,
            },
            {
                label: getSideSkillKrName('clashV2Side2'),
                data: arr.map(item => getSkillLevel(item?.sideSkills || [], 'clashV2Side2')),
                backgroundColor: 'rgba(255, 206, 86, 0.7)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 0,
            },
            {
                label: getSideSkillKrName('clashV2Side3'),
                data: arr.map(item => getSkillLevel(item?.sideSkills || [], 'clashV2Side3')),
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 0,
            },
        ]
    };

    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                    color: tickColor,
                    boxWidth: 12,
                    font: { size: 11 }
                },
            },
            tooltip: {
                callbacks: {
                    title: (context) => {
                        if (!context || context.length === 0) return '';
                        return `순위: ${context[0].label}위`;
                    },

                    label: (context) => {
                        const value = context.raw as number;
                        if (!value || value <= 0) {
                            return null;
                        }

                        return `${context.dataset.label}: Lv.${value}`;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true, // 누적 막대 설정
                ticks: {
                    color: tickColor,
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 20
                },
                title: {
                    display: false,
                    text: '순위',
                    color: tickColor
                },
                grid: {
                    display: false,
                }
            },
            y: {
                stacked: true, // 누적 막대 설정
                beginAtZero: true,
                max: 8,
                ticks: {
                    color: tickColor,
                    stepSize: 1
                },
                grid: {
                    color: gridColor,
                }
            }
        },
        layout: {
            padding: {
                top: 0,
                right: 0,
                left: 0,
                bottom: 35
            },
        },
        // 바 사이 간격 없애기
        barPercentage: 1.0,
        categoryPercentage: 1.0,

    } as ChartOptions<'bar'>;

    return (
        <div className="lg:w-[992px] dark:brightness-90 w-full mx-auto flex flex-col gap-y-3 h-[290px] bg-white dark:bg-zinc-900 p-4 shadow-md overflow-x-auto overflow-y-hidden">
            <span className="text-xl font-bold dark:text-zinc-200">이면의 파편</span>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
}

export default ClashV2SkillChart;