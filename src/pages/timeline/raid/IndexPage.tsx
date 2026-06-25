import { useMemo } from "react";
import SEO from "../../../commons/component/SEO";
import MinimapHandle from "../../../components/timeline/minimap/MinimapHandle";
import MainStage from "../../../components/timeline/timeline/MainStage";
import { charInfo } from "../../../data/trickcalChar";
import { useRaidData } from "../../../hooks/useRaidData";
import useTimelineDrag from "../../../hooks/useTimelineDrag";
import Footer from "../../../layouts/Footer";
import HeaderNav from "../../../layouts/HeaderNav";
import TopRemote from "../../../layouts/TopRemote";
import { ClashSummary } from "../../../types/clashTypes";
import { ClashV2Summary } from "../../../types/clashV2Types";
import { FrontierSummary } from "../../../types/frontierTypes";
import { CharacterNode, RaidNode, TimelineMap, TimelineNodeType } from "../../../types/timeline/timelineTypes";
import { DAY_PX, START_DATE } from "../../../utils/timeline/timelineFunction";

const END_DATE = getKstTodayDate();
const TOTAL_DAYS = Math.floor((END_DATE.getTime() - START_DATE.getTime()) / 86400000);

const IndexPage = () => {
    const { data: frontier } = useRaidData<FrontierSummary>('frontier', 'summary');
    const { data: clash } = useRaidData<ClashSummary>('clash', 'summary');
    const { data: clashV2 } = useRaidData<ClashV2Summary>('clashV2', 'summary');

    const timelinePx: number = TOTAL_DAYS * DAY_PX;

    const {
        offsetXRef,
        handlePctRef,
        layerRef,
        handleElRef,
        tooltipElRef,
        handleChangeHandle,
        handlePointerDown,
    } = useTimelineDrag({ timelinePx });

    // 키: 날짜, 값: 레이드/사도 정보 객체[]
    const timelineMap: TimelineMap = useMemo(() => {
        if (!frontier || !clash || !clashV2) return {};

        const map: TimelineMap = {};

        const pushNode = (date: string, node: RaidNode | CharacterNode) => {
            if (!map[date]) map[date] = [];
            map[date].push(node);
        };

        // 사도 출시일
        Object.entries(charInfo).forEach(([name, info]) => {
            if (name.startsWith("우로스(")) return;
            pushNode(info.birthdate, {
                type: "character",
                name,
                personality: info.personality,
                birthDate: info.birthdate
            });
        });

        // 레이드 객체들
        const raidSources: [TimelineNodeType, FrontierSummary | ClashSummary | ClashV2Summary][] = [
            ["clash", clash],
            ["clashV2", clashV2],
            ["frontier", frontier],
        ];

        raidSources.forEach(([type, source]) => {
            Object.entries(source).forEach(([key, r]) => {
                const start = new Date(r.startDate).toISOString().slice(0, 10);
                const end = new Date(r.endDate).toISOString().slice(0, 10);
                pushNode(start, {
                    type,
                    name: r.name,
                    season: key,
                    startDate: start,
                    endDate: end,
                    personality: r.personality ?? null
                });
            });
        });

        return map;
    }, [clash, frontier, clashV2]);

    console.log(timelineMap)

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
            <div className="w-full mx-auto flex flex-col items-center my-8 gap-y-4">

                <MinimapHandle
                    handleElRef={handleElRef}
                    tooltipElRef={tooltipElRef}
                    totalDays={TOTAL_DAYS}
                    onChange={handleChangeHandle}
                    timelineMap={timelineMap}
                />

                <MainStage
                    layerRef={layerRef}
                    onPointerDown={handlePointerDown}
                    timelineMap={timelineMap}
                />
            </div>
            <Footer />
        </div >
    );
}

// 한국 시간 기준 '오늘날'
function getKstTodayDate(): Date {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const kstDateStr = formatter.format(new Date()); // "2023-09-27" 형식
    const [y, m, d] = kstDateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
}

export default IndexPage;