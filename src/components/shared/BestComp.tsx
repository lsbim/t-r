import CharacterIcon from "../../commons/icon/CharacterIcon";
import { lineListEn } from "../../types/trickcalTypes";
import { CompStat } from "../../utils/chartFunction";

const BestComp = ({ data }: { data: CompStat[] }) => {

    // console.log(data)

    return (
        <div className="lg:w-[992px] w-full mx-auto flex flex-col bg-white dark:bg-zinc-900 py-4 shadow-md overflow-x-auto gap-y-3">
            <span className="font-bold text-xl ml-4 dark:text-zinc-200">인기 조합</span>
            <div className="mx-auto flex md:justify-center justify-start w-full gap-x-5">
                {data.map((comp, ci) => {

                    const changes = ci > 0 ? findCharacterChanges(data[ci - 1], comp) : [];
                    const rankMsg = data?.length > 1 ? ['1~100위', '101~200위', '201~300위'] : [];
                    const isEquals = ci > 0 &&
                        JSON.stringify(data[ci - 1]?.back) === JSON.stringify(data[ci]?.back) &&
                        JSON.stringify(data[ci - 1]?.mid) === JSON.stringify(data[ci]?.mid) &&
                        JSON.stringify(data[ci - 1]?.front) === JSON.stringify(data[ci]?.front);

                    return (
                        <div key={"best_comp_" + ci}
                            className={`flex flex-col gap-y-3 text-[12px] font-bold px-4 dark:brightness-90`}>
                            <span className="text-[13px] text-gray-600 dark:text-zinc-400 font-normal">
                                {rankMsg && rankMsg[ci]}
                            </span>
                            <div className={`flex gap-x-2 ${ci > 0 && isEquals ? 'opacity-60' : ''}`}>
                                <div className="flex flex-col gap-y-2">
                                    {comp?.back.map(b => (
                                        <div key={"best_back_" + ci + b}
                                            className="w-[60px] h-[80px] relative"
                                        >
                                            <CharacterIcon
                                                name={b}
                                                type="small" />

                                            {changes && changes?.filter(cng => cng?.position === 'back').find(cng => cng?.added === b) && (
                                                <div className="absolute top-[-5px] right-[-5px]">
                                                    <CharacterIcon
                                                        name={changes?.filter(cng => cng?.position === 'back').find(cng => cng?.added === b)?.removed!}
                                                        type="micro" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-y-2">
                                    {comp?.mid.map(m => (
                                        <div key={"best_mid_" + ci + m}
                                            className="w-[60px] h-[80px] relative"
                                        >
                                            <CharacterIcon
                                                name={m}
                                                type="small" />
                                            {changes && changes?.filter(cng => cng?.position === 'mid').find(cng => cng?.added === m) && (
                                                <div className="absolute top-[-5px] right-[-5px]">
                                                    <CharacterIcon
                                                        name={changes?.filter(cng => cng?.position === 'mid').find(cng => cng?.added === m)?.removed!}
                                                        type="micro" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-y-2">
                                    {comp?.front.map(f => (
                                        <div key={"best_front_" + ci + f}
                                            className="w-[60px] h-[80px] relative"
                                        >
                                            <CharacterIcon
                                                name={f}
                                                type="small" />
                                            {changes && changes?.filter(cng => cng?.position === 'front').find(cng => cng?.added === f) && (
                                                <div className="absolute top-[-5px] right-[-5px]">
                                                    <CharacterIcon
                                                        name={changes?.filter(cng => cng?.position === 'front').find(cng => cng?.added === f)?.removed!}
                                                        type="micro" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

const findCharacterChanges = (prevComp: CompStat, currentComp: CompStat) => {
    const changes: { position: string; removed: string; added: string }[] = [];

    // 포지션 별 순회 lineListEn: BaseLineEn[] = ["back", "mid", "front"];
    lineListEn.forEach(position => {
        const prevChars = prevComp[position];
        const currentChars = currentComp[position];

        // 제거된 사도 찾기
        const removed = prevChars.filter(char => !currentChars.includes(char));

        // 추가된 사도 찾기
        const added = currentChars.filter(char => !prevChars.includes(char));


        if (removed.length > 0 && added.length > 0) {
            removed.forEach((removedChar, idx) => {
                changes.push({
                    position,
                    removed: removedChar,
                    added: added[idx] || added[0] // 같은 인덱스의 캐릭터와 매칭
                });
            });
        }
    });

    return changes;
};

export default BestComp;