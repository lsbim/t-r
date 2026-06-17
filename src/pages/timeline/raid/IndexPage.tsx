import { useCallback, useMemo } from "react";
import Loading from "../../../commons/component/Loading";
import SEO from "../../../commons/component/SEO";
import BaseComponent from "../../../components/timeline/raid/BaseComponent";
import CharacterLine from "../../../components/timeline/raid/CharacterLine";
import RaidBlock from "../../../components/timeline/raid/RaidBlock";
import { charInfo } from "../../../data/trickcalChar";
import { useRaidData } from "../../../hooks/useRaidData";
import Footer from "../../../layouts/Footer";
import HeaderNav from "../../../layouts/HeaderNav";
import TopRemote from "../../../layouts/TopRemote";
import { ClashSummary } from "../../../types/clashTypes";
import { ClashV2Summary } from "../../../types/clashV2Types";
import { FrontierSummary } from "../../../types/frontierTypes";

const PIXELS_PER_DAY = 100;
const BASE_DATE_HEIGHT = 20;

const IndexPage = () => {
    const { data: frontier } = useRaidData<FrontierSummary>('frontier', 'summary');
    const { data: clash } = useRaidData<ClashSummary>('clash', 'summary');
    const { data: clashV2 } = useRaidData<ClashV2Summary>('clashV2', 'summary');

    // 사도 출시일, 대충돌/프론티어 시작/종료일 통합 배열
    const allDates = useMemo(() => {
        if (!frontier || !clash || !clashV2) return;

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
            ...Object.values(clashV2).flatMap(r => [
                new Date(r.startDate).toISOString().slice(0, 10),
                new Date(r.endDate).toISOString().slice(0, 10),
            ]),
        ];

        return Array.from(new Set([...charDates, ...raidDates])).sort();
    }, [clash, frontier, clashV2]);

    // 배열길이 - 인덱스 - 1) * 간격으로 Y 위치 설정(내림차순)
    const getYOffset = useCallback((iso: string) => {
        if (!allDates) return 0;
        const idx = allDates.indexOf(iso);
        return (allDates.length - 1 - idx) * PIXELS_PER_DAY;
    }, [allDates]);

    if (!allDates || !frontier || !clash || !clashV2) return (
        <Loading />
    )

    const raidValues = [...Object.values(frontier), ...Object.values(clash), ...Object.values(clashV2)];
    const raidKeys = [...Object.keys(frontier), ...Object.keys(clash), ...Object.keys(clashV2)];

    return (
        <div className="flex flex-col justify-center gap-y-2 min-h-screen">
            <SEO
                title="콘텐츠 출시 타임라인"
                description="트릭컬 리바이브의 차원 대충돌, 엘리아스 프론티어, 사도 출시일 타임라인을 제공합니다."
            />
            <TopRemote />
            <HeaderNav />
            {/* 소개 */}
            <div className="md:w-[768px] mt-6 w-full mx-auto text-[20px] font-bold dark:text-zinc-200 p-2 rounded-xl">
                <h1 className="">컨텐츠 타임라인</h1>

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