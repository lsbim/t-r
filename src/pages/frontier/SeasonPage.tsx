import { useCallback, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Loading from "../../commons/Loading";
import AllPickRateChart from "../../components/chart/AllPickRateChart";
import ExternalPickRateChart from "../../components/chart/ExternalPickRateChart";
import PersonalityPieChart from "../../components/chart/PersonalityPieChart";
import PickRateChart from "../../components/chart/PickRateChart";
import ScoreAndCoinChart from "../../components/chart/ScoreAndCoinChart";
import CompListComponent from "../../components/shared/CompListComponent";
import InfoComponent from "../../components/shared/InfoComponent";
import RankRangeInputComponent from "../../components/shared/RankRangeInputComponent";
import SelectCharComponent from "../../components/shared/SelectCharComponent";
import { useSeasonData } from "../../hooks/useSeasonData";
import useTitle from "../../hooks/useTitle";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import SeasonRemote from "../../layouts/SeasonRemote";
import { FrontierExternalData, FrontierPlayerData, FrontierSeasonData } from "../../types/frontierTypes";
import { processCompStat } from "../../utils/chartFunction";


const SeasonPage = () => {

    const { season } = useParams();
    const [select, setSelect] = useState('');
    // const [userCnt, setUserCnt] = useState<number>(0)

    const prevSeason = season === '1' ? '10002' : String(Number(season) - 1);
    const { data, isLoading, error } = useSeasonData<FrontierSeasonData | FrontierExternalData>(season, 'frontier');
    const { data: prevData, isLoading: prevIsLoading, error: prevError } = useSeasonData<FrontierSeasonData | FrontierExternalData>(prevSeason, 'frontier');
    const [appliedRange, setAppliedRange] = useState({ start: 0, end: 0 });
    const seasonName = Number(season) >= 10000 ? `베타 시즌${Number(season) - 10000}` : `시즌${season}`;

    useTitle(`엘리아스 프론티어 ${seasonName} 집계`);

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
    }, [appliedRange, data, prevData])

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

    // 선택한 사도의 정보
    const statsForSelect = useMemo(() => {
        if (!select || !seasonSlice) return null;

        // 선택된 캐릭터를 포함한 레코드만 필터
        const combos = (seasonSlice.data as FrontierPlayerData[]).filter(r => r.arr.includes(select));
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

        const selectCharComp = processCompStat((seasonSlice.data as FrontierPlayerData[]), select);

        return { totalUses, percentOfAll, positionCounts, cooccurrence, selectCharComp, select };
    }, [select, seasonSlice]);

    // console.log("user count: ", userCnt)
    // console.log("length: ", data?.data?.length);

    if (isLoading || prevIsLoading) {
        return (
            <div className="flex flex-col justify-center items-center gap-4 min-h-screen">
                <HeaderNav />
                <Loading />
                <Footer />
            </div>
        )
    }

    // console.log("data: ", seasonSlice, prevSlice)
    if (!seasonSlice) {
        return <Navigate to={"/"} replace />
    }

    // 베타1시즌 10001의 이전시즌과, 현재 기록이 없는 3시즌은 면제
    if (!(prevSeason === "10000" || prevSeason === "3") && !prevSlice) {
        return <Navigate to={"/"} replace />
    }


    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <HeaderNav />
            {data?.type === 'season' && (
                <SeasonRemote />
            )}
            <div className="lg:w-[992px] w-full mx-auto flex flex-col xs:flex-row bg-white p-4 shadow-md mt-4 overflow-x-auto">
                <PersonalityPieChart
                    data={seasonSlice}
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
            {seasonSlice.type === 'external' && (
                <>
                    <AllPickRateChart
                        season={season}
                        data={seasonSlice}
                    />
                    <ExternalPickRateChart
                        season={season}
                        data={seasonSlice}
                        prevData={prevSlice as FrontierExternalData | undefined}
                    />
                    <div className="lg:w-[992px] w-full mx-auto flex h-4 bg-white p-4 shadow-md mt-1 text-[12px] lg:text-[13px] items-center justify-center">
                        해당 시즌은 상세 정보를 지원하지 않습니다.
                    </div>
                </>
            )}
            {seasonSlice.type === 'season' && prevSlice && (
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
                        prevData={prevSlice}
                    />
                    {
                        select !== '' && (
                            <SelectCharComponent
                                statsForSelect={statsForSelect}
                            />
                        )
                    }
                    <ScoreAndCoinChart
                        season={season}
                        data={seasonSlice}
                    />
                    <CompListComponent
                        season={season}
                        data={seasonSlice}
                        userCnt={seasonSlice?.data?.length}
                    />
                </>
            )}
            <Footer />
        </div >
    );
}

export default SeasonPage;