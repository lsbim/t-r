import PickRankChart from "../../test/PickRankChart";
import { useStatData } from "../../hooks/useStatData";
import HeaderNav from "../../layouts/HeaderNav";
import { BaseLine, lineList } from "../../types/trickcalTypes";

const StatPage = () => {

    const { data, isLoading, error } = useStatData('frontier');

    if (!data) {

        return <>
            <HeaderNav />
        </>;
    }

    console.log(data)

    return (
        <div className="flex flex-col items-center min-h-screen">
            <HeaderNav />
            {lineList.map(line => (
                <PickRankChart
                    data={data[line]}
                    raid="frontier"
                />
            ))}
        </div>
    );
}

export default StatPage;