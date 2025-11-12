import { useCallback, useMemo } from "react";
import { useSummaryData } from "../../../hooks/useSummaryData";
import HeaderNav from "../../../layouts/HeaderNav";
import { ClashSummary } from "../../../types/clashTypes";
import { FrontierSummary } from "../../../types/frontierTypes";
import { charInfo, CharInfoDetail } from "../../../data/trickcalChar";
import BaseComponent from "../../../components/timeline/raid/BaseComponent";
import Footer from "../../../layouts/Footer";
import CharacterLine from "../../../components/timeline/raid/CharacterLine";
import RaidBlock from "../../../components/timeline/raid/RaidBlock";
import TopRemote from "../../../layouts/TopRemote";
import Loading from "../../../commons/component/Loading";
import SEO from "../../../commons/component/SEO";
import { Race } from "../../../types/trickcalTypes";
import BirthTimeline from "../../../components/timeline/chara/BirthTimeline";

const PIXELS_PER_DAY = import.meta.env.VITE_TIMELINE_PIXELS_PER_DAY;
const BASE_DATE_HEIGHT = import.meta.env.VITE_TIMELINE_BASE_DATE_HEIGHT;

const IndexPage = () => {
    const { data: frontier } = useSummaryData<FrontierSummary>('frontier');
    const { data: clash } = useSummaryData<ClashSummary>('clash');

    // 사도 출시일, 대충돌/프론티어 시작/종료일 통합 배열
    const allDates = useMemo(() => {
        if (!frontier || !clash) return;

        const charDates = Object.values(charInfo)
            .map(c => new Date(c.birthdate).toISOString().slice(0, 10)); // "YYYY-MM-DD"

        const raidDates = [
            ...Object.values(frontier).flatMap(r => [
                new Date(r.startDate).toISOString().slice(0, 10),
                new Date(r.endDate).toISOString().slice(0, 10),
            ]),
            ...Object.values(clash).flatMap(r => [
                new Date(r.startDate).toISOString().slice(0, 10),
                new Date(r.endDate).toISOString().slice(0, 10),
            ]),
        ];

        return Array.from(new Set([...charDates, ...raidDates])).sort();
    }, [clash, frontier]);

    // 배열길이 - 인덱스 - 1) * 간격으로 Y 위치 설정(내림차순)
    const getYOffset = useCallback((iso: string) => {
        if (!allDates) return 0;
        const idx = allDates.indexOf(iso);
        return (allDates.length - 1 - idx) * PIXELS_PER_DAY;
    }, [allDates]);

    const charaRaceMap: Map<Race, string[]> = new Map(
        Object.entries(
            Object.entries(charInfo).reduce((acc, [name, info]) => {
                const { race, birthdate } = info;
                if (race) {
                    if (!acc[race]) {
                        acc[race] = []; // 초기화
                    }
                    // 정렬에 쓰일 이름, 출시일 객체 추가
                    acc[race].push({ name, birthdate: new Date(new Date(birthdate).toLocaleString('en-US', { timeZone: 'Asia/Seoul' })) });
                }
                return acc;
            }, {} as Record<Race, { name: string, birthdate: Date }[]>)
        ).map(([race, chara]) => {

            const top3Names = chara
                .sort((a, b) => b.birthdate.getTime() - a.birthdate.getTime()) // 최신순 정렬
                .slice(0, 3) // 내림차순(최신순) top 3
                .map(char => char.name); // 사도 명 추출

            // [k:종족명, v: 사도명[]]
            return [race as Race, top3Names];
        })
    );

    if (!allDates || !frontier || !clash) return (
        <Loading />
    )

    const raidValues = [...Object.values(frontier), ...Object.values(clash)];
    const raidKeys = [...Object.keys(frontier), ...Object.keys(clash)];

    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <SEO
                title="콘텐츠 출시 타임라인"
                description="차원 대충돌, 엘리아스 프론티어, 사도 출시일 타임라인을 제공합니다."
            />
            <TopRemote />
            <HeaderNav />
            {/* 소개 */}
            <div className="lg:w-[992px] w-full mx-auto flex flex-col bg-white dark:bg-zinc-900 dark:text-zinc-200 p-4 shadow-md mt-4 overflow-x-auto">
                <div className="flex flex-col justify-start mb-3">
                    <h1 className="text-[20px] font-bold mr-2">보스 타임라인</h1>
                    <span className="flex text-[14px]">다음 콘텐츠의 출시 타임라인을 제공합니다.</span>
                </div>
                <div className="flex gap-x-4 items-center mb-2">
                    <div className="flex-col flex gap-y-1 text-orange-500 text-[12px] font-bold">
                        <span>
                            차원 대충돌
                        </span>
                        <span>
                            엘리아스 프론티어
                        </span>
                        <span>
                            사도 출시일
                        </span>
                    </div>
                </div>
                <span className="flex text-[12px]">집계되지 않은 시즌은 제외됩니다.</span>
            </div>
            {/* 타임라인 */}
            <div className="md:w-[768px] w-full mx-auto flex flex-col bg-white dark:bg-zinc-900 p-4 shadow-md mt-4 overflow-x-auto">
                <BirthTimeline charaRaceMap={charaRaceMap} />
            </div>
            <div style={{ height: allDates.length * PIXELS_PER_DAY }} className="mt-4 relative overflow-x-auto">
                <BaseComponent
                    allDates={allDates}
                    getYOffset={getYOffset}
                    BASE_DATE_HEIGHT={BASE_DATE_HEIGHT}
                />
                <CharacterLine
                    allDates={allDates}
                    getYOffset={getYOffset}
                />
                <RaidBlock
                    raidValues={raidValues}
                    raidKeys={raidKeys}
                    getYOffset={getYOffset}
                    BASE_DATE_HEIGHT={BASE_DATE_HEIGHT}
                />
            </div>
            <Footer />
        </div>
    );
}

export default IndexPage;