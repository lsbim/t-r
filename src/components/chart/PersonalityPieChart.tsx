import {
    ArcElement,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from "react-chartjs-2";
import { ClashExternalData, ClashSeasonData } from "../../types/clashTypes";
import { FrontierExternalData, FrontierSeasonData } from "../../types/frontierTypes";
import { getPersonalityColor, Personality } from "../../types/trickcalTypes";
import { processPersonalityPie } from "../../utils/chartFunction";
import { useTheme } from '../../hooks/useTheme';
// ① 필수: 사용 요소 & 플러그인 등록
ChartJS.register(ArcElement, Tooltip, Legend);


const PersonalityPieChart = ({ data }: { data: ClashSeasonData | ClashExternalData | FrontierSeasonData | FrontierExternalData }) => {

    const pieData = processPersonalityPie(data?.data);

    if (!pieData) return null;

    const { theme } = useTheme();

    const pieLabels = Object.keys(pieData);
    const pieDataset = Object.values(pieData);

    const pieDataSum = pieDataset.reduce((a, b) => a + b, 0);

    const borderColor = theme === 'dark' ? 'rgb(24 24 27)' : '#FFFFFF';

    // console.log(pieData);

    const chartData = {
        labels: pieLabels,
        datasets: [
            {
                data: pieDataset,
                backgroundColor: pieLabels.map(item =>
                    getPersonalityColor(item as Personality)
                ),
                borderWidth: 1,
                borderColor: borderColor
            },
        ],
    };

    const options: ChartOptions<'pie'> = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                formatter: (value: number) => {
                    return Math.round((value * 100 / pieDataSum) * 10) / 10 + '%'
                },
                color: '#000',
                font: {
                    // weight: 'bold' as const,
                    size: 11,
                },
                // align: 'top' as const,
                anchor: 'end' as const,   // 바깥쪽 끝을 기준점으로
                align: 'start' as const,   // 바깥쪽으로 정렬
                offset: 5,                // 조각과 라벨 사이 간격
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return ` ${Math.round((context.parsed * 100 / pieDataSum) * 10) / 10}% (${context.parsed})`;
                    },
                    title: function (context) {
                        return `${context[0].label}`; // 성격
                    }
                },
                titleFont: { size: 11 },
                bodyFont: { size: 11 },
                position: 'nearest' as const,       // 마우스 근처로 이동
                padding: 8,
                caretPadding: 10,           // 화살표와 박스 사이 간격
                backgroundColor: 'rgba(30, 30, 33, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                cornerRadius: 4,
                displayColors: true, // Hide color box in tooltip

            }
        },
    };

    return (
        <div className='h-[150px] dark:brightness-90 xs:mr-[20px] xs:mb-0 mb-4 flex justify-center w-full xs:w-[150px] items-center'>
            <Pie data={chartData} options={options} plugins={[ChartDataLabels]} />
        </div>
    );
}

export default PersonalityPieChart;