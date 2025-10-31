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
import { ClashExternalData, clashPlayerData, ClashSeasonData } from "../../types/clashTypes";
import { CompStat, processCompStat } from "../../utils/chartFunction";
import BestComp from "../../components/shared/BestComp";
import SEO from "../../commons/component/SEO";

const initRange = { start: 0, end: 0 };

const SeasonPage = () => {

    const { season } = useParams();
    const [select, setSelect] = useState('');
    const { data, isLoading, error } = useSeasonData<ClashSeasonData | ClashExternalData>(season, 'clash');
    const [appliedRange, setAppliedRange] = useState(initRange);

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
        const combos = (seasonSlice.data as clashPlayerData[]).filter(r => r.arr.includes(select));
        const totalUses = combos.length;
        const percentOfAll = totalUses / seasonSlice.data.length * 100;

        // 인덱스별 카운트 초기화
        const positionCounts: Record<number, number> = {
            0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0
        };

        // 동반 등장 카운트
        const cooccurrence: Record<string, number> = {};

        combos.forEach(r => {
            r.arr.forEach((name, idx) => {
                if (name === select) {
                    positionCounts[idx]++;
                } else {
                    cooccurrence[name] = (cooccurrence[name] || 0) + 1;
                }
            });
        });

        const selectCharComp = processCompStat((seasonSlice.data as clashPlayerData[]), select);

        return { totalUses, percentOfAll, positionCounts, cooccurrence, selectCharComp, select };
    }, [select, seasonSlice]);

    // 1~100/101~200/201~300 or 지정 구간 BEST COMP
    const bestComp = useMemo(() => {
        if (!data || data?.type === 'external') return;
        const result: CompStat[] = [];
        if (appliedRange === initRange || (appliedRange.start === 1 && appliedRange.end === 300)) {

            if (data?.data.length === 300) {
                const oneComp = processCompStat(data?.data.slice(0, 100) as clashPlayerData[])[0]
                const twoComp = processCompStat(data?.data.slice(101, 200) as clashPlayerData[])[0]
                const threeComp = processCompStat(data?.data.slice(201, 300) as clashPlayerData[])[0]

                result.push(oneComp);
                result.push(twoComp);
                result.push(threeComp);

                return result;
            } else {
                const bestComp = processCompStat(data?.data as clashPlayerData[])[0]

                result.push(bestComp);

                return result;
            }

        } else {
            const bestComp = processCompStat(data?.data.slice(appliedRange.start - 1, appliedRange.end) as clashPlayerData[])[0]
            result.push(bestComp)
            return result;
        }
    }, [data, appliedRange])

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
                title={`차원 대충돌 시즌${season} 집계`}
                description={`차원 대충돌 시즌${season} 집계: ${data?.startDate} ~ ${data?.endDate}`}
            />
            <HeaderNav />
            {/* {data?.type === 'season' && ( */}
            <SeasonRemote />
            {/* )} */}
            <div className="lg:w-[992px] w-full mx-auto flex flex-col xs:flex-row bg-white dark:bg-zinc-900 dark:text-zinc-100 p-4 shadow-md mt-4 overflow-x-auto">
                {data && (
                    <PersonalityPieChart
                        data={seasonSlice}
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
                        season={season}
                        data={seasonSlice}
                    />
                    <ExternalPickRateChart
                        season={season}
                        data={seasonSlice}
                    />
                    <div className="lg:w-[992px] w-full mx-auto flex h-4 dark:bg-zinc-900 dark:text-zinc-100 bg-white p-4 shadow-md mt-1 text-[12px] lg:text-[13px] items-center justify-center">
                        해당 시즌은 상세 정보를 지원하지 않습니다.
                    </div>
                </>
            )}
            {seasonSlice.type === 'season' && (
                <>
                    <AllPickRateChart
                        season={season}
                        data={seasonSlice}
                        setSelect={setSelect}
                    />
                    <PickRateChart
                        season={season}
                        data={seasonSlice}
                        setSelect={setSelect}
                    />
                    {select !== '' && (
                        <SelectCharComponent
                            statsForSelect={statsForSelect}
                        />
                    )}
                    <CleartimeChart
                        season={season}
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
                    />
                </>
            )}
            <Footer />
        </div>
    );
}

export default SeasonPage;