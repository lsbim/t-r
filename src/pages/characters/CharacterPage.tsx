import { Navigate, useParams } from "react-router-dom";
import InfoComponent from "../../components/chart/characters/InfoComponent";
import PickRateChart from "../../components/chart/characters/PickRateChart";
import { CharacterPickRateData, CharacterPickRateObj, useCharData } from "../../hooks/useCharData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";

const CharacterPage = () => {

    const { character } = useParams();
    const { data, isLoading, error } = useCharData<CharacterPickRateObj>(character);

    // console.log(data)

    if (!character || isLoading) return (<></>)

    if (!data) {
        return <Navigate to={"/"} replace /> // "/" 페이지로 이동.
    }

    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <HeaderNav />
            <div className="lg:w-[992px] w-full mx-auto flex flex-col xs:flex-row bg-white p-4 shadow-md mt-4 overflow-x-scroll">
                <InfoComponent
                    name={character}
                />
            </div>
            <PickRateChart
                data={(data.clash as unknown) as CharacterPickRateData[]}
                raid="clash"
            />
            <PickRateChart
                data={(data.frontier as unknown) as CharacterPickRateData[]}
                raid="frontier"
            />
            <Footer />
        </div>
    );
}

export default CharacterPage;