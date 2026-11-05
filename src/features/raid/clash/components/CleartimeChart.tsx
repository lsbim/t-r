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
import { ClashPlayerData, ClashSeasonData } from "../../../../types/clashTypes";
import { Line } from 'react-chartjs-2';
import { FrontierPlayerData, FrontierSeasonData } from '../../../../types/frontierTypes';
import { useTheme } from '../../../../hooks/useTheme';
import { useMemo } from 'react';
import InfoIcon from '../../../../components/icons/InfoIcon';
import { containerDarkBG } from '../../../../styles/container';

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

    const processedData = useMemo(() => preprocessData(arr ?? []), [arr]);
    const segments = useMemo(() => buildSegments(processedData), [processedData]);

    const hasScoreData = useMemo(() =>
        processedData.some(item => item.score != null)
        , [processedData]);

    const mostCommonDurations = useMemo(() => {
        const durationCounts = new Map<number, { count: number; ranks: number[] }>();

        processedData.forEach(item => {
            const duration = item.duration;

            if (
                duration == null ||
                !Number.isFinite(duration) ||
                !Number.isFinite(item.rank)
            ) return;

            const current = durationCounts.get(duration);

            if (current) {
                current.count += 1;
                current.ranks.push(item.rank);
            } else {
                durationCounts.set(duration, {
                    count: 1,
                    ranks: [item.rank]
                });
            }
        });

        let maxCount = 0;

        durationCounts.forEach(({ count }) => {
            if (count > maxCount) maxCount = count;
        });

        if (maxCount === 0) return [];

        return [...durationCounts.entries()]
            .filter(([, { count }]) => count === maxCount)
            .map(([duration, { count, ranks }]) => {
                const sortedRanks = [...ranks].sort((a, b) => a - b);
                const rankRanges: Array<[number, number]> = [];

                sortedRanks.forEach(rank => {
                    const lastRange = rankRanges[rankRanges.length - 1];

                    if (!lastRange || rank > lastRange[1] + 1) {
                        rankRanges.push([rank, rank]);
                    } else if (rank > lastRange[1]) {
                        lastRange[1] = rank;
                    }
                });

                return { duration, count, rankRanges };
            })
            .sort((a, b) => a.duration - b.duration);
    }, [processedData]);

    // 클리어시간
    const durationDatasets = segments
        .filter(seg => !seg.isScoreSegment)
        .map(seg => {
            const segData = processedData.map((item, i) => {
                if (i >= seg.startIdx && i <= seg.endIdx) return item.duration;
                return null;
            });
            return {
                label: `클리어 시간`,
                data: segData,
                yAxisID: 'y_duration',      // 왼쪽 duration 축 사용
                borderColor: '#8884d8',
                backgroundColor: 'rgba(136, 132, 216, 0.1)',
                borderWidth: 2,
                borderDash: [],
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#8884d8',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 3,
                fill: false,
                spanGaps: false,
            };
        });

    // 총 점수
    const scoreDatasets = segments
        .filter(seg => seg.isScoreSegment)
        .map(seg => {
            const segData = processedData.map((item, i) => {
                if (i >= seg.startIdx && i <= seg.endIdx && item.score != null)
                    return item.score;
                return null;
            });
            return {
                label: `점수`,
                data: segData,
                yAxisID: 'y_score',         // 오른쪽 score 축 사용
                borderColor: '#82ca9d',
                backgroundColor: 'rgba(130, 202, 157, 0.1)',
                borderWidth: 2,
                borderDash: [],
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#82ca9d',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 3,
                fill: false,
                spanGaps: false,
            };
        });

    // duration/score 데이터 커넥터
    const connectorDatasets = segments.slice(1)
        .filter((seg, i) => {
            const prevSeg = segments[i];
            return !prevSeg.isScoreSegment && !seg.isScoreSegment;
        })
        .map((seg, i) => {
            const prevEndIdx = seg.startIdx - 1;
            const connectorData = processedData.map((item, idx) => {
                if (idx === prevEndIdx) return item.duration;
                if (idx === seg.startIdx) return item.duration;
                return null;
            });
            return {
                label: '',
                data: connectorData,
                yAxisID: 'y_duration',
                borderColor: '#8884d8',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [6, 3],
                tension: 0,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false,
                spanGaps: false,
            };
        });

    const chartData = {
        labels: processedData.map(item => item.rank),
        datasets: [...durationDatasets, ...scoreDatasets, ...connectorDatasets],
    };

    // 어노테이션
    const annotationEntries: [string, any][] = [];

    segments.slice(1).forEach((seg, i) => {
        const prevSeg = segments[i];
        const startRank = processedData[seg.startIdx].rank;
        const isGradeChange = prevSeg.grade !== seg.grade;
        const isTransitionToScore = !prevSeg.isScoreSegment && seg.isScoreSegment;

        if (isGradeChange) {
            annotationEntries.push([
                `grade-${seg.grade}-${i}`,
                {
                    type: 'line',
                    xMin: startRank,
                    xMax: startRank,
                    borderWidth: 1,
                    borderColor: gridColor,
                    borderDash: [5, 5],
                    label: {
                        display: true,
                        content: `${seg.grade}단계`,
                        position: 'center',
                        backgroundColor: 'rgba(0,0,0,0)',
                        color: tickColor,
                        font: {
                            size: 14,
                            weight: 'bold' as const
                        }
                    }
                }
            ]);
        }

        // 점수 시작 구분선
        if (isTransitionToScore) {
            const lastRank = processedData[processedData.length - 1].rank;

            annotationEntries.push([
                `transition-${i}`,
                {
                    type: 'box',
                    xMin: startRank,
                    xMax: lastRank,
                    backgroundColor: theme === 'dark'
                        ? 'rgba(130, 202, 157, 0.06)'
                        : 'rgba(130, 202, 157, 0.08)',
                    borderWidth: 0,
                }
            ]);
        }
    });


    // 차트 옵션 설정 - Recharts의 설정들을 Chart.js 형식으로 변환
    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 0,
        interaction: {
            mode: 'index',
            intersect: false,
            axis: 'x',
        },
        plugins: {
            legend: {
                display: hasScoreData, // 점수 데이터가 있을 때만 범례 표시
                position: 'bottom' as const,
                labels: {
                    // 세그먼트별로 나뉜 라벨을 하나로 합쳐서 표시
                    filter: (item, chart) => {
                        const datasets = chart.datasets;
                        const isFirst = datasets.findIndex(ds => ds.label === item.text) === item.datasetIndex;
                        return isFirst && item.text !== '';
                    },
                    color: tickColor
                }
            },
            tooltip: {
                filter: item => item.dataset.label !== '' && item.parsed.y !== null,
                callbacks: {
                    label: function (context) {
                        const dataIndex = context.dataIndex;
                        const item = processedData[dataIndex];
                        const isScore = context.dataset.yAxisID === 'y_score';

                        // 점수 억 단위
                        if (isScore) {
                            const score = (Number(context.parsed.y) / 100000000).toFixed(0);
                            return ` ${score}억`;
                        } else {
                            // 2트 이상 툴팁 표시
                            let text = ` ${context.parsed.y}초`;
                            if (item.tryNum) {
                                if (item?.tryNum > 1) {
                                    text += ` (${item.tryNum}트)`;
                                }
                            }
                            return text;
                        }
                    },
                    title: function (context) {
                        return `순위: ${context[0].label}`;
                    }
                },
                backgroundColor: 'rgba(30, 30, 33, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                cornerRadius: 6,
                displayColors: true,
                intersect: false,
                position: 'nearest',
            },
            annotation: {
                annotations: Object.fromEntries(annotationEntries),
            },
        },
        scales: {
            x: {
                title: { font: { size: 14, weight: 'bold' } },
                ticks: { font: { size: 12 }, color: tickColor },
                grid: { display: false, color: gridColor }
            },
            y_duration: {
                type: 'linear',
                position: 'left',
                grace: 3,
                ticks: {
                    font: { size: 12 },
                    color: '#8884d8',
                    callback: value => value,
                },
                grid: { color: gridColor },
            },
            // 점수 데이터가 존재할 때만 점수 스케일 활성화
            ...(hasScoreData && {
                y_score: {
                    grace: 100000000,
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        color: '#82ca9d',
                        callback: value => `${(Number(value) / 100000000).toFixed(0)}억`,
                    },
                    grid: { drawOnChartArea: false },
                }
            })
        },
        layout: { padding: { top: 20, right: 10, left: 0, bottom: 20 } }
    };

    return (
        <div className={`dark:brightness-90 w-full mx-auto flex flex-col h-[440px] p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 overflow-x-auto overflow-y-hidden ${containerDarkBG}`}>
            <div className='flex items-center'>
                <span className="text-xl font-bold mr-2 dark:text-zinc-200">클리어 시간</span>
                <InfoIcon text='시간 측정이 불가능한 구간은 점수로 표기합니다.' />
            </div>

            <div className="flex-1 min-h-0">
                <Line data={chartData} options={chartOptions} />
            </div>

            {mostCommonDurations.length > 0 && (
                <div className="flex shrink-0 flex-nowrap items-center dark:text-zinc-200 justify-center gap-x-2 whitespace-nowrap text-[12px] sm:text-[14px]">
                    <span className="">최빈 클리어 시간</span>

                    {mostCommonDurations.map(({ duration, count, rankRanges }, index) => (
                        <span key={duration} className="inline-flex items-center gap-x-1">
                            {index > 0 && (
                                <span className="mr-1">/</span>
                            )}
                            <span className="font-bold text-[14px] sm:text-[16px]">
                                {duration}초
                            </span>
                            <span>
                                {count}명
                            </span>
                            <span className="text-gray-600 dark:text-zinc-500">
                                ({rankRanges.map(([start, end]) =>
                                    start === end ? `${start}위` : `${start}~${end}위`
                                ).join(', ')})
                            </span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// 대충돌 시간컷 3분
const MAX_TIME = 180;

function tryInfo(duration: number) {
    if (duration === null) return { tryNum: 1, actualDuration: null };
    if (duration <= MAX_TIME) {
        return { tryNum: 1, actualDuration: duration }
    }

    const failedTries = Math.floor(duration / MAX_TIME);
    const actualDuration = duration % MAX_TIME;
    const tryNum = failedTries + 1;

    return { tryNum, actualDuration }
}

function preprocessData(rawData: ClashPlayerData[] | FrontierPlayerData[]) {
    return rawData.map(item => {
        const { tryNum, actualDuration } = tryInfo(item.duration);
        return {
            ...item,
            ...(tryNum > 1 && { tryNum: tryNum }),
            duration: actualDuration,
            rawDuration: item.duration,
        };
    });
};

function buildSegments(arr: any[]) {
    if (!arr.length) return [];
    const segments: { grade: number; tryNum: number; startIdx: number; endIdx: number; isScoreSegment: boolean }[] = [];
    let start = 0;

    for (let i = 1; i <= arr.length; i++) {
        const prev = arr[i - 1];
        const curr = arr[i];
        const prevKey = `${prev.grade}-${prev.tryNum}-${prev.duration === null ? 'score' : 'duration'}`;
        const currKey = curr
            ? `${curr.grade}-${curr.tryNum}-${curr.duration === null ? 'score' : 'duration'}`
            : null;


        if (currKey !== prevKey) {
            segments.push({
                grade: prev.grade,
                tryNum: prev.try,
                startIdx: start,
                endIdx: i - 1,
                isScoreSegment: prev.duration === null,
            });
            start = i;
        }
    }
    return segments;
};

export default CleartimeChart;