import { useParams } from "react-router-dom";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import SEO from "../../commons/component/SEO";
import { useCharacterData } from "../../hooks/useCharacterData";
import { CharacterStatsData } from "../../types/character/characterStatsTypes";

const CharacterPage = () => {

    const { charName } = useParams();
    const { data } = useCharacterData<CharacterStatsData>(charName ?? '');

    console.log(data)

    return (
        <div className="flex flex-col items-center min-h-screen">
            <SEO
                title={`${charName} - 사도 정보 요약`}
                description={`${charName}의 컨텐츠 기록을 요약하여 제공합니다.`}
            />
            <HeaderNav />
            <div>
                <span>
                    {charName}
                </span>
            </div>
            <div className="rounded-xl border border-zinc-300 lg:w-[992px] w-full mx-auto flex flex-col xs:flex-row bg-white dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700 p-4 mt-4 overflow-x-auto">
            </div>
            <Footer />
        </div>
    )
}

export default CharacterPage