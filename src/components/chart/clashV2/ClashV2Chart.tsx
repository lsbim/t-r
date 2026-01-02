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
                label: '점수(단위: 억)', // 첫 번째 데이터셋: 점수(score)
                data: arr?.map(item => item.score / 100000000) || [],
                borderColor: '#8884d8',
                backgroundColor: 'rgba(136, 132, 216, 0.1)',
                yAxisID: 'y_score', // 이 데이터셋이 사용할 Y축 ID
                tension: 0.1,
                pointRadius: 0, // 일반 상태에서 점의 크기
                pointHoverRadius: 6, // 호버 시 점의 
                pointHoverBackgroundColor: '#8884d8',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 3,
            },
            {
                label: '림의 이면세계',
                data: arr?.map(item => item.sideGrade) || [],
                borderWitdh: 0,
                // borderColor: '#82ca9d',
                // backgroundColor: 'rgba(130, 202, 157, 1)',
                backgroundColor: '#82ca9d',
                yAxisID: 'y_sideGrade', // 이 데이터셋이 사용할 Y축 ID
                showLine: false, // 선을 제거하고 점만 표시
                pointRadius: 3, // 점의 크기를 3으로 줄임 (기본값은 보통 3-4)
                tension: 0.1,
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
                display: false, // 범례를 표시하여 두 데이터를 구분할 수 있게 합니다.
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        // 툴팁에 데이터셋 레이블과 값을 표시합니다. (예: "점수: 12345")
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
                    display: true,
                    text: '순위',
                    color: tickColor
                },
                grid: {
                    color: gridColor,
                }
            },
            // 왼쪽 Y축 (점수)
            y_score: {
                type: 'linear',
                position: 'left',
                title: {
                    display: false,
                    text: '점수 (Score)',
                    color: '#8884d8',
                },
                ticks: {
                    color: '#8884d8',
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
                // 차트 영역에 오른쪽 축의 그리드 라인은 그리지 않아 깔끔하게 보입니다.
                grid: {
                    drawOnChartArea: false,
                },
            }
        },
        layout: {
            padding: {
                top: 25,
                right: 10,
                left: 0,
                bottom: 20
            },
        }
    };

    return (
        <div className="lg:w-[992px] w-full mx-auto flex flex-col h-[450px] bg-white dark:bg-zinc-900 dark:text-zinc-200 p-4 shadow-md overflow-x-auto overflow-y-hidden">
            <div className='flex items-center'>
                <span className="text-xl font-bold mr-2">점수 및 림의 이면세계</span>
                <InfoIcon text='해당 유저의 종합 점수를 제공합니다.' />
            </div>
            <div className='h-[400px] dark:brightness-90'>

                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}


export default ClashV2Chart;