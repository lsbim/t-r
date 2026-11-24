import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Chart,
    ChartOptions,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Line } from "react-chartjs-2";
import { useTheme } from "@/hooks/useTheme";
import { getSeasonName } from "@/utils/function";
import { RaidStatsView, RankCutRank, RecordMetric } from "../../types/statTypes";
import { METRIC_META, RANK_CUT_RANKS } from "../../utils/raidStatConfig";
import { getDifficultyChanges } from "../../utils/raidStats";
import StatSection from "./StatSection";

ChartJS.register(
    annotationPlugin,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
);

// 1위는 비교 기준이라 10위·100위·300위만 그림
const RANKS = RANK_CUT_RANKS.filter(rank => rank !== 1);
const COIN_RANGE_LABELS = ['1~10위 중앙값', '11~100위 중앙값', '101~300위 중앙값'] as const;

// 순위별 선 색: 같은 연보라 계열의 명도로 구분 (10위가 가장 옅고 300위가 가장 진함, 다크모드는 300위가 가장 밝음)
// 투명도로 옅게 하면 배경과의 대비가 3:1 아래로 떨어져서 불투명한 색으로 지정
const LINE_COLORS: Record<'light' | 'dark', Partial<Record<RankCutRank, string>>> = {
    light: { 10: '#8884d8', 100: '#5547af', 300: '#2b186f' },
    dark: { 10: '#6862b3', 100: '#9c99ef', 300: '#d6d6ff' },
};

// 선 끝 라벨: 점 중심에서 라벨까지의 거리(px, 마우스를 올려 커진 점보다 커야 함), 오른쪽 여백(px), 라벨끼리 최소 세로 간격(px)
const END_LABEL_OFFSET = 12;
const END_LABEL_PADDING = 152;
const END_LABEL_GAP = 14;
const END_LABEL_HALF_HEIGHT = 10;

// 선 끝 라벨끼리 세로로 겹치면 아래쪽 라벨을 아래로 밀어낼 거리(px)
// 애니메이션 중에도 값이 흔들리지 않도록 점의 최종 y 위치를 사용
const getEndLabelShift = (chart: Chart, datasetIndex: number, lastIndex: number) => {
    const points = chart.data.datasets
        .map((dataset, index) => ({ index, value: dataset.data[lastIndex], y: chart.getDatasetMeta(index).data[lastIndex]?.getProps(['y'], true).y as number | undefined }))
        .filter(point => point.value !== null && point.y !== undefined)
        .sort((a, b) => a.y! - b.y!);

    let prevY = -Infinity;
    for (const point of points) {
        const y = Math.max(point.y!, prevY + END_LABEL_GAP);
        if (point.index === datasetIndex) return y - point.y!;
        prevY = y;
    }
    return 0;
};

// 라벨을 아래로 shift(px)만큼 밀기 위한 정렬 각도(도). 0도는 점의 오른쪽
const getEndLabelAngle = (chart: Chart, datasetIndex: number, lastIndex: number) =>
    (getEndLabelShift(chart, datasetIndex, lastIndex) / (END_LABEL_HALF_HEIGHT + END_LABEL_OFFSET)) * (180 / Math.PI);

const formatRatio = (value: number, unit: '배' | '%', digits = 2) =>
    unit === '%' ? `${Math.round(value)}%` : `${value.toFixed(digits)}배`;

// 툴팁에 함께 보여줄 실제 기록
const formatRecord = (value: number, metric: RecordMetric) => {
    if (metric === 'duration') return `${value}초`;
    if (metric === 'coin') return `${value.toLocaleString()}개`;
    return value.toLocaleString();
};

const formatLevel = (level: number | string) => (typeof level === 'number' ? `${level}단계` : level);

// 점수·클리어 시간은 순위 컷, 코인은 순위 구간 중앙값 차트
const RankCutLine = ({ view, metric, showTitle }: { view: RaidStatsView, metric: RecordMetric, showTitle: boolean }) => {
    const { theme } = useTheme();

    const { seasons } = view;
    const meta = METRIC_META[metric];
    const ratios = view.rankCutRatios[metric] ?? [];

    const seasonLabels = seasons.map(season => getSeasonName(season.season));
    const difficultyChanges = getDifficultyChanges(seasons);
    const lastIndex = seasons.length - 1;

    const tickColor = theme === 'dark' ? 'rgb(244,244,245)' : 'rgb(82,82,91)';
    const gridColor = theme === 'dark' ? 'rgb(39,39,42)' : 'rgb(228,228,231)';
    const lineColor = theme === 'dark' ? '#71717A' : '#A1A1AA';

    // 난이도 변경 경계선
    const difficultyAnnotations: Record<string, any> = {};
    difficultyChanges.forEach(({ index, level }) => {
        difficultyAnnotations[`difficulty_${index}`] = {
            type: 'line',
            xMin: index - 0.5,
            xMax: index - 0.5,
            borderColor: lineColor,
            borderWidth: 1,
            borderDash: [3, 3],
            drawTime: 'beforeDatasetsDraw',
            clip: false,
            label: {
                display: true,
                content: formatLevel(level),
                position: 'end', // 세로선의 위쪽 끝
                yAdjust: -4,
                backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff', // 점선이 글자를 가로지르지 않도록 카드 배경색
                padding: 2,
                color: tickColor,
                font: { size: 11, weight: 'bold' },
            },
        };
    });

    const seriesLabels = metric === 'coin'
        ? [...COIN_RANGE_LABELS]
        : RANKS.map(rank => `${rank}위`);

    const chartData = {
        labels: seasonLabels,
        datasets: seriesLabels.map((label, index) => ({
            label,
            data: metric === 'coin'
                ? seasons.map(season => season.coinMedians?.[index] ?? null)
                : ratios.map(ratio => ratio[RANKS[index]] ?? null),
            borderColor: LINE_COLORS[theme][RANKS[index]],
            backgroundColor: LINE_COLORS[theme][RANKS[index]],
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: LINE_COLORS[theme][RANKS[index]],
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 3,
            spanGaps: false,
        })),
    };

    const maxRatio = Math.max(...chartData.datasets.flatMap(dataset => dataset.data.filter((value): value is number => value !== null)));

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false, axis: 'x' },
        plugins: {
            legend: { display: false },
            annotation: {
                annotations: difficultyAnnotations,
            },
            // 선 끝(최신 시즌)에 순위와 값을 직접 표시
            datalabels: {
                display: ctx => ctx.dataIndex === lastIndex && ctx.dataset.data[ctx.dataIndex] !== null,
                anchor: 'center', // 'end'는 점의 반지름(마우스를 올리면 커짐)에 따라 위치가 바뀌어 라벨이 움직임
                align: ctx => getEndLabelAngle(ctx.chart, ctx.datasetIndex, lastIndex),
                offset: END_LABEL_OFFSET,
                color: tickColor,
                font: { size: 11, weight: 'bold' },
                formatter: (value: number, ctx) => metric === 'coin'
                    ? `${COIN_RANGE_LABELS[ctx.datasetIndex]} ${formatRecord(value, metric)}`
                    : `${RANKS[ctx.datasetIndex]}위 ${formatRatio(value, meta.ratioUnit)}`,
            },
            tooltip: {
                filter: item => item.parsed.y !== null,
                callbacks: {
                    title: items => {
                        const index = items[0].dataIndex;
                        const difficulty = difficultyChanges.find(change => change.index === index);
                        return difficulty ? `${seasonLabels[index]} · ${formatLevel(difficulty.level)} 시작` : seasonLabels[index];
                    },
                    label: item => {
                        if (metric === 'coin') {
                            return ` ${COIN_RANGE_LABELS[item.datasetIndex]} ${formatRecord(item.parsed.y as number, metric)}`;
                        }
                        const rank = RANKS[item.datasetIndex];
                        const record = seasons[item.dataIndex].cuts[metric]?.[rank];
                        const recordText = record === null || record === undefined ? '' : ` (${formatRecord(record, metric)})`;
                        return ` ${rank}위 ${formatRatio(item.parsed.y as number, meta.ratioUnit)}${recordText}`;
                    },
                },
                backgroundColor: 'rgba(30, 30, 33, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                cornerRadius: 6,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: tickColor,
                    font: { size: 11 },
                    maxRotation: 0,
                    minRotation: 0,
                    autoSkipPadding: 8,
                },
            },
            y: {
                suggestedMax: Number.isFinite(maxRatio) ? maxRatio * 1.15 : undefined, // 위쪽에 난이도 라벨이 들어갈 여유
                beginAtZero: metric === 'coin' || meta.ratioUnit === '%',
                suggestedMin: meta.ratioUnit === '배' ? 1 : undefined,
                grid: { color: gridColor },
                ticks: {
                    color: tickColor,
                    font: { size: 12 },
                    callback: value => metric === 'coin'
                        ? Number(value).toLocaleString()
                        : formatRatio(Number(value), meta.ratioUnit, 1),
                },
            },
        },
        layout: {
            padding: { top: 8, right: END_LABEL_PADDING },
        },
    };

    return (
        <div className="min-w-0 flex flex-col gap-y-2">
            {showTitle && (
                <span className="text-[13px] font-bold text-gray-600 dark:text-zinc-400">{meta.label}</span>
            )}
            <div className="h-[300px]">
                {/* ChartDataLabels를 이 차트에만 plugin으로 붙여야 다른 그래프에 적용되지 않음 */}
                <Line data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
            </div>
        </div>
    );
};

// 순위별 기록 섹션: 지표가 여러 개면(프론티어) 한 컨테이너 안에서 lg 이상일 때 가로 배치
const RankCutChart = ({ view, metrics }: { view: RaidStatsView, metrics: RecordMetric[] }) => {

    return (
        <StatSection title={metrics.map(metric => metric === 'coin'
            ? '구간별 코인 중앙값'
            : `순위별 ${METRIC_META[metric].label}`
        ).join(' 및 ')}>
            <div className={`grid gap-4 ${metrics.length > 1 ? 'lg:grid-cols-2' : ''}`}>
                {metrics.map(metric => (
                    <RankCutLine
                        key={metric}
                        view={view}
                        metric={metric}
                        showTitle={metrics.length > 1}
                    />
                ))}
            </div>
        </StatSection>
    );
};

export default RankCutChart;
