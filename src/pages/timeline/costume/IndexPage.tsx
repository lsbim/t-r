import { useMemo, useState } from "react";
import CostumeBoard from "../../../components/timeline/costume/CostumeBoard";
import MostAndLeast from "../../../components/timeline/costume/MostAndLeast";
import PersCalendar from "../../../components/timeline/costume/PersCalendar";
import { Costume, costumes } from "../../../data/costumes";
import { charInfo } from "../../../data/trickcalChar";
import Footer from "../../../layouts/Footer";
import HeaderNav from "../../../layouts/HeaderNav";
import TopRemote from "../../../layouts/TopRemote";
import { personalityList } from "../../../types/trickcalTypes";

const persList = personalityList;

export interface CostumeMapItem {
    charName: string;
    count: number;
    latestDate: string | null;
    since: number;
    costumes: Costume[];
}

const IndexPage = () => {

    const [selectYear, setSelectYear] = useState<number>(2025);

    // 최초 사복 출시 후 오늘날까지 연도 목록
    const costumeReleaseYearSet = useMemo(() => {
        const s = new Set<number>();

        for (const c of costumes) s.add(+c.launchDate.slice(0, 4));
        return [...s].sort((a, b) => a - b);
    }, [])

    // 맵으로 가공한 사복 리스트
    const costumeMap = useMemo(() => {
        const costumeMap = new Map();

        const characterStatsObj = Object.entries(charInfo)
            .filter(([charName, info]) => info.grade !== 1)
            .reduce(
                (
                    acc: Record<string, CostumeMapItem>
                    , [charName, info]) => {

                    if (!acc[charName]) {
                        acc[charName] = {
                            charName,
                            count: 0,
                            since: 0,
                            costumes: [],
                            latestDate: null
                        };
                    }

                    const charCostumes = costumes.filter(item => item.charName === charName);

                    acc[charName].costumes.push(...charCostumes);

                    acc[charName].count = charCostumes.length;

                    // 사도별 마지막 사복 출시일
                    if (charCostumes.length > 0) {
                        const costumeDate = charCostumes.reduce((latest, current) =>
                            current.launchDate > latest ? current.launchDate : latest,
                            charCostumes[0].launchDate
                        );

                        if (!acc[charName].latestDate || costumeDate > acc[charName].latestDate) {
                            acc[charName].latestDate = costumeDate;
                        }
                    } else {
                        acc[charName].latestDate = '2023-09-27'
                    }


                    acc[charName].since = acc[charName].latestDate
                        ? getDaysSince(acc[charName].latestDate)
                        : getDaysSince('2023-09-27');

                    return acc;

                }, {});

        const characterStatList = Object.values(characterStatsObj);

        costumeMap.set('charStatList', characterStatList);

        // 사복 보유 개수 정렬
        const sortedByCount = [...characterStatList].sort((a, b) => b.count - a.count);

        const maxCount = sortedByCount[0].count;
        const minCount = sortedByCount[sortedByCount.length - 1].count;

        const mostCostumes = sortedByCount.filter(char => char.count === maxCount);
        const leastCostumes = sortedByCount.filter(char => char.count === minCount);

        costumeMap.set('mostCostumes', mostCostumes);
        costumeMap.set('leastCostumes', leastCostumes);

        // 성격 별로 나누기
        persList.forEach(p => {

            const persCostume = characterStatList.filter(item => charInfo[item.charName]?.personality === p)

            costumeMap.set(p, persCostume);
        });

        // 출시된지 가장 오래된 코스튬(사도)들
        const oldestCostumes = (() => {
            // 사복 1개 이상
            const charWithCostumes = characterStatList.filter(char => char.count > 0);

            // 마지막 사복 출시일 수집
            const allDates = charWithCostumes.map(char => char.latestDate!);

            // Set으로 중복 제거 후 다시 배열로 변환
            const uniqueDates = [... new Set(allDates)];

            const sortedUniqueDates = uniqueDates.sort((a, b) => a.localeCompare(b));

            const oldestFiveDates = sortedUniqueDates.slice(0, 5);

            const result = oldestFiveDates.map(date => {
                // 날짜가 같은 사도들 + 사복 개수 내림차순
                const oldestChars = charWithCostumes.filter(c => c.latestDate === date).sort((a, b) => b.count - a.count);

                return {
                    date,
                    oldestChars,
                    since: getDaysSince(date)
                }
            })

            return result;
        })();

        costumeMap.set('oldestCostumes', oldestCostumes)

        return costumeMap;
    }, []);

    console.log(costumeMap)

    const selectYearElement = () => {
        return (
            <div className="w-[6%] min-h-full bg-white flex flex-col ml-auto shadow-md items-center pt-2">
                {costumeReleaseYearSet.map(y => (
                    <div
                        onClick={() => {
                            if (y !== selectYear) setSelectYear(y)
                        }}
                        className={`${y === selectYear ? 'font-bold' : 'text-gray-400 text-[14px]'} cursor-pointer select-none transition-all duration-200 h-[24px]`}
                        key={"timeline_costume_selectYear" + y}>
                        {y}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <TopRemote />
            <HeaderNav />
            {/* 소개 */}
            <div className="lg:w-[992px] w-full mx-auto flex flex-col bg-white p-4 shadow-md mt-4 overflow-x-auto">
                <div className="flex flex-col justify-start mb-3">
                    <h1 className="text-[20px] font-bold mr-2">사복</h1>
                    <span className="flex text-[14px]">다음 대상의 사복 집계 자료를 제공합니다.</span>
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
            {/* 타임라인 */}
            <div className="w-[992px] lg:flex hidden mx-auto gap-x-2">
                {persList.map(p => {

                    const costumes = costumeMap.get(p)

                    return (
                        <PersCalendar
                            key={'timeline_costume' + p}
                            charData={costumes}
                            pers={p}
                            selectYear={selectYear}
                        />
                    )
                })}
                {selectYearElement()}
            </div>
            <MostAndLeast
                most={costumeMap.get("mostCostumes")}
                least={costumeMap.get("leastCostumes")}
            />
            <CostumeBoard
                charStatList={costumeMap.get("charStatList")}
            />
            <Footer />
        </div>
    );
}

export function getDaysSince(dateString: string) {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

export default IndexPage;