import { useCallback, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Loading from "../../commons/component/Loading";
import AllPickRateChart from "../../components/chart/AllPickRateChart";
import CleartimeChart from "../../components/chart/CleartimeChart";
import ExternalPickRateChart from "../../components/chart/ExternalPickRateChart";
import PersonalityPieChart from "../../components/chart/PersonalityPieChart";
import PickRateChart from "../../components/chart/PickRateChart";
import CompListComponent from "../../components/shared/CompListComponent";
import InfoComponent from "../../components/shared/InfoComponent";
import RankRangeInputComponent from "../../components/shared/RankRangeInputComponent";
import SelectCharComponent from "../../components/shared/SelectCharComponent";
import { useSeasonData } from "../../hooks/useSeasonData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import SeasonRemote from "../../layouts/SeasonRemote";
import { ClashPlayerData } from "../../types/clashTypes";
import { CompStat, processCompStat } from "../../utils/chartFunction";
import BestComp from "../../components/shared/BestComp";
import SEO from "../../commons/component/SEO";
import { ClashV2PlayerData, ClashV2SeasonData } from "../../types/clashV2Types";
import FuzzyComponent from "../../commons/animation/FuzzyComponent";
import ClashV2Chart from "../../components/chart/ClashV2Chart";

const initRange = { start: 0, end: 0 };

const ClashV2SeasonPage = () => {

    const { season } = useParams();
    const [select, setSelect] = useState('');
    const { data, isLoading, error } = useSeasonData<ClashV2SeasonData>(season, 'clashV2');
    const [appliedRange, setAppliedRange] = useState(initRange);
    const [v2Type, setV2Type] = useState<'main' | 'side'>('main')
    const seasonName = Number(season) >= 10000 ? `베타 시즌${Number(season) - 10000}` : `시즌${season}`;

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

    }, [appliedRange, data])

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

    // 선택한 사도의 정보
    const statsForSelect = useMemo(() => {
        if (!select || !seasonSlice) return null;

        // 선택된 캐릭터를 포함한 레코드만 필터
        const combos = v2Type === 'main'
            ? (seasonSlice.data as ClashPlayerData[]).filter(r => r.arr.includes(select))
            : (seasonSlice.data as ClashV2PlayerData[]).filter(r => r.sideArr.includes(select));
        const totalUses = combos.length;
        const percentOfAll = totalUses / seasonSlice.data.length * 100;

        // 인덱스별 카운트 초기화
        const positionCounts: Record<number, number> = {
            0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0
        };

        // 동반 등장 카운트
        const cooccurrence: Record<string, number> = {};

        if (v2Type === 'main') {
            combos.forEach(r => {
                r.arr.forEach((name, idx) => {
                    if (name === select && r.arr.length === 9) {
                        positionCounts[idx]++;
                    } else {
                        cooccurrence[name] = (cooccurrence[name] || 0) + 1;
                    }
                });
            });
        } else if (v2Type === 'side') {
            (combos as ClashV2PlayerData[]).forEach(r => {
                r.sideArr.forEach((name, idx) => {
                    if (name === select && r.sideArr.length === 9) {
                        positionCounts[idx]++;
                    } else {
                        cooccurrence[name] = (cooccurrence[name] || 0) + 1;
                    }
                });
            });
        }

        const selectCharComp = processCompStat(seasonSlice.data, select, v2Type === 'side' ? v2Type : undefined);

        return { totalUses, percentOfAll, positionCounts, cooccurrence, selectCharComp, select };
    }, [select, seasonSlice, v2Type]);

    // 1~100/101~200/201~300 or 지정 구간 BEST COMP
    const bestComp = useMemo(() => {
        if (!data) return;
        const result: CompStat[] = [];
        if (appliedRange === initRange || (appliedRange.start === 1 && appliedRange.end === 300)) {

            if (data?.data.length === 300) {
                const oneComp = processCompStat(data?.data.slice(0, 100) as ClashPlayerData[], undefined, v2Type === 'side' ? v2Type : undefined)[0]
                const twoComp = processCompStat(data?.data.slice(101, 200) as ClashPlayerData[], undefined, v2Type === 'side' ? v2Type : undefined)[0]
                const threeComp = processCompStat(data?.data.slice(201, 300) as ClashPlayerData[], undefined, v2Type === 'side' ? v2Type : undefined)[0]

                result.push(oneComp);
                result.push(twoComp);
                result.push(threeComp);

                return result;
            } else {
                const bestComp = processCompStat(data?.data as ClashPlayerData[], undefined, v2Type === 'side' ? v2Type : undefined)[0]

                result.push(bestComp);

                return result;
            }

        } else {
            const bestComp = processCompStat(data?.data.slice(appliedRange.start - 1, appliedRange.end) as ClashPlayerData[], undefined, v2Type === 'side' ? v2Type : undefined)[0]
            result.push(bestComp)
            return result;
        }
    }, [data, appliedRange, v2Type])

    const handleV2Type = (t: 'side' | 'main') => {
        setV2Type(t);
        setSelect('');
    }

    if (isLoading) {
        return (
            <Loading />
        )
    }

    if (!seasonSlice) {
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
            {/* {data?.type === 'season' && ( */}
            <SeasonRemote />
            <div className="w-full flex justify-between h-10 mt-[-16px] border-b-2 dark:border-zinc-700 z-20 items-center sticky top-0 bg-white dark:bg-zinc-900">
                {/* 구분선 */}
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[50%] bg-zinc-500 dark:bg-zinc-700"
                />

                <div
                    className={`w-[50%] cursor-pointer transition duration-150 ${v2Type !== 'side' && 'hover:brightness-[.7]'}`}
                    onClick={() => handleV2Type('side')}>
                    <div className="relative cursor-pointer w-24 mx-auto">
                        <FuzzyComponent
                            isActive={v2Type === 'side'}
                            color='rgb(22,163,74)'
                            text="림의 이면세계"
                        />
                    </div>
                </div>
                <div
                    className={`w-[50%] cursor-pointer transition duration-150  ${v2Type !== 'main' && 'hover:brightness-[.7]'}`}
                    onClick={() => handleV2Type('main')}>
                    <div className="relative w-24 mx-auto">
                        <FuzzyComponent
                            isActive={v2Type === 'main'}
                            color='rgb(245,158,11)'
                            text="셰이디의 차원"
                        />
                    </div>
                </div>
            </div>
            <div className="lg:w-[992px] w-full mx-auto flex flex-col xs:flex-row bg-white dark:bg-zinc-900 dark:text-zinc-200 p-4 shadow-md mt-4 overflow-x-auto">
                {data && (
                    <PersonalityPieChart
                        data={seasonSlice}
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
                    data={seasonSlice}
                    setSelect={setSelect}
                    type={v2Type === 'side' ? v2Type : undefined}
                />
                <PickRateChart
                    season={season}
                    data={seasonSlice}
                    setSelect={setSelect}
                    type={v2Type === 'side' ? v2Type : undefined}
                />
                {select !== '' && (
                    <SelectCharComponent
                        statsForSelect={statsForSelect}
                    />
                )}
                <ClashV2Chart
                    data={seasonSlice}
                />
                {bestComp && bestComp?.length > 0 && (
                    <BestComp
                        data={bestComp}
                    />
                )}
                <CompListComponent
                    season={season}
                    data={seasonSlice}
                    userCnt={seasonSlice?.data?.length}
                    type={v2Type === 'side' ? v2Type : undefined}
                />
            </>
            <Footer />
        </div>
    );
}

export default ClashV2SeasonPage;