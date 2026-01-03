import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from "react-chartjs-2";
import annotationPlugin from 'chartjs-plugin-annotation';
import { FrontierSeasonData } from "../../../types/frontierTypes";
import InfoIcon from "../../../commons/icon/InfoIcon";
import { useTheme } from "../../../hooks/useTheme";
import { ClashV2SeasonData } from "../../../types/clashV2Types";


ChartJS.register(
    annotationPlugin,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ClashV2Chart = ({ data }: { data: ClashV2SeasonData }) => {

    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? 'rgb(244,244,245)' : 'rgb(82,82,91)';
    const gridColor = theme === 'dark' ? 'rgb(39,39,42)' : 'rgb(228,228,231)';

    const arr = data?.data;

    const gradeAnnotations: Record<string, any> = {};
    let prevGrade: string | number;
    let lastLabelIndex = -100; // 마지막으로 라벨을 찍은 인덱스 초기화
    let isStaggered = false;   // 지그재그 상태 스태그

    const hasSideSkills = !!data?.sideSkills;

    arr.forEach((pt, idx) => {
        // if(pt.grade !== 17) return;
        if (pt.grade && pt.grade !== prevGrade) {

            if (idx - lastLabelIndex < 20) {
                isStaggered = !isStaggered; // 위치를 바꿈 (위 <-> 아래)
            } else {
                isStaggered = false; // 거리가 멀면 기본 위치로 리셋
            }

            // -5가 더 위임
            const yPos = isStaggered ? -5 : 10;

            gradeAnnotations[`gradeLabel${idx}`] = {
                // type: 'label',
                xMin: idx,        // 세로선 위치: 해당 데이터 인덱스
                xMax: idx,
                borderWidth: 0,
                // borderColor: 'black',
                // borderWidth: 2,
                // borderDash: [5, 5],  // 점선

                clip: false,
                label: {
                    display: true,
                    enabled: true,
                    content: pt.grade + '단계',      // ex) "용암맛1"
                    position: 'start',
                    yAdjust: yPos,
                    backgroundColor: 'rgba(255,255,255,0)',
                    color: tickColor,
                    font: {
                        size: 12
                    }
                }
            };
            prevGrade = pt.grade;
            lastLabelIndex = idx;
        }
    });

    const chartData = {
        labels: arr?.map(item => item.rank) || [],
        datasets: [
            {
                label: '림의 이면세계',
                data: arr?.map(item => item.sideGrade) || [],
                borderWidth: 0,
                backgroundColor: '#82ca9d',
                yAxisID: 'y_sideGrade',
                showLine: false, // 점만 표시
                pointRadius: 3,
                tension: 0.1,
            },
            hasSideSkills
                ? {
                    label: '클리어 시간',
                    data: arr?.map(item => item.duration) || [],
                    borderColor: '#8884d8',
                    backgroundColor: 'rgba(136, 132, 216, 0.1)',
                    yAxisID: 'y_secondary',
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#8884d8',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3,
                }
                : {
                    label: '점수(단위: 억)',
                    data: arr?.map(item => item.score / 100000000) || [],
                    borderColor: '#8884d8',
                    backgroundColor: 'rgba(136, 132, 216, 0.1)',
                    yAxisID: 'y_secondary',
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#8884d8',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3,
                }
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
            annotation: {
                annotations: gradeAnnotations
            },
            // annotation 플러그인 설정을 제거합니다.
            legend: {
                display: true, // 범례를 표시하여 두 데이터를 구분할 수 있게 합니다.
                position: 'bottom' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        if (context.datasetIndex === 1) {
                            // 두 번째 데이터셋 (클리어시간 또는 점수)
                            if (hasSideSkills) {
                                // 클리어시간인 경우 초 단위 표시
                                return `클리어 시간: ${context.formattedValue}초`;
                            } else {
                                // 점수인 경우 억 단위 표시
                                return `점수: ${context.formattedValue}억`;
                            }
                        }
                        return `${context.dataset.label}: ${context.formattedValue}`;
                    },
                    title: function (context) {
                        return `순위: ${context[0].label}`;
                    },
                    footer: function (context) {
                        const dataIndex = context[0].dataIndex;
                        const grade = arr?.[dataIndex]?.grade;

                        if (grade) {
                            return `셰이디의 차원: ${grade}`;
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: tickColor
                },
                title: {
                    display: false,
                    text: '순위',
                    color: tickColor
                },
                grid: {
                    color: gridColor,
                }
            },
            // 오른쪽 Y축 (림의 이면세계)
            y_sideGrade: {
                type: 'linear',
                position: 'right',
                title: {
                    display: false,
                    text: '림의 이면세계',
                    color: '#82ca9d',
                },
                ticks: {
                    color: '#82ca9d',
                    stepSize: 1
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
            y_secondary: {
                type: 'linear',
                position: 'left',
                title: {
                    display: false,
                    // 조건에 따라 제목이 달라지지만 display가 false이므로 실제로는 보이지 않음
                    text: hasSideSkills ? '클리어 시간 (초)' : '점수',
                    color: '#8884d8',
                },
                ticks: {
                    color: '#8884d8',
                    // 클리어시간의 경우 초 단위이므로 적절한 포맷 적용 가능
                    callback: function (value) {
                        if (hasSideSkills) {
                            // 클리어시간은 그대로 표시
                            return value;
                        } else {
                            // 점수는 이미 억 단위로 나눈 값이므로 그대로 표시
                            return value;
                        }
                    }
                },
                grid: {
                    color: gridColor,
                }
            }
        },
        layout: {
            padding: {
                top: 5,
                right: 10,
                left: 0,
                bottom: 0
            },
        }
    };

    const infoText = hasSideSkills
        ? '해당 유저의 림의 이면세계 등급과 클리어시간을 제공합니다.'
        : '해당 유저의 림의 이면세계 등급과 종합 점수를 제공합니다.';

    const chartTitle = hasSideSkills
        ? '클리어 시간 및 림의 이면세계'
        : '점수 및 림의 이면세계';

    return (
        <div className="lg:w-[992px] w-full mx-auto flex flex-col h-[466px] gap-y-4 bg-white dark:bg-zinc-900 dark:text-zinc-200 p-4 shadow-md overflow-x-auto overflow-y-hidden">
            <div className='flex items-center'>
                <span className="text-xl font-bold mr-2">{chartTitle}</span>
                <InfoIcon text={infoText} />
            </div>
            <div className='h-[400px] dark:brightness-90'>

                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}


export default ClashV2Chart;