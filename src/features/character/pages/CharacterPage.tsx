import { useParams } from "react-router-dom";
import Footer from "../../../layouts/Footer";
import HeaderNav from "../../../layouts/HeaderNav";
import { CharacterStatsData } from "../../../types/character/characterStatsTypes";
import CharacterAchievement from "../components/CharacterAchievement";
import CharacterProfile from "../components/CharacterProfile";
import CharacterRecentSkin from "../components/CharacterRecentSkin";
import CharacterRecentStats from "../components/CharacterRecentStats";
import { useCharacterData } from "../hooks/useCharacterData";

const CharacterPage = () => {

    const { charName } = useParams() as { charName: string };
    const { data } = useCharacterData<CharacterStatsData>(charName);

    return (
        <div className="flex flex-col items-center min-h-screen gap-y-4">
            <HeaderNav />
            <div className="lg:w-[992px] w-full mx-auto mt-4 gap-4 flex flex-col">
                <CharacterProfile
                    charName={charName}
                />
                <div className="w-full gap-4 flex flex-col lg:flex-row">
                    <div className="lg:w-[30%] w-full flex flex-col gap-y-4">
                        <CharacterAchievement
                            topSeasons={data.topSeasons}
                        />
                        <CharacterRecentSkin
                            recentSkin={data.recentSkins}
                            charName={charName}
                        />
                    </div>
                    <div className="lg:w-[69%] w-full">
                        <CharacterRecentStats
                            recentStats={data.recentStats}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CharacterPage