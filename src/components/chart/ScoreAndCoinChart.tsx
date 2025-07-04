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
import { FrontierSeasonData } from "../../types/frontierTypes";
import InfoIcon from '../../commons/InfoIcon';


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

const ScoreAndCoinChart = ({ data, season }: { data: FrontierSeasonData, season?: string }) => {

    const arr = data?.data;
    const coins = arr.map(item => item.coin);

    const maxCoin = Math.max(...coins);
    const minCoin = Math.min(...coins);

    const maxCoinIndex = coins.indexOf(maxCoin);
    const minCoinIndex = coins.indexOf(minCoin);

    const gradeAnnotations: Record<string, any> = {};
    let prevGrade: string | number;

    arr.forEach((pt, idx) => {
        if (pt.grade && pt.grade !== prevGrade) {
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
                    content: pt.grade,      // ex) "용암맛1"
                    position: 'start',
                    yAdjust: 10,
                    backgroundColor: 'rgba(255,255,255,0)',
                    color: 'black',
                    font: {
                        size: 14
                    }
                }
            };
            prevGrade = pt.grade;
        }
    });

    const chartData = {
        labels: arr?.map(item => item.rank) || [],
        datasets: [
            {
                label: '점수', // 첫 번째 데이터셋: 점수(score)
                data: arr?.map(item => item.score) || [],
                borderColor: '#8884d8',
                backgroundColor: 'rgba(136, 132, 216, 0.1)',
                yAxisID: 'y_score', // 이 데이터셋이 사용할 Y축 ID
                tension: 0.1,
            },
            {
                label: '코인', // 두 번째 데이터셋: 코인(coin)
                data: arr?.map(item => item.coin) || [],
                borderWitdh: 0,
                // borderColor: '#82ca9d',
                // backgroundColor: 'rgba(130, 202, 157, 1)',
                backgroundColor: coins.map((_, i) =>
                    i === maxCoinIndex || i === minCoinIndex ? 'red' : '#82ca9d'
                ),
                yAxisID: 'y_coin', // 이 데이터셋이 사용할 Y축 ID
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
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: '순위'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
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
                    color: 'rgba(0, 0, 0, 0.1)',
                }
            },
            // 오른쪽 Y축 (코인)
            y_coin: {
                type: 'linear',
                position: 'right',
                title: {
                    display: false,
                    text: '코인 (Coin)',
                    color: '#82ca9d',
                },
                ticks: {
                    color: '#82ca9d',
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
        <div className="lg:w-[992px] w-full mx-auto flex flex-col h-[400px] bg-white p-4 shadow-md overflow-x-scroll overflow-y-hidden">
            <div className='flex items-center'>
                <span className="text-xl font-bold mr-2">점수 및 실체의 코인</span>
                <InfoIcon text='해당 유저의 최고 난이도 점수만 제공합니다.' />
            </div>

            <Line data={chartData} options={chartOptions} />
        </div>
    );
}

export default ScoreAndCoinChart;