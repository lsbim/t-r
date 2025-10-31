import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    Filler,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { ClashSeasonData } from "../../types/clashTypes";
import { Line } from 'react-chartjs-2';
import { FrontierSeasonData } from '../../types/frontierTypes';
import { useTheme } from '../../hooks/useTheme';

ChartJS.register(
    annotationPlugin,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // 영역 채우기 효과를 위해 추가 (선택사항)
);

const CleartimeChart = ({ data, season }: { data: ClashSeasonData | FrontierSeasonData, season?: string }) => {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? 'rgb(244,244,245)' : 'rgb(82,82,91)';
    const gridColor = theme === 'dark' ? 'rgb(39,39,42)' : 'rgb(228,228,231)';

    const arr = data?.data

    const chartData = {
        // rank 값들을 x축 라벨로 사용 (순위가 x축이 됩니다)
        labels: arr?.map(item => item.rank) || [],
        datasets: [
            {
                label: '클리어 시간', // 범례에 표시될 라벨
                // duration 값들을 y축 데이터로 사용 (클리어 타임이 y축이 됩니다)
                data: arr?.map(item => item.duration) || [],

                // 선의 시각적 스타일링 - Recharts의 stroke 속성과 대응
                borderColor: '#8884d8', // 선의 색상
                backgroundColor: 'rgba(136, 132, 216, 0.1)', // 선 아래 영역 색상 (투명도 적용)

                // 선의 두께와 스타일 설정
                borderWidth: 2, // 선의 두께
                tension: 0.1, // 선의 곡률 (0은 직선, 1은 매우 곡선)

                // 데이터 포인트 (점) 스타일링
                pointBackgroundColor: '#8884d8', // 점의 배경색
                pointBorderColor: '#ffffff', // 점의 테두리 색
                pointBorderWidth: 2, // 점의 테두리 두께
                pointRadius: 0, // 일반 상태에서 점의 크기

                // 호버 상태에서의 점 스타일
                pointHoverRadius: 6, // 호버 시 점의 크기 (activeDot r=6과 동일)
                pointHoverBackgroundColor: '#8884d8',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 3,

                // 선 아래 영역 채우기 설정 (선택사항)
                fill: false, // true로 설정하면 선 아래 영역이 채워집니다
            }
        ]
    };

    // 차트 옵션 설정 - Recharts의 설정들을 Chart.js 형식으로 변환
    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false, // 컨테이너 크기에 맞춰 조정
        resizeDelay: 0, // 즉시 크기 조정 반응

        // 상호작용 설정 - 바 차트에서 배운 사용성 개선 적용
        interaction: {
            mode: 'index', // x축 인덱스 기준으로 상호작용
            intersect: false, // 정확한 점 위가 아니어도 툴팁 표시
            axis: 'x', // x축 기준으로 상호작용 영역 결정
        },

        plugins: {
            legend: {
                display: false, // 범례 표시 - Recharts의 Legend 컴포넌트와 대응
                position: 'top' as const,
                labels: {
                    usePointStyle: true, // 점 스타일을 범례에 사용
                    padding: 20,
                }
            },
            tooltip: {
                // 툴팁 커스터마이징
                callbacks: {
                    label: function (context) {
                        // duration 값을 적절한 형식으로 표시
                        // 시간 단위가 무엇인지에 따라 포맷팅을 조정할 수 있습니다
                        return ` ${context.parsed.y}초`;
                    },
                    title: function (context) {
                        return `순위: ${context[0].label}`; // 순위 정보 표시
                    }
                },
                backgroundColor: 'rgba(30, 30, 33, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                cornerRadius: 6,
                displayColors: true, // 선형 차트에서는 색상 표시가 유용
                intersect: false,
                position: 'nearest',
            }
        },

        scales: {
            x: {
                // x축 설정 - rank 값들이 표시됩니다
                title: {
                    display: true,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: tickColor
                },
                grid: {
                    display: true,
                    color: gridColor
                }
            },
            y: {
                // y축 설정 - duration 값들이 표시됩니다
                title: {
                    display: true,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    // 필요에 따라 y축 값 포맷팅 함수 추가 가능
                    callback: function (value) {
                        // 예: 시간 단위 변환이 필요한 경우
                        return value; // 현재는 원본 값 그대로 표시
                    },
                    color: tickColor
                },
                grid: {
                    display: true,
                    color: gridColor
                }
            }
        },

        // 차트 여백 설정 - Recharts의 margin과 대응
        layout: {
            padding: {
                top: 25,
                right: 10,
                left: 0,
                bottom: 0
            },
        }
    };

    return (
        <div className="lg:w-[992px] w-full mx-auto flex flex-col h-96 bg-white dark:bg-zinc-900 p-4 shadow-md overflow-x-auto overflow-y-hidden">
            <span className="text-xl font-bold dark:text-zinc-100">클리어 시간</span>

            <Line data={chartData} options={chartOptions} />
        </div>
    );
}

export default CleartimeChart;