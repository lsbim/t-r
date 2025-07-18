import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Loading from "../../commons/Loading";
import AllPickRateChart from "../../components/chart/AllPickRateChart";
import CleartimeChart from "../../components/chart/CleartimeChart";
import ExternalPickRateChart from "../../components/chart/ExternalPickRateChart";
import PersonalityPieChart from "../../components/chart/PersonalityPieChart";
import PickRateChart from "../../components/chart/PickRateChart";
import CompListComponent from "../../components/shared/CompListComponent";
import InfoComponent from "../../components/shared/InfoComponent";
import SelectCharComponent from "../../components/shared/SelectCharComponent";
import { useSeasonData } from "../../hooks/useSeasonData";
import useTitle from "../../hooks/useTitle";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import { ClashExternalData, clashPlayerData, ClashSeasonData } from "../../types/clashTypes";
import { processCompStat } from "../../utils/chartFunction";

const SeasonPage = () => {

    const { season } = useParams();
    const [select, setSelect] = useState('');
    // const [userCnt, setUserCnt] = useState<number>(0);
    const { data, isLoading, error } = useSeasonData<ClashSeasonData | ClashExternalData>(season, 'clash');
    useTitle(`차원 대충돌 시즌${season} 집계`);

    const rawRecords = data?.data as clashPlayerData[]; // 배열 100×9

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
            <div className="lg:w-[992px] w-full mx-auto flex flex-col xs:flex-row bg-white p-4 shadow-md mt-4 overflow-x-scroll">
                {data && (
                    <PersonalityPieChart
                        data={data}
                    />
                )}
                <InfoComponent
                    startDate={data?.startDate}
                    endDate={data?.endDate}
                    name={data?.name}
                    grade={data?.maxLvl}
                    rules={data?.rules}
                    raidType="clash"
                    personality={data?.personality}
                />

            </div>
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
                    <CleartimeChart
                        season={season}
                        data={data}
                    />
                    <CompListComponent
                        season={season}
                        data={data}
                        userCnt={data?.data?.length}
                    />
                </>
            )}
            <Footer />
        </div>
    );
}

export default SeasonPage;