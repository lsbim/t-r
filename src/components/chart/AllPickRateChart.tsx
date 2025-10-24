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
import { ClashExternalData, ClashSeasonData } from "../../types/clashTypes";
import { FrontierExternalData, FrontierSeasonData } from "../../types/frontierTypes";
import { getPersonalityColor, Personality } from "../../types/trickcalTypes";
import { processExternalAllData, processRankingArrAllData } from '../../utils/chartFunction';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AllPickRateChart = ({ data, season, setSelect }:
    {
        data: ClashSeasonData | ClashExternalData | FrontierSeasonData | FrontierExternalData,
        season?: string, setSelect?: React.Dispatch<React.SetStateAction<string>>
    }) => {


    const sortedData = data.type === 'season' ?
        processRankingArrAllData(data?.data).sort((a, b) => b.count - a.count)
        : processExternalAllData(data).sort((a, b) => b.count - a.count);

    // console.log("sortedData: ", sortedData)

    const handleBarClick = (event: any, elements: any[]) => {
        if (!setSelect) {
            return;
        }

        // 클릭된 요소가 있는지 확인
        if (elements.length > 0) {
            // 첫 번째 클릭된 요소의 인덱스를 가져옴
            const elementIndex = elements[0].index;

            // 해당 인덱스에 해당하는 캐릭터 이름을 추출
            const selectedCharacterName = sortedData[elementIndex].name;

            setSelect(selectedCharacterName);

        }
    };

    const chartData = {
        labels: sortedData.map(item => item.name),
        datasets: [
            {
                label: 'Pick Count',

                data: sortedData.map(item => item.count),

                backgroundColor: sortedData.map(item =>
                    getPersonalityColor(item.personality as Personality)
                ),

                borderColor: sortedData.map(item =>
                    getPersonalityColor(item.personality as Personality)
                ),

                borderSkipped: true
            }
        ]
    };

    // Configure chart options to match the original Recharts behavior
    const chartOptions: ChartOptions<'bar'> = {
        onClick: handleBarClick,
        interaction: {
            // 바가 아닌 배경 위에서도 툴팁을 띄우려면 intersect: false
            intersect: false,
            // x축 기준으로 가장 가까운 데이터셋(=해당 바)에서 툴팁
            mode: 'index',
            // mode: 'nearest' 로 하면 가장 가까운 점 기준
        },
        responsive: true,
        maintainAspectRatio: false, // Allow container to control height
        resizeDelay: 0, // 즉시 크기 조정 반응
        plugins: {
            legend: {
                display: false, // Hide legend since we're using color coding
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return ` ${context.parsed.y}회`; // Format as "X회" like original
                    },
                    title: function (context) {
                        return context[0].label; // Show character name as title
                    }
                },
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                cornerRadius: 4,
                displayColors: true, // Hide color box in tooltip

            }
        },
        scales: {
            x: {
                // Configure x-axis to match original styling
                ticks: {
                    maxRotation: 45, // Rotate labels like original (-45 degrees)
                    minRotation: 45,
                    font: {
                        size: 12 // Match original font size
                    }
                },
                grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                }
            },
            y: {
                // Configure y-axis
                beginAtZero: true, // Start y-axis from 0
                ticks: {
                    font: {
                        size: 12 // Match original font size
                    }
                },
                grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                }
            }
        },
        // Add some padding around the chart
        layout: {
            padding: {
                top: 25,
                right: 10,
                left: 10,
                bottom: 10
            }
        }
    };


    return (
        <div className="lg:w-[992px] w-full mx-auto flex flex-col h-[400px] bg-white p-4 shadow-md overflow-x-auto overflow-y-hidden">
            <span className="text-xl font-bold">사도 종합</span>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
}

export default AllPickRateChart;