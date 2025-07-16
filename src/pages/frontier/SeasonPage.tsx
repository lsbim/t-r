import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ScoreAndCoinChart from "../../components/chart/ScoreAndCoinChart";
import AllPickRateChart from "../../components/chart/AllPickRateChart";
import CompListComponent from "../../components/shared/CompListComponent";
import PickRateChart from "../../components/chart/PickRateChart";
import SelectCharComponent from "../../components/shared/SelectCharComponent";
import { useSeasonData } from "../../hooks/useSeasonData";
import HeaderNav from "../../layouts/HeaderNav";
import { FrontierExternalData, FrontierPlayerData, FrontierSeasonData } from "../../types/frontierTypes";
import { processCompStat } from "../../utils/function";
import Loading from "../../commons/Loading";
import Footer from "../../layouts/Footer";
import ExternalPickRateChart from "../../components/chart/ExternalPickRateChart";
import InfoComponent from "../../components/shared/InfoComponent";
import useTitle from "../../hooks/useTitle";


const SeasonPage = () => {

    const { season } = useParams();
    const [select, setSelect] = useState('');
    // const [userCnt, setUserCnt] = useState<number>(0)
    const { data, isLoading, error } = useSeasonData<FrontierSeasonData | FrontierExternalData>(season, 'frontier')
    const seasonName = Number(season) >= 10000 ? `베타 시즌${Number(season) - 10000}` : `시즌${season}`;
    useTitle(`엘리아스 프론티어 ${seasonName} 집계`);

    // const data = frontierData[Number(season)];
    const rawRecords = data?.data as FrontierPlayerData[]; // 배열 100×9

    const statsForSelect = useMemo(() => {
        if (!select) return null;

        // 선택된 캐릭터를 포함한 레코드만 필터
        const combos = rawRecords.filter(r => r.arr.includes(select));
        const totalUses = combos.length;
        const percentOfAll = totalUses / rawRecords.length * 100;

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

        const selectCharComp = processCompStat(rawRecords, select);

        return { totalUses, percentOfAll, positionCounts, cooccurrence, selectCharComp, select };
    }, [select, rawRecords]);

    // useEffect(() => {
    //     setUserCnt(data?.data?.length || 0)
    // }, [data])

    // console.log("user count: ", userCnt)
    // console.log("loading: ", isLoading)

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center gap-4 min-h-screen">
                <HeaderNav />
                <Loading />
                <Footer />
            </div>
        )
    }

    if (!data) {
        return <Navigate to={"/"} replace /> // "/" 페이지로 이동.
    }

    // console.log("data: ", data)

    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <HeaderNav />
            <InfoComponent
                startDate={data?.startDate}
                endDate={data?.endDate}
                name={data?.name}
                grade={data?.maxLvl}
                rules={data?.power}
                raidType="frontier"
            />
            {data.type === 'external' && (
                <>
                    <AllPickRateChart
                        season={season}
                        data={data}
                    />
                    <ExternalPickRateChart
                        season={season}
                        data={data}
                    />
                    <div className="lg:w-[992px] w-full mx-auto flex h-4 bg-white p-4 shadow-md mt-1 text-[12px] lg:text-[13px] items-center justify-center">
                        해당 시즌은 상세 정보를 지원하지 않습니다.
                    </div>
                </>
            )}
            {data.type === 'season' && (
                <>
                    <AllPickRateChart
                        season={season}
                        data={data}
                        setSelect={setSelect}
                    />
                    <PickRateChart
                        season={season}
                        data={data}
                        setSelect={setSelect}
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
                        data={data!}
                    />
                    <CompListComponent
                        season={season}
                        data={data}
                        userCnt={data?.data?.length}
                    />
                </>
            )}
            <Footer />
        </div >
    );
}

export default SeasonPage;