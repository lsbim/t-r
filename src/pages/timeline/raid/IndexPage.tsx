import { useCallback, useMemo } from "react";
import { useSummaryData } from "../../../hooks/useSummaryData";
import useTitle from "../../../hooks/useTitle";
import HeaderNav from "../../../layouts/HeaderNav";
import { ClashSummary } from "../../../types/clashTypes";
import { FrontierSummary } from "../../../types/frontierTypes";
import { charInfo } from "../../../data/trickcalChar";
import BaseComponent from "../../../components/timeline/raid/BaseComponent";
import Footer from "../../../layouts/Footer";
import CharacterLine from "../../../components/timeline/raid/CharacterLine";
import RaidBlock from "../../../components/timeline/raid/RaidBlock";
import TopRemote from "../../../layouts/TopRemote";

const PIXELS_PER_DAY = import.meta.env.VITE_TIMELINE_PIXELS_PER_DAY;
const BASE_DATE_HEIGHT = import.meta.env.VITE_TIMELINE_BASE_DATE_HEIGHT;

const IndexPage = () => {
    const { data: frontier } = useSummaryData<FrontierSummary>('frontier');
    const { data: clash } = useSummaryData<ClashSummary>('clash');
    useTitle("콘텐츠 출시 타임라인");

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

    if (!allDates || !frontier || !clash) return (
        <div>
            <HeaderNav />
            <Footer />
        </div>
    )

    const raidValues = [...Object.values(frontier), ...Object.values(clash)];
    const raidKeys = [...Object.keys(frontier), ...Object.keys(clash)];

    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <TopRemote />
            <HeaderNav />
            {/* 소개 */}
            <div className="lg:w-[992px] w-full mx-auto flex flex-col bg-white p-4 shadow-md mt-4 overflow-x-auto">
                <div className="flex flex-col justify-start mb-3">
                    <h1 className="text-[20px] font-bold mr-2">보스 타임라인</h1>
                    <span className="flex text-[14px]">다음 콘텐츠의 출시 타임라인을 제공합니다.</span>
                </div>
                <div className="flex gap-x-4 items-center mb-2">
                    <div className="flex-col flex">
                        <span className="text-[12px] text-orange-500 font-bold">
                            차원 대충돌
                        </span>
                        <span className="text-[12px] text-orange-500 font-bold">
                            엘리아스 프론티어
                        </span>
                        <span className="text-[12px] text-orange-500 font-bold">
                            사도 출시일
                        </span>
                    </div>
                </div>
                <span className="flex text-[12px]">집계되지 않은 시즌은 제외됩니다.</span>
            </div>
            {/* 타임라인 */}
            <div style={{ height: allDates.length * PIXELS_PER_DAY }} className=" mt-2 relative overflow-x-auto">
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