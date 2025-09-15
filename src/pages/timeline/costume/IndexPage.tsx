import { useMemo } from "react";
import Footer from "../../../layouts/Footer";
import HeaderNav from "../../../layouts/HeaderNav";
import TopRemote from "../../../layouts/TopRemote";
import { PersonalityList } from "../../../types/trickcalTypes";
import { costumes } from "../../../data/costumes";
import { charInfo } from "../../../data/trickcalChar";

const IndexPage = () => {

    const processCostumeMap = useMemo(() => {
        const persList = PersonalityList
        const costumeMap = new Map();
        const sorted = costumes.sort((a, b) => a.launchDate.localeCompare(b.launchDate));
        const sorted2 = costumes.filter(a => a.launchDate < "2025-06-24");

        console.log(sorted.length)

        persList.forEach(p => {

            const persCostume = sorted.filter(item => charInfo[item?.charName]?.personality === p)

            costumeMap.set(p, persCostume);
        })

        return costumeMap;
    }, []);

    console.log(processCostumeMap)

    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <TopRemote />
            <HeaderNav />
            {/* 소개 */}
            <div className="lg:w-[992px] w-full mx-auto flex flex-col bg-white p-4 shadow-md mt-4 overflow-x-auto">
                <div className="flex flex-col justify-start mb-3">
                    <h1 className="text-[20px] font-bold mr-2">사복 타임라인</h1>
                    <span className="flex text-[14px]">다음 대상의 사복 출시 타임라인을 제공합니다.</span>
                </div>
                <div className="flex gap-x-4 items-center mb-2">
                    <div className="flex-col flex">
                        <span className="text-[12px] text-orange-500 font-bold">
                            3성 사도
                        </span>
                        <span className="text-[12px] text-orange-500 font-bold">
                            2성 사도
                        </span>
                    </div>
                </div>
                <span className="flex text-[12px]">1성 사도는 제외됩니다.</span>
            </div>

            <Footer />
        </div>
    );
}

export default IndexPage;