import { useCallback, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import CostumeRank from "../../../../components/CostumeRank";
import { useRaidData } from "../../../../hooks/useRaidData";
import Footer from "../../../../layouts/Footer";
import HeaderNav from "../../../../layouts/HeaderNav";
import { containerDarkBG, pageRootContainer } from "../../../../styles/container";
import { FrontierExternalData, FrontierPlayerData, FrontierSeasonData } from "../../../../types/frontierTypes";
import BestComp from "../../shared/components/BestComp";
import AllPickRateChart from "../../shared/components/charts/AllPickRateChart";
import ExternalPickRateChart from "../../shared/components/charts/ExternalPickRateChart";
import PersonalityPieChart from "../../shared/components/charts/PersonalityPieChart";
import PickRateChart from "../../shared/components/charts/PickRateChart";
import CompListComponent from "../../shared/components/CompListComponent";
import InfoComponent from "../../shared/components/InfoComponent";
import RankRangeInputComponent from "../../shared/components/RankRangeInputComponent";
import SeasonRemote from "../../shared/components/SeasonRemote";
import SelectCharComponent from "../../shared/components/select/SelectCharComponent";
import { useCharExclude } from "../../shared/hooks/useCharExclude";
import { SelectChara } from "../../shared/types/statTypes";
import { computeBestComp, computeStatsForSelect, processCompStat } from "../../shared/utils/chartFunction";
import ScoreAndCoinChart from "../components/ScoreAndCoinChart";

const initRange = { start: 0, end: 0 };

const SeasonPage = () => {

    const { season } = useParams();
    const [select, setSelect] = useState<SelectChara | null>(null);
    // const [userCnt, setUserCnt] = useState<number>(0)

    const prevSeason = season === '1' ? '10002' : String(Number(season) - 1);
    const { data } = useRaidData<FrontierSeasonData | FrontierExternalData>('frontier', 'season', season);
    const { data: prevData } = useRaidData<FrontierSeasonData | FrontierExternalData>('frontier', 'season', prevSeason);
    const [appliedRange, setAppliedRange] = useState(initRange);
    const seasonName = Number(season) >= 10000 ? `베타 시즌${Number(season) - 10000}` : `시즌${season}`;

    const hasSkinArr = data?.type === 'season' && data.data[0]?.skinArr !== undefined;

    // 순위 나누기
    const { seasonData: seasonSlice, prevSeasonData: prevSlice } = useMemo(() => {
        // 시즌 베타1 이전, 시즌3은 데이터가 없다.
        if (!data || (!(prevSeason === "10000" || prevSeason === "3") && !prevData)) {
            return { seasonData: undefined, prevSeasonData: undefined };
        }

        // 범위가 정해지지 않으면 기본 1~100/300위 데이터 제공
        if (appliedRange.start === 0 && appliedRange.end === 0) {
            return { seasonData: data, prevSeasonData: prevData }
        }

        // season/external로 나눈 타입을 체크를 해 줘야 하위 속성을 가졌다고 판단
        if (data.type === 'season') {
            const customSeasonData: FrontierSeasonData = {
                ...data,
                data: data.data.slice(appliedRange.start - 1, appliedRange.end)
            };

            const customPrevData = prevData && prevData.type === 'season'
                ? { ...prevData, data: prevData.data.slice(appliedRange.start - 1, appliedRange.end) }
                : prevData;

            return { seasonData: customSeasonData, prevSeasonData: customPrevData };

        } else { // data.type === 'external'

            // 내가 집계하지 않은 데이터는 순위 개념이 없으므로 그대로 반환
            return { seasonData: data, prevSeasonData: prevData };
        }

        // 기존 의존성배열은 appliedRange, season으로 season이 바뀌면 data/prevData가 바뀌나,
        // data/prevData로 변경해 의도를 정확히 해야한다고 함
    }, [appliedRange, data, prevData]);

    const getArr = useCallback((r: FrontierPlayerData) => r.arr, []);
    const { excludedSet, filteredData, toggleExclude } = useCharExclude({
        data: seasonSlice?.type === 'season' ? (seasonSlice.data as FrontierPlayerData[]) : undefined,
        getArr
    });

    const displaySlice = useMemo(() => {
        if (!seasonSlice || seasonSlice.type !== 'season') return seasonSlice;
        return { ...seasonSlice, data: filteredData ?? seasonSlice.data };
    }, [seasonSlice, filteredData]);

    // 순위 범위 지정
    const handleCustomRank = useCallback((start: string, end: string) => {
        if (start === "" || end === "") return;

        const startRank = Number(start);
        const endRank = Number(end);

        if (startRank < 1 || endRank < startRank) return;
        if (data?.type === "season" &&
            (endRank > data?.data?.length || startRank > data?.data?.length)) return;

        setAppliedRange({ start: startRank, end: endRank })
    }, [data]);

    // 선택한 사도의 통계용 정보
    const statsForSelect = useMemo(() => {
        if (!select || !seasonSlice || !displaySlice || displaySlice.type !== 'season') return null;

        const base = computeStatsForSelect(
            select,
            seasonSlice.data as FrontierPlayerData[],
            displaySlice.data as FrontierPlayerData[],
            r => r?.arr,
            false,
            r => r?.coin
        );

        const filteredData = displaySlice.data as FrontierPlayerData[];


        const coinScoreComparison = (() => {
            if (filteredData.length === 0) return [];

            let coinMin = Infinity;
            let coinMax = -Infinity;
            for (const r of filteredData) {
                if (r.coin < coinMin) coinMin = r.coin;
                if (r.coin > coinMax) coinMax = r.coin;
            }
            if (coinMin === coinMax) coinMax = coinMin + 1;

            const segmentCount = 8; // 차트 X축 구간을 전체 8분할
            const step = (coinMax - coinMin) / segmentCount;

            const segments = Array.from({ length: segmentCount }, (_, i) => ({
                coinLow: coinMin + i * step,
                coinHigh: coinMin + (i + 1) * step,
                usedRankSum: 0, usedCount: 0,
                unusedRankSum: 0, unusedCount: 0,
            }));

            filteredData.forEach(r => {
                let idx = Math.floor((r.coin - coinMin) / step);
                if (idx >= segmentCount) idx = segmentCount - 1;
                if (idx < 0) idx = 0;

                const segment = segments[idx];
                if (r.arr.includes(select?.name)) {
                    segment.usedRankSum += r.rank;
                    segment.usedCount++;
                } else {
                    segment.unusedRankSum += r.rank;
                    segment.unusedCount++;
                }
            });

            return segments.map(s => ({
                label: `${(s.coinLow / 1000).toFixed(1)}k`,
                coinLow: s.coinLow,
                coinHigh: s.coinHigh,
                usedAvgRank: s.usedCount > 0 ? s.usedRankSum / s.usedCount : null,
                unusedAvgRank: s.unusedCount > 0 ? s.unusedRankSum / s.unusedCount : null,
                usedCount: s.usedCount,
                unusedCount: s.unusedCount,
            }));
        })();

        return { ...base, coinScoreComparison };
    }, [select, seasonSlice, displaySlice]);


    // 1~100/101~200/201~300 or 지정 구간 BEST COMP
    const bestComp = useMemo(() => {
        if (!displaySlice || displaySlice.type === 'external') return;

        return computeBestComp(
            displaySlice.data as FrontierPlayerData[],
            appliedRange,
            initRange,
            group => processCompStat(group)
        )
    }, [displaySlice, appliedRange]);

    // 현 시즌 vs 전 시즌 실체의코인 비교
    const compareCoin = useMemo(() => {
        if (!seasonSlice || seasonSlice.type !== 'season') return;

        const curSeason = seasonSlice.data.reduce((acc, cur) => {
            acc.maxCoin = Math.max(acc.maxCoin, cur.coin);
            acc.minCoin = Math.min(acc.minCoin, cur.coin);
            return acc;
        }, { maxCoin: 1, minCoin: 99999 });

        // prevSeason의 type이 season일 때 실체의코인 정보 가져옴
        const prevSeason = prevSlice && prevSlice.type === 'season'
            ? prevSlice.data.reduce((acc, cur) => {
                acc.maxCoin = Math.max(acc.maxCoin, cur.coin);
                acc.minCoin = Math.min(acc.minCoin, cur.coin);
                return acc;
            }, { maxCoin: 1, minCoin: 99999 })
            : null;

        return {
            current: curSeason,
            prev: prevSeason
        }
    }, [seasonSlice, prevSlice])

    if (!seasonSlice || !displaySlice) {
        return <Navigate to={"/"} replace />
    }

    // 베타1시즌 10001의 이전시즌과, 현재 기록이 없는 3시즌은 면제
    if (!(prevSeason === "10000" || prevSeason === "3") && !prevSlice) {
        return <Navigate to={"/"} replace />
    }

    return (
        <div className={`${pageRootContainer} min-h-screen`}>
            <HeaderNav />
            {data?.type === 'season' && (
                <SeasonRemote />
            )}
            <div className="lg:w-[992px] w-full mx-auto mt-8 flex flex-col mb-4">
                <h1 className="text-[20px] font-bold p-2">
                    {`엘리아스 프론티어 ${seasonName} 집계`}
                </h1>
                <div className={`flex flex-col xs:flex-row ${containerDarkBG} mt-2 mb-4 dark:text-zinc-200 p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 overflow-x-auto`}>
                    <PersonalityPieChart
                        data={displaySlice}
                    />
                    <InfoComponent
                        startDate={seasonSlice?.startDate}
                        endDate={seasonSlice?.endDate}
                        name={seasonSlice?.name}
                        grade={seasonSlice?.maxLvl}
                        rules={seasonSlice?.power}
                        raidType="frontier"
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
                                prevData={prevSlice as FrontierExternalData | undefined}
                            />
                            <div className={`flex h-4 ${containerDarkBG} dark:text-zinc-200 p-4 rounded-xl border dark:border-zinc-700 border-zinc-300 mt-1 text-[12px] lg:text-[13px] items-center justify-center`}>
                                해당 시즌은 상세 정보를 지원하지 않습니다.
                            </div>
                        </>
                    )}
                    {seasonSlice?.type === 'season' && prevSlice && displaySlice?.type === 'season' && (
                        <>
                            <AllPickRateChart
                                data={displaySlice}
                                setSelect={setSelect}
                            />
                            <PickRateChart
                                season={season}
                                data={displaySlice}
                                setSelect={setSelect}
                                prevData={prevSlice}
                                select={select}
                                fullData={seasonSlice}
                                excludedSet={excludedSet}
                            />
                            {select && (
                                <SelectCharComponent
                                    statsForSelect={statsForSelect}
                                    toggleExclude={toggleExclude}
                                    scoreType="coin"
                                />
                            )}
                            {bestComp && bestComp?.length > 0 && (
                                <BestComp
                                    data={bestComp}
                                />
                            )}
                            {hasSkinArr && (
                                <CostumeRank
                                    data={data}
                                />
                            )}
                            {compareCoin && data && (
                                <ScoreAndCoinChart
                                    data={displaySlice}
                                    compareCoin={compareCoin}
                                    level={data?.maxLvl}
                                    bossName={data?.name}
                                    select={select?.name}
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
        </div >
    );
}

export default SeasonPage;