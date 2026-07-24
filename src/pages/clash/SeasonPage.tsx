import { useCallback, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Loading from "../../commons/component/Loading";
import SEO from "../../commons/component/SEO";
import AllPickRateChart from "../../components/chart/AllPickRateChart";
import CleartimeChart from "../../components/chart/CleartimeChart";
import ExternalPickRateChart from "../../components/chart/ExternalPickRateChart";
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
import { ClashExternalData, ClashPlayerData, ClashSeasonData } from "../../types/clashTypes";
import { computeBestComp, computeStatsForSelect, processCompStat } from "../../utils/chartFunction";

const initRange = { start: 0, end: 0 };

const SeasonPage = () => {

    const { season } = useParams();
    const [select, setSelect] = useState<string>('');
    const { data, isLoading, error } = useRaidData<ClashSeasonData | ClashExternalData>('clash', 'season', season);
    const [appliedRange, setAppliedRange] = useState(initRange);

    const hasSkinArr = data?.type === 'season' && data.data[0]?.skinArr !== undefined;

    // 순위 나누기
    const seasonSlice = useMemo(() => {
        if (!data) {
            return undefined;
        }

        if (appliedRange === initRange || (appliedRange.start === 1 && appliedRange.end === 300)) {
            return data;
        }

        // season/external로 나눈 타입을 체크를 해 줘야 하위 속성을 가졌다고 판단
        if (data.type === 'season') {
            const customSeasonData: ClashSeasonData = {
                ...data,
                data: data.data.slice(appliedRange.start - 1, appliedRange.end)
            };

            return customSeasonData;

        } else { // data.type === 'external'
            const customSeasonData: ClashExternalData = {
                ...data,
                data: data.data.slice(appliedRange.start - 1, appliedRange.end)
            };

            return customSeasonData;
        }

    }, [appliedRange, data]);

    const getArr = useCallback((r: ClashPlayerData) => r.arr, []);
    const { excludedSet, filteredData, toggleExclude } = useCharExclude({
        data: seasonSlice?.type === 'season' ? (seasonSlice.data as ClashPlayerData[]) : undefined,
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
            seasonSlice.data as ClashPlayerData[],
            displaySlice.data as ClashPlayerData[],
            r => r?.arr,
            false,
            r => r?.duration
        );
    }, [select, seasonSlice, displaySlice]);

    // 1~100/101~200/201~300 or 지정 구간 BEST COMP
    const bestComp = useMemo(() => {
        if (!displaySlice || displaySlice.type === 'external') return;

        return computeBestComp(
            displaySlice.data as ClashPlayerData[],
            appliedRange,
            initRange,
            group => processCompStat(group)
        )
    }, [displaySlice, appliedRange]);

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
                title={`차원 대충돌 시즌${season} 집계`}
                description={`차원 대충돌 시즌${season} 집계: ${data?.startDate} ~ ${data?.endDate}`}
            />
            <HeaderNav />
            {/* {data?.type === 'season' && ( */}
            <SeasonRemote />
            {/* )} */}
            <div className="rounded-xl border border-zinc-300 lg:w-[992px] w-full mx-auto flex flex-col xs:flex-row bg-white dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700 p-4 mt-4 overflow-x-auto">
                {data && (
                    <PersonalityPieChart
                        data={displaySlice}
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
            {seasonSlice.type === 'external' && (
                <>
                    <AllPickRateChart
                        data={seasonSlice}
                    />
                    <ExternalPickRateChart
                        season={season}
                        data={seasonSlice}
                    />
                    <div className="lg:w-[992px] rounded-xl border border-zinc-300 dark:border-zinc-700 w-full mx-auto flex h-4 dark:bg-zinc-900 dark:text-zinc-200 bg-white p-4 mt-1 text-[12px] lg:text-[13px] items-center justify-center">
                        해당 시즌은 상세 정보를 지원하지 않습니다.
                    </div>
                </>
            )}
            {seasonSlice.type === 'season' && displaySlice?.type === 'season' && (
                <>
                    <AllPickRateChart
                        data={displaySlice}
                        setSelect={setSelect}
                    />
                    <PickRateChart
                        season={season}
                        data={displaySlice}
                        setSelect={setSelect}
                        select={select}
                        fullData={seasonSlice}
                        excludedSet={excludedSet}
                    />
                    {select !== '' && (
                        <SelectCharComponent
                            statsForSelect={statsForSelect}
                            toggleExclude={toggleExclude}
                            scoreType="duration"
                        />
                    )}
                    <CleartimeChart
                        season={season}
                        data={displaySlice}
                    />
                    {hasSkinArr && (
                        <CostumeRank
                            data={data}
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
                    />
                </>
            )}
            <Footer />
        </div>
    );
}

export default SeasonPage;