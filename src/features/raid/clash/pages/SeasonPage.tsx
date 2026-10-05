import { useCallback, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import SEO from "../../../../components/SEO";
import AllPickRateChart from "../../shared/components/charts/AllPickRateChart";
import CleartimeChart from "../components/CleartimeChart";
import ExternalPickRateChart from "../../shared/components/charts/ExternalPickRateChart";
import PersonalityPieChart from "../../shared/components/charts/PersonalityPieChart";
import PickRateChart from "../../shared/components/charts/PickRateChart";
import BestComp from "../../shared/components/BestComp";
import CompListComponent from "../../shared/components/CompListComponent";
import CostumeRank from "../../../../components/CostumeRank";
import InfoComponent from "../../shared/components/InfoComponent";
import RankRangeInputComponent from "../../shared/components/RankRangeInputComponent";
import { useCharExclude } from "../../shared/hooks/useCharExclude";
import { useRaidData } from "../../../../hooks/useRaidData";
import Footer from "../../../../layouts/Footer";
import HeaderNav from "../../../../layouts/HeaderNav";
import SeasonRemote from "../../shared/components/SeasonRemote";
import { containerDarkBG, pageRootContainer } from "../../../../styles/container";
import { ClashExternalData, ClashPlayerData, ClashSeasonData } from "../../../../types/clashTypes";
import { SelectChara } from "../../shared/types/statTypes";
import { computeBestComp, computeStatsForSelect, processCompStat } from "../../shared/utils/chartFunction";
import SelectCharComponent from "../../shared/components/select/SelectCharComponent";

const initRange = { start: 0, end: 0 };

const SeasonPage = () => {

    const { season } = useParams();
    const [select, setSelect] = useState<SelectChara | null>(null);
    const { data } = useRaidData<ClashSeasonData | ClashExternalData>('clash', 'season', season);
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
        setSelect(null);
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

    if (!seasonSlice || !displaySlice) {
        return <Navigate to={"/"} replace /> // "/" 페이지로 이동.
    }

    // console.log("data: ", data)
    // console.log("data: ", data?.type === 'season')

    return (
        <div className={`${pageRootContainer} min-h-screen`}>
            <SEO
                title={`차원 대충돌 시즌${season} 집계`}
                description={`차원 대충돌 시즌${season} 집계: ${data?.startDate} ~ ${data?.endDate}`}
            />
            <HeaderNav />
            <SeasonRemote />
            <div className="lg:w-[992px] w-full mx-auto mt-8 flex flex-col mb-4">
                <h1 className="text-[20px] font-bold p-2">
                    {`차원 대충돌 시즌${season} 집계`}
                </h1>
                <div className={`flex flex-col xs:flex-row dark:text-zinc-200 p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 mt-2 mb-4 overflow-x-auto ${containerDarkBG}`}>
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
                <div className="flex flex-col gap-4">
                    {seasonSlice.type === 'external' && (
                        <>
                            <AllPickRateChart
                                data={seasonSlice}
                            />
                            <ExternalPickRateChart
                                season={season}
                                data={seasonSlice}
                            />
                            <div className={`rounded-xl border border-zinc-300 dark:border-zinc-700 w-full mx-auto flex h-4 ${containerDarkBG} dark:text-zinc-200 p-4 mt-1 text-[12px] lg:text-[13px] items-center justify-center`}>
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
                            {select && (
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
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default SeasonPage;