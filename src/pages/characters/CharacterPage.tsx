import { Navigate, useParams } from "react-router-dom";
import InfoComponent from "../../components/chart/characters/InfoComponent";
import PickRateChart from "../../components/chart/characters/PickRateChart";
import { CharacterPickRateData, CharacterPickRateObj, CharacterPickRateObjMulti, useCharData } from "../../hooks/useCharData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import Loading from "../../commons/component/Loading";
import PersonalityIcon from "../../commons/icon/PersonalityIcon";

const CharacterPage = () => {

    const { character } = useParams();
    const { data, isLoading, error } = useCharData<CharacterPickRateObj | CharacterPickRateObjMulti>(character);


    if (!character || isLoading) return (<Loading />)

    const isSingle = (d: CharacterPickRateObj | CharacterPickRateObjMulti):
        d is CharacterPickRateObj => 'clash' in d && 'frontier' in d;

    console.log(data)
    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <HeaderNav />
            <div className="lg:w-[992px] w-full mx-auto flex flex-col xs:flex-row bg-white p-4 shadow-md mt-4 overflow-x-auto">
                <InfoComponent
                    name={character}
                />
            </div>
            {data && isSingle(data) ? (
                <>
                    <PickRateChart
                        data={(data?.clash as unknown) as CharacterPickRateData[]}
                        raid="clash"
                    />
                    <PickRateChart
                        data={(data?.frontier as unknown) as CharacterPickRateData[]}
                        raid="frontier"
                    />
                </>
            ) : Object.entries(data!).map(([pers, data]) => {

                return (
                    <div>
                        <div className="lg:w-[992px] w-full mx-auto flex gap-x-1 bg-white p-4 shadow-md overflow-x-auto overflow-y-hidden">
                            <PersonalityIcon personality={pers} />
                            <span className="font-bold">
                                {character}({pers})
                            </span>
                        </div>
                        <>
                            <PickRateChart
                                data={(data?.clash as unknown) as CharacterPickRateData[]}
                                raid="clash"
                            />
                            <PickRateChart
                                data={(data?.frontier as unknown) as CharacterPickRateData[]}
                                raid="frontier"
                            />
                        </>
                    </div>
                )
            })}
            <Footer />
        </div>
    );
}

export default CharacterPage;