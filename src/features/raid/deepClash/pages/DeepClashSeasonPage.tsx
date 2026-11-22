import { useCallback, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import CostumeRank from "../../../../components/CostumeRank";
import { useRaidData } from "../../../../hooks/useRaidData";
import Footer from "../../../../layouts/Footer";
import HeaderNav from "../../../../layouts/HeaderNav";
import { containerDarkBG, pageRootContainer } from "../../../../styles/container";
import { DeepClashPlayerData, DeepClashSeasonData, DeepClashType } from "../../../../types/deepClashTypes";
import { getPersonalityColor, personalityObjKo } from "../../../../types/trickcalTypes";
import BestComp from "../../shared/components/BestComp";
import CompListComponent from "../../shared/components/CompListComponent";
import InfoComponent from "../../shared/components/InfoComponent";
import AllPickRateChart from "../../shared/components/charts/AllPickRateChart";
import PersonalityPieChart from "../../shared/components/charts/PersonalityPieChart";
import PickRateChart from "../../shared/components/charts/PickRateChart";
import RankRangeInputComponent from "../../shared/components/RankRangeInputComponent";
import SeasonRemote from "../../shared/components/SeasonRemote";
import SelectCharComponent from "../../shared/components/select/SelectCharComponent";
import { useCharExclude } from "../../shared/hooks/useCharExclude";
import { SelectChara } from "../../shared/types/statTypes";
import { computeBestComp, computeStatsForSelect } from "../../shared/utils/chartFunction";
import DeepClashChart from "../components/DeepClashChart";
import { getPartySize, processDeepClashData, processFullCompStat } from "../utils/deepClashFunction";

const initRange = { start: 0, end: 0 };

const getArr = (r: DeepClashPlayerData) => r.arr;

const DeepClashSeasonPage = () => {

    const { season } = useParams();
    const [select, setSelect] = useState<SelectChara | null>(null);
    const [deepType, setDeepType] = useState<DeepClashType>('boss');
    const [appliedRange, setAppliedRange] = useState(initRange);
    const { data } = useRaidData<DeepClashSeasonData>('deepClash', 'season', season);

    // 보스/성격해역 중 선택한 것만 기존 집계 컴포넌트가 받는 모양으로 변환
    const seasonSlice = useMemo(() => data ? processDeepClashData(data, deepType) : undefined, [data, deepType]);

    const rankedSlice = useMemo(() => {
        if (!seasonSlice || (appliedRange.start === 0 && appliedRange.end === 0)) return seasonSlice;
        return {
            ...seasonSlice,
            data: seasonSlice.data.filter(player => player.rank >= appliedRange.start && player.rank <= appliedRange.end),
        };
    }, [seasonSlice, appliedRange]);

    const { excludedSet, filteredData, toggleExclude, clearExcluded } = useCharExclude({
        data: rankedSlice?.data,
        getArr
    });

    const displaySlice = useMemo(() => {
        if (!rankedSlice) return rankedSlice;
        return { ...rankedSlice, data: filteredData ?? rankedSlice.data };
    }, [rankedSlice, filteredData]);

    const handleCustomRank = useCallback((start: string, end: string) => {
        if (!data || !start || !end) return;
        const startRank = Number(start);
        const endRank = Number(end);
        if (startRank < 1 || endRank < startRank || startRank > data.data.length || endRank > data.data.length) return;
        setAppliedRange({ start: startRank, end: endRank });
    }, [data]);

    // 선택한 사도의 통계용 정보
    const statsForSelect = useMemo(() => {
        if (!select || !seasonSlice || !displaySlice) return null;
        return computeStatsForSelect(
            select,
            rankedSlice.data,
            displaySlice.data,
            getArr,
            true,
            // 성격해역만 클리어 시간 측정
            deepType === 'boss' ? undefined : (r: DeepClashPlayerData) => r.personalities[deepType].duration
        );
    }, [select, rankedSlice, displaySlice, deepType]);

    // 1~100/101~200/201~300 BEST COMP. 보스 9인 / 성격해역 6인 편성만 집계
    const bestComp = useMemo(() => {
        if (!displaySlice) return;

        return computeBestComp(
            displaySlice.data,
            appliedRange,
            initRange,
            group => processFullCompStat(group, getPartySize(deepType))
        );
    }, [displaySlice, appliedRange, deepType]);

    const durationAxisMax = useMemo(() => {
        if (!data?.data.length) return 120;

        const maxDuration = data.data.reduce((seasonMax, player) => {
            const playerMax = Math.max(
                ...Object.values(player.personalities).map(({ duration }) => duration)
            );
            return Math.max(seasonMax, playerMax);
        }, 0);

        // 20초 단위로 올림
        return (Math.floor(maxDuration / 20) + 1) * 20;
    }, [data]);

    const handleDeepType = (id: DeepClashType) => {
        setDeepType(id);
        setAppliedRange(initRange);
        setSelect(null);
        clearExcluded();
    }

    if (!data || !seasonSlice || !displaySlice) {
        return <Navigate to={"/"} replace /> // "/" 페이지로 이동.
    }

    return (
        <div className={`${pageRootContainer} min-h-screen`}>
            <HeaderNav />
            <SeasonRemote />
            {/* 보스/성격해역 선택지 */}
            <div className="w-full flex font-bold backdrop-blur-sm justify-between h-10 border-b border-zinc-300 dark:border-zinc-700 z-50 items-center sticky top-0 bg-white/90 dark:bg-zinc-900/80 dark:text-zinc-200">
                {([
                    { id: 'boss', label: '보스' },
                    { id: 'innocence', label: '순수' },
                    { id: 'composed', label: '냉정' },
                    { id: 'madness', label: '광기' },
                    { id: 'vivacious', label: '활발' },
                    { id: 'depressed', label: '우울' },
                ] satisfies { id: DeepClashType; label: string }[]).map(({ id, label }) => (
                    <button
                        key={id}
                        className="w-1/6 h-full cursor-pointer duration-150 group"
                        onClick={() => handleDeepType(id)}
                    >
                        <span
                            style={deepType === id && id !== 'boss'
                                ? { backgroundColor: `${getPersonalityColor(personalityObjKo[id])}99` }
                                : undefined}
                            className={`inline-block px-3 py-[2px] rounded-2xl transition-colors duration-200 ${id === 'boss'
                                ? deepType === id
                                    ? 'bg-[rgba(224,115,6,0.6)] dark:bg-[rgba(224,115,6,0.8)]'
                                    : 'group-hover:bg-[rgba(224,115,6,0.3)] dark:group-hover:bg-[rgba(224,115,6,0.5)]'
                                : 'dark:brightness-90'
                                }`}
                        >
                            {label}
                        </span>
                    </button>
                ))}
            </div>

            <div className="lg:w-[992px] w-full mx-auto mt-8 flex flex-col mb-4 dark:text-zinc-200">
                <h1 className="text-[20px] font-bold p-2">
                    {`심해 대격돌 시즌${season} 집계`}
                </h1>
                <div className="flex flex-col gap-4">
                    <div className={`flex flex-col xs:flex-row p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 mt-2 mb-4 overflow-x-auto ${containerDarkBG}`}>
                        <PersonalityPieChart data={displaySlice} />
                        <InfoComponent
                            startDate={data.startDate}
                            endDate={data.endDate}
                            name={data.name}
                            raidType="frontier"
                        />
                        <RankRangeInputComponent handleCustomRank={handleCustomRank} />
                    </div>
                    <AllPickRateChart
                        data={displaySlice}
                        setSelect={setSelect}
                        isDeepClash
                    />
                    <PickRateChart
                        season={season}
                        data={displaySlice}
                        setSelect={setSelect}
                        select={select}
                        fullData={rankedSlice}
                        excludedSet={excludedSet}
                    />
                    {select && (
                        <SelectCharComponent
                            statsForSelect={statsForSelect}
                            toggleExclude={toggleExclude}
                            scoreType="duration"
                        />
                    )}
                    {bestComp && bestComp.length > 0 && (
                        <BestComp
                            data={bestComp}
                        />
                    )}
                    <CostumeRank
                        data={seasonSlice}
                    />
                    <DeepClashChart
                        data={displaySlice}
                        type={deepType}
                        select={select?.name}
                        durationAxisMax={durationAxisMax}
                    />
                    <CompListComponent
                        season={season}
                        data={displaySlice}
                        userCnt={displaySlice.data.length}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default DeepClashSeasonPage;
