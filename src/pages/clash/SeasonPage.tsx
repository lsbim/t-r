import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import AllPickRateChart from "../../components/chart/AllPickRateChart";
import CleartimeChart from "../../components/chart/CleartimeChart";
import CompListComponent from "../../components/shared/CompListComponent";
import PickRateChart from "../../components/chart/PickRateChart";
import SelectCharComponent from "../../components/shared/SelectCharComponent";
import { useSeasonData } from "../../hooks/useSeasonData";
import HeaderNav from "../../layouts/HeaderNav";
import { clashPlayerData, ClashSeasonData } from "../../types/clashTypes";
import { processCompStat } from "../../utils/function";
import Loading from "../../commons/Loading";
import Footer from "../../layouts/Footer";

const SeasonPage = () => {

    const { season } = useParams();
    const [select, setSelect] = useState('');
    const [userCnt, setUserCnt] = useState<number>(0)
    const { data, isLoading, error } = useSeasonData<ClashSeasonData>(season, 'clash')

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

    useEffect(() => {
        setUserCnt(data?.data?.length || 0)
    }, [data])

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


    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <HeaderNav />
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
            {select !== '' && (
                <SelectCharComponent
                    statsForSelect={statsForSelect}
                />
            )}
            <CleartimeChart
                season={season}
                data={data}
            />
            <CompListComponent
                season={season}
                data={data}
                userCnt={userCnt}
            />
            <Footer />
        </div>
    );
}

export default SeasonPage;