import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    ChartOptions,
    Plugin,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { ClashSummary } from '../../../../types/clashTypes';
import { SummaryData } from '../../../../types/trickcalTypes';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

// 차트에 사용할 집계된 캐릭터 데이터
type AggregatedCharData = {
    name: string;
    imageUrl: string;
    totalCount: number;  // 5개 성격 보스 전체 출전 횟수 합계
    bossStats: {
        광기: number;
        순수: number;
        냉정: number;
        활발: number;
        우울: number;
    };
};

type ClashScatterChartProps = {
    seasonsData: ClashSummary;
};

const CANVAS_SIZE = 200;
const AXES = [
    { label: '광기', angle: -90 },   // 12시 방향
    { label: '순수', angle: -18 },   // 2시 방향
    { label: '냉정', angle: 54 },    // 4시 방향
    { label: '활발', angle: 126 },   // 8시 방향
    { label: '우울', angle: 198 },   // 10시 방향
];

const PentagonScatterChart = ({ seasonsData }: ClashScatterChartProps) => {

    // --- 4. 데이터 유효성 검사 ---
    const validSeasons = useMemo(() => {
        if (!seasonsData || typeof seasonsData !== 'object') {
            return [];
        }

        // 객체를 배열로 변환 (Object.entries 사용)
        return Object.entries(seasonsData)
            .map(([seasonNumber, seasonData]) => ({
                seasonNumber,
                ...seasonData
            }))
            .filter(season => season.personality && Array.isArray(season.summary));
    }, [seasonsData]);

    // 데이터가 없으면 로딩 메시지 표시
    if (validSeasons.length === 0) {
        return (
            <div className="w-full flex justify-center items-center bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md">
                <p className="text-gray-500 dark:text-gray-400">
                    시즌 데이터를 불러오는 중입니다...
                </p>
            </div>
        );
    }

    // 5개 성격이 모두 있는지 확인 (경고용)
    const personalities = new Set(validSeasons.map(s => s.personality));
    if (personalities.size < 5) {
        console.warn(`경고: ${personalities.size}개의 성격만 발견되었습니다. 5개가 필요합니다.`);
        console.warn('발견된 성격:', Array.from(personalities));
    }

    // --- 5. 캐릭터별 데이터 집계 ---
    const aggregatedData: AggregatedCharData[] = useMemo(() => {
        // 캐릭터별로 각 성격에서의 출전 횟수를 저장하는 Map
        const charStatsMap = new Map<string, AggregatedCharData>();

        // 각 시즌을 순회하면서 데이터 집계
        validSeasons.forEach(season => {
            const personality = season.personality;

            // 각 시즌의 summary를 순회
            season.summary.forEach((item: SummaryData) => {
                if (!item || !item.name || typeof item.count !== 'number') {
                    console.warn('유효하지 않은 summary 항목:', item);
                    return;
                }

                const charName = item.name;

                // 이 캐릭터가 처음 등장하는 경우 초기화
                if (!charStatsMap.has(charName)) {

                    charStatsMap.set(charName, {
                        name: charName,
                        imageUrl: `/images/profile/${charName}.webp`,
                        totalCount: 0,
                        bossStats: {
                            광기: 0,
                            순수: 0,
                            냉정: 0,
                            활발: 0,
                            우울: 0,
                        }
                    });
                }

                // 해당 캐릭터의 데이터 가져오기
                const charData = charStatsMap.get(charName)!;

                // 같은 캐릭터가 다른 라인에서 여러 번 나올 수 있으므로
                // 누적 연산으로 합산 (예: 티그(영웅) 후열 28회 + 중열 41회 + 전열 7회 = 76회)
                if (personality in charData.bossStats) {
                    charData.bossStats[personality as keyof typeof charData.bossStats] += item.count;
                    charData.totalCount += item.count;
                }
            });
        });

        // Map을 배열로 변환하여 반환
        return Array.from(charStatsMap.values());
    }, [validSeasons]);

    // 집계된 데이터가 없으면 메시지 표시
    if (aggregatedData.length === 0) {
        return (
            <div className="w-full flex justify-center items-center bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md">
                <p className="text-gray-500 dark:text-gray-400">
                    표시할 캐릭터 데이터가 없습니다.
                </p>
            </div>
        );
    }

    // --- 6. 차트 데이터 가공 ---
    const chartData = useMemo(() => {
        // 총 출전 횟수가 높은 순서대로 정렬
        // 큰 캐릭터가 먼저 그려지고 작은 캐릭터가 위에 덮이도록 내림차순 정렬
        const sortedData = [...aggregatedData].sort((a, b) => b.totalCount - a.totalCount);

        // 이미지 크기 계산을 위한 최대/최소값
        const maxCount = sortedData[0]?.totalCount || 1;
        const minCount = sortedData[sortedData.length - 1]?.totalCount || 1;

        // 이미지 크기 범위 설정 (픽셀 단위)
        const maxImageSize = 50;  // 최고 픽률 캐릭터
        const minImageSize = 20;  // 최저 픽률 캐릭터

        // 이미지 크기 계산 함수 (면적 기준 스케일링)
        const getImageSize = (count: number) => {
            // 모든 캐릭터의 픽률이 같다면 중간 크기 사용
            if (maxCount === minCount) {
                return (maxImageSize + minImageSize) / 2;
            }

            // 픽률을 0~1 범위로 정규화
            const ratio = (count - minCount) / (maxCount - minCount);

            // 면적이 픽률에 비례하도록 계산
            // (사람의 시각은 면적의 차이를 더 정확하게 인지함)
            const minArea = minImageSize * minImageSize;
            const maxArea = maxImageSize * maxImageSize;
            const targetArea = minArea + (maxArea - minArea) * ratio;

            // 면적에서 한 변의 길이 계산 (제곱근)
            return Math.sqrt(targetArea);
        };

        // 각 캐릭터의 위치와 크기 계산
        const dataPoints = sortedData.map((char) => {
            let x = 0;
            let y = 0;
            let totalWeight = 0;

            // 벡터 합산으로 무게중심 계산
            // 각 성격이 캐릭터를 자신의 방향으로 당기는 힘으로 작용
            AXES.forEach((axis) => {
                const count = char.bossStats[axis.label as keyof typeof char.bossStats] || 0;
                const radian = (axis.angle * Math.PI) / 180;  // 각도를 라디안으로 변환

                // 해당 성격 방향으로 count만큼 이동
                x += Math.cos(radian) * count;
                y += Math.sin(radian) * count;
                totalWeight += count;
            });

            // 좌표 정규화 (총 무게로 나누고 스케일 적용)
            if (totalWeight > 0) {
                const scale = (CANVAS_SIZE / 2) * 1.2;  // 1.2는 점들이 너무 중앙에 몰리지 않게 하는 계수
                x = (x / totalWeight) * scale;
                y = (y / totalWeight) * scale;
            }

            // 완전히 겹치는 캐릭터들을 약간 떨어뜨리기 위한 미세한 떨림 추가
            x += (Math.random() - 0.5) * 5;
            y += (Math.random() - 0.5) * 5;

            // 캐릭터 이미지 객체 생성
            const img = new Image();
            img.src = char.imageUrl;
            const imageSize = getImageSize(char.totalCount);
            img.width = imageSize;
            img.height = imageSize;

            return {
                x,
                y,
                r: imageSize / 2,  // Chart.js는 반지름으로 크기 지정
                charInfo: char,    // 툴팁에서 사용할 원본 데이터
                pointStyle: img    // Chart.js가 이미지를 포인트로 렌더링
            };
        });

        return {
            datasets: [{
                label: 'Character Distribution',
                data: dataPoints,
                backgroundColor: 'transparent',  // 이미지만 보이도록
                borderColor: 'transparent',
            }]
        };
    }, [aggregatedData]);

    // --- 7. 커스텀 플러그인: 오각형 배경 그리기 ---
    const pentagonBackgroundPlugin: Plugin = {
        id: 'pentagonBackground',
        beforeDraw: (chart) => {
            const { ctx, chartArea: { width, height, left, top } } = chart;
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            const radius = Math.min(width, height) / 2.2;  // 패딩 고려

            ctx.save();

            // 텍스트 스타일 설정
            ctx.font = 'bold 14px "Pretendard Variable", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 다크모드 감지 및 색상 설정
            const isDark = document.documentElement.classList.contains('dark');
            const lineColor = isDark ? '#3f3f46' : '#e4e4e7';  // zinc-700 : zinc-200
            const textColor = isDark ? '#e4e4e7' : '#52525b';  // zinc-200 : zinc-600

            // 1. 중심에서 각 꼭지점으로 향하는 축 그리기
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;

            AXES.forEach((axis) => {
                const radian = (axis.angle * Math.PI) / 180;
                const x = centerX + Math.cos(radian) * radius;
                const y = centerY + Math.sin(radian) * radius;

                // 중심에서 꼭지점까지 선 그리기
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.stroke();

                // 성격 라벨을 꼭지점보다 약간 바깥쪽에 배치
                const labelX = centerX + Math.cos(radian) * (radius + 25);
                const labelY = centerY + Math.sin(radian) * (radius + 25);
                ctx.fillStyle = textColor;
                ctx.fillText(axis.label, labelX, labelY);
            });

            // 2. 오각형 테두리 그리기 (3단계로 가이드라인 표시)
            // 100%, 66%, 33% 크기의 오각형을 그려서 픽률 범위를 시각적으로 보여줌
            [1, 0.66, 0.33].forEach(ratio => {
                ctx.beginPath();
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = ratio === 1 ? 2 : 1;  // 가장 바깥 테두리는 굵게

                AXES.forEach((axis, i) => {
                    const radian = (axis.angle * Math.PI) / 180;
                    const x = centerX + Math.cos(radian) * radius * ratio;
                    const y = centerY + Math.sin(radian) * radius * ratio;

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.closePath();
                ctx.stroke();
            });

            ctx.restore();
        }
    };

    // --- 8. 차트 옵션 ---
    const options: ChartOptions<'bubble'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: false,  // X축 숨김 (오각형 좌표계 사용)
                min: -CANVAS_SIZE / 2 - 20,
                max: CANVAS_SIZE / 2 + 20
            },
            y: {
                display: false,  // Y축 숨김
                min: -CANVAS_SIZE / 2 - 20,
                max: CANVAS_SIZE / 2 + 20
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(30, 30, 33, 0.95)',
                titleColor: '#fff',
                bodyColor: '#ccc',
                padding: 12,
                cornerRadius: 6,
                displayColors: false,
                callbacks: {
                    title: (context: any) => {
                        const char = context[0].raw.charInfo as AggregatedCharData;
                        return char.name;
                    },
                    label: (context: any) => {
                        const char = context.raw.charInfo as AggregatedCharData;
                        return `총 출전: ${char.totalCount}회`;
                    },
                    afterBody: (context: any) => {
                        const char = context[0].raw.charInfo as AggregatedCharData;
                        // 출전 횟수가 있는 성격만 필터링하여 표시
                        const stats = Object.entries(char.bossStats)
                            .filter(([_, count]) => count > 0)
                            .map(([type, count]) => `  ${type}: ${count}회`)
                            .join('\n');
                        return stats ? `\n[성격별 출전]\n${stats}` : '';
                    }
                }
            }
        },
        animation: {
            duration: 0  // 이미지 로딩 깜빡임 방지
        }
    };

    return (
        <div className="w-full flex justify-center items-center bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md">
            <div className="relative w-[600px] h-[600px]">
                <Bubble
                    data={chartData}
                    options={options}
                    plugins={[pentagonBackgroundPlugin]}
                />
            </div>
        </div>
    );
};

export default PentagonScatterChart;