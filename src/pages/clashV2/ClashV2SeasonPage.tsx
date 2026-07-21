import { useCallback, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Loading from "../../commons/component/Loading";
import SEO from "../../commons/component/SEO";
import AllPickRateChart from "../../components/chart/AllPickRateChart";
import ClashV2Chart from "../../components/chart/clashV2/ClashV2Chart";
import SideSkillChart from "../../components/chart/clashV2/SideSkillChart";
import PersonalityPieChart from "../../components/chart/PersonalityPieChart";
import PickRateChart from "../../components/chart/PickRateChart";
import BestComp from "../../components/shared/BestComp";
import CompListComponent from "../../components/shared/CompListComponent";
import CostumeRank from "../../components/shared/CostumeRank";
import InfoComponent from "../../components/shared/InfoComponent";
import RankRangeInputComponent from "../../components/shared/RankRangeInputComponent";
import SelectCharComponent from "../../components/shared/select/SelectCharComponent";
import { useCharExclude } from "../../hooks/useCharExclude";
import { useRaidData } from "../../hooks/useRaidData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import SeasonRemote from "../../layouts/SeasonRemote";
import { ClashV2PlayerData, ClashV2SeasonData } from "../../types/clashV2Types";
import { computeBestComp, computeStatsForSelect, processCompStat } from "../../utils/chartFunction";

const initRange = { start: 0, end: 0 };

const ClashV2SeasonPage = () => {

    const { season } = useParams();
    const [select, setSelect] = useState<string>('');
    const { data, isLoading, error } = useRaidData<ClashV2SeasonData>('clashV2', 'season', season);
    const [appliedRange, setAppliedRange] = useState(initRange);
    const [v2Type, setV2Type] = useState<'main' | 'side'>('main')
    const seasonName = Number(season) >= 10000 ? `베타 시즌${Number(season) - 10000}` : `시즌${season}`;

    const hasSkinArr = data?.type === 'season' && data.data[0]?.skinArr !== undefined;

    // 순위 나누기
    const seasonSlice = useMemo(() => {
        if (!data) {
            return undefined;
        }

        if (appliedRange === initRange || (appliedRange.start === 1 && appliedRange.end === 300)) {
            return data;
        }

        const customSeasonData: ClashV2SeasonData = {
            ...data,
            data: data.data.slice(appliedRange.start - 1, appliedRange.end)
        };

        return customSeasonData;

    }, [appliedRange, data]);

    const getArr = useCallback((r: ClashV2PlayerData) =>
        v2Type === 'main' ? r.arr : r.sideArr
        , [v2Type]);

    const { excludedSet, filteredData, toggleExclude, clearExcluded } = useCharExclude({
        data: seasonSlice?.type === 'season' ? (seasonSlice.data as ClashV2PlayerData[]) : undefined,
        getArr
    });

    const displaySlice = useMemo(() => {
        if (!seasonSlice || seasonSlice.type !== 'season') return seasonSlice;
        return { ...seasonSlice, data: filteredData ?? seasonSlice.data };
    }, [seasonSlice, filteredData]);

    // 커스텀 순위 지정
    const handleCustomRank = useCallback((start: string, end: string) => {
        if (start === "" || end === "") return;

        const startRank = Number(start);
        const endRank = Number(end);

        if (startRank < 1 || endRank < startRank) return;
        if (data?.type === "season" &&
            (endRank > data?.data?.length || startRank > data?.data?.length)) return;

        // 선택 사도 초기화
        setSelect('');
        setAppliedRange({ start: startRank, end: endRank })
    }, [data]);

    // 선택한 사도의 통계용 정보
    const statsForSelect = useMemo(() => {
        if (!select || !seasonSlice || !displaySlice) return null;
        return computeStatsForSelect(
            select,
            seasonSlice.data as ClashV2PlayerData[],
            displaySlice.data as ClashV2PlayerData[],
            v2Type === 'main' ? (r: ClashV2PlayerData) => r.arr : (r: ClashV2PlayerData) => r.sideArr,
            true // 9인 편성만 통계
        );
    }, [select, seasonSlice, displaySlice, v2Type]);

    // 1~100/101~200/201~300 or 지정 구간 BEST COMP
    const bestComp = useMemo(() => {
        if (!displaySlice) return;

        return computeBestComp(
            displaySlice.data as ClashV2PlayerData[],
            appliedRange,
            initRange,
            group => processCompStat(group, undefined, v2Type === 'side' ? v2Type : undefined)
        )
    }, [displaySlice, appliedRange, v2Type]);


    const handleV2Type = (t: 'side' | 'main') => {
        setV2Type(t);
        setSelect('');
        clearExcluded(); // 탭 전환 시 제외 사도 초기화
    }

    if (isLoading) {
        return (
            <Loading />
        )
    }

    if (!seasonSlice || !displaySlice) {
        return <Navigate to={"/"} replace /> // "/" 페이지로 이동.
    }

    // console.log("data: ", data)
    // console.log("data: ", data?.type === 'season')

    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <SEO
                title={`차원 대충돌 2.0 ${seasonName} 집계`}
                description={`차원 대충돌 2.0 ${seasonName} 집계: ${data?.startDate} ~ ${data?.endDate}`}
            />
            <HeaderNav />
            <SeasonRemote />
            {/* 림/셰이디 선택지 */}
            <div className="w-full flex font-bold backdrop-blur-sm justify-between h-10 mt-[-16px] border-b border-zinc-300 dark:border-zinc-700 z-50 items-center sticky top-0 bg-white/90 dark:bg-zinc-900/80 dark:text-zinc-200">
                {/* 구분선 */}
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[50%] bg-zinc-500 dark:bg-zinc-700"
                />

                <button
                    className={`w-[50%] cursor-pointer duration-150 group`}
                    onClick={() => handleV2Type('side')}>
                    <span className={`w-24 mx-auto px-4 py-[2px] rounded-2xl transition-colors duration-200  ${v2Type !== 'side' && ' group-hover:bg-[rgba(16,117,53,0.3)]'} ${v2Type === 'side' && ' bg-[rgba(16,117,53,0.6)]'}`}>

                        림의 이면세계
                    </span>
                </button>
                <button
                    className={`w-[50%] cursor-pointer duration-150 group`}
                    onClick={() => handleV2Type('main')}>
                    <span className={`w-24 mx-auto px-4 py-[2px] rounded-2xl transition-colors duration-200  ${v2Type !== 'main' && ' group-hover:bg-[rgba(224,115,6,0.3)] dark:group-hover:bg-[rgba(224,115,6,0.5)]'} ${v2Type === 'main' && ' bg-[rgba(224,115,6,0.6)] dark:bg-[rgba(224,115,6,0.8)]'}`}>
                        셰이디의 차원
                    </span>
                </button>
            </div>
            <div className="lg:w-[992px] w-full mx-auto flex flex-col xs:flex-row bg-white dark:bg-zinc-900 dark:text-zinc-200 p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 mt-4 overflow-x-auto">
                {data && (
                    <PersonalityPieChart
                        data={displaySlice}
                        type={v2Type === 'side' ? v2Type : undefined}
                    />
                )}
                <InfoComponent
                    startDate={seasonSlice?.startDate}
                    endDate={seasonSlice?.endDate}
                    name={seasonSlice?.name}
                    grade={seasonSlice?.maxLvl}
                    rules={seasonSlice?.rules}
                    raidType="clash"
                    personality={seasonSlice?.personality}
                />
                {seasonSlice.type === "season" && (
                    <RankRangeInputComponent
                        handleCustomRank={handleCustomRank}
                    />
                )}
            </div>
            <>
                <AllPickRateChart
                    data={displaySlice}
                    setSelect={setSelect}
                    type={v2Type === 'side' ? v2Type : undefined}
                />
                <PickRateChart
                    season={season}
                    data={displaySlice}
                    setSelect={setSelect}
                    type={v2Type === 'side' ? v2Type : undefined}
                    select={select}
                    fullData={seasonSlice}
                    excludedSet={excludedSet}
                />
                {select !== '' && (
                    <SelectCharComponent
                        statsForSelect={statsForSelect}
                        toggleExclude={toggleExclude}
                    />
                )}
                <ClashV2Chart
                    data={displaySlice}
                />
                <SideSkillChart
                    data={displaySlice}
                />
                {hasSkinArr && (
                    <CostumeRank
                        data={data}
                        type={v2Type === 'side' ? v2Type : undefined}
                    />
                )}
                {bestComp && bestComp?.length > 0 && (
                    <BestComp
                        data={bestComp}
                    />
                )}
                <CompListComponent
                    season={season}
                    data={displaySlice}
                    userCnt={displaySlice?.data?.length}
                    type={v2Type === 'side' ? v2Type : undefined}
                />
            </>
            <Footer />
        </div>
    );
}

export default ClashV2SeasonPage;