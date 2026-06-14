import { useMemo, useState } from "react";
import SlideColorNav from "../../commons/animation/SlideColorNav";
import RaidCard from "../../commons/card/RaidCard";
import Loading from "../../commons/component/Loading";
import SEO from "../../commons/component/SEO";
import ToggleSwitch from "../../commons/component/ToggleSwitch";
import CharacterSearchList from "../../components/character/CharacterSearchList";
import NoticeComponent from "../../components/home/NoticeComponent";
import BirthTimeline from "../../components/timeline/chara/BirthTimeline";
import { charInfo } from "../../data/trickcalChar";
import { useNonData } from "../../hooks/useNonData";
import { useRaidData } from "../../hooks/useRaidData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import { LatestData } from "../../types/latestTypes";
import { Personality, Race, races } from "../../types/trickcalTypes";

const IndexPage = () => {

    const { data } = useNonData();
    const { data: latest } = useRaidData<LatestData>('latest', 'summary');
    const [isEldain, setIsEldain] = useState<Boolean>(false)
    const [category, setCategory] = useState<'race' | 'pers'>('race')

    // console.log(latest)

    const charaMap: Map<Race | Personality, string[]> = useMemo(() => {
        return new Map(
            Object.entries(
                Object.entries(charInfo).reduce((acc, [name, info]) => {
                    const { race, personality, birthdate, eldain } = info;

                    if (name.startsWith('우로스(')) return acc;
                    if (isEldain && !eldain) return acc;

                    const key = category === 'race' ? race : personality;

                    if (key) {
                        if (!acc[key]) acc[key] = [];
                        acc[key].push({
                            name,
                            birthdate: new Date(new Date(birthdate).toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
                        });
                    }
                    return acc;
                }, {} as Record<Race | Personality, { name: string, birthdate: Date }[]>)
            ).sort(([keyA], [keyB]) => {
                if (category === 'race') {
                    const indexA = races.indexOf(keyA as Race);
                    const indexB = races.indexOf(keyB as Race);
                    if (indexA === -1) return 1;
                    if (indexB === -1) return -1;
                    return indexA - indexB;
                }

                if (keyA === '공명') return 1;
                if (keyB === '공명') return -1;
                return keyA.localeCompare(keyB);
            })
                .map(([race, chara]) => {

                    const top3Names = chara
                        .sort((a, b) => b.birthdate.getTime() - a.birthdate.getTime()) // 최신순 정렬
                        .slice(0, 3) // 내림차순(최신순) top 3
                        .map(char => char.name); // 사도 명 추출

                    // [k:종족명, v: 사도명[]]
                    return [race as Race, top3Names];
                })
        )
    }, [isEldain, category]);

    if (!data || !latest) {
        return (<Loading />);
    }

    const tabs = [
        { id: 'race', label: '종족정렬' },
        { id: 'pers', label: '성격정렬' },
    ] as const;

    return (
        <div className="flex flex-col justify-center gap-6 min-h-[100.5vh]" > {/* 스크롤을 위한 100.5vh */}
            <SEO />
            <HeaderNav />
            {/* 레이드 카드 */}
            <div className="sm:w-[600px] w-full mx-auto flex gap-x-2 mt-24">
                {Object.entries(latest).map(([key, value]) => {

                    return (
                        <div
                            key={`raid_card_${key}`}
                            className="w-[33%]">
                            <RaidCard
                                data={value}
                                raidType={key as 'clash' | 'clashV2' | 'frontier'}
                            />
                        </div>
                    )
                })}
            </div>
            {/* 사도 목록 */}
            <CharacterSearchList
            />
            {/* 사도 출시 타임라인 */}
            <div className="md:w-[768px] w-full mx-auto flex flex-col gap-y-6 bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4 rounded-xl border border-zinc-300 overflow-x-auto">
                <div className="flex mx-auto w-full">
                    <div className="flex flex-col gap-y-2 font-bold dark:text-zinc-200">
                        <div className="mb-2">
                            <p className="text-[16px]">
                                사도 출시 타임라인
                            </p>
                            <p className="text-[12px] dark:text-zinc-400 text-gray-600 font-normal">
                                카테고리별 최근 3인의 사도 출시 타임라인을 제공합니다.
                            </p>
                        </div>
                        <div
                            className="flex items-center gap-x-2">
                            <span className="pb-[2px] text-[14px]">
                                엘다인
                            </span>
                            <ToggleSwitch
                                size="sm"
                                onChange={(checked) => setIsEldain(checked)}
                            />
                        </div>
                        <SlideColorNav
                            color="text-black dark:text-zinc-200"
                            handler={(p) => setCategory(p as 'race' | 'pers')}
                            tabs={tabs}
                        />
                    </div>
                </div>
                <BirthTimeline charaMap={charaMap} />
            </div>
            {/* 공지 */}
            <NoticeComponent
                data={data}
            />
            <Footer />
        </div >
    );
}

export default IndexPage;