import { useParams } from "react-router-dom";
import Loading from "../../commons/component/Loading";
import SEO from "../../commons/component/SEO";
import CharacterAchievement from "../../components/character/CharacterAchievement";
import CharacterProfile from "../../components/character/CharacterProfile";
import { useCharacterData } from "../../hooks/useCharacterData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import { CharacterStatsData } from "../../types/character/characterStatsTypes";
import CharacterRecentStats from "../../components/character/CharacterRecentStats";

const CharacterPage = () => {

    const { charName } = useParams();
    const { data } = useCharacterData<CharacterStatsData>(charName ?? '');

    if (!charName || !data) {
        return <Loading />
    }

    console.log(data)

    return (
        <div className="flex flex-col items-center min-h-screen gap-y-4">
            <SEO
                title={`${charName} - 사도 정보 요약`}
                description={`${charName}의 컨텐츠 기록을 요약하여 제공합니다.`}
            />
            <HeaderNav />
            <div className="lg:w-[992px] w-full mx-auto mt-4 gap-4 flex flex-col">
                <CharacterProfile
                    charName={charName}
                />
                <div className="w-full gap-4 flex flex-col md:flex-row">
                    <CharacterAchievement
                        topSeasons={data.topSeasons}
                    />
                    <CharacterRecentStats 
                        recentStats={data.recentStats}
                    />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CharacterPage