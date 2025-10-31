import InfoIcon from "../../commons/icon/InfoIcon";
import PersonalityIcon from "../../commons/icon/PersonalityIcon";
import { findPersonalityByName } from "../../utils/function";

const SelectCharComponent = ({ statsForSelect }: { statsForSelect: any }) => {

    // console.log(statsForSelect)

    return (
        <div className="overflow-x-auto overflow-y-hidden">
            <div className={`mx-auto flex flex-col bg-white dark:bg-zinc-900 dark:text-zinc-100 p-2 pb-4 shadow-md ${statsForSelect ? "w-[992px] " : "max-w-[992px]"}`}>
                <div className="flex items-center">
                    <span className="text-xl font-bold mr-4">사도 정보</span>
                    {statsForSelect?.select && (
                        <div className="flex items-center">
                            <PersonalityIcon personality={findPersonalityByName(statsForSelect?.select)} />
                            <span className={`text-xl font-bold p-1`}>
                                {statsForSelect?.select || ""}
                            </span>
                        </div>
                    )}
                </div>
                {statsForSelect ? (
                    <div className="mx-auto flex mt-4 items-start w-full justify-around text-[14px]">
                        {/* 사용된 위치 */}
                        <div className="w-[20%] flex flex-col justify-center ">
                            {/* <div>
                            <span>사용한 교주: {statsForSelect?.totalUses}명</span>
                            <span className="text-gray-400 ml-2">{statsForSelect?.percentOfAll}%</span>
                        </div> */}
                            <span className="text-[16px] font-bold mb-4">사용된 위치</span>
                            <div className="flex gap-2">
                                {/* 후열 6,7,8 */}
                                <div className="flex-col gap-2 flex">
                                    <div
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content={`${(statsForSelect.positionCounts[6] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                                        style={{
                                            backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[6] / statsForSelect.totalUses})`
                                        }} />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content={`${(statsForSelect.positionCounts[7] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                                            className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                                            style={{
                                                backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[7] / statsForSelect.totalUses})`
                                            }} />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content={`${(statsForSelect.positionCounts[8] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                                            className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                                            style={{
                                                backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[8] / statsForSelect.totalUses})`
                                            }} />
                                </div>
                                {/* 중열 3,4,5 */}
                                <div className="flex-col gap-2 flex">
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content={`${(statsForSelect.positionCounts[3] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                                            className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                                            style={{
                                                backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[3] / statsForSelect.totalUses})`
                                            }} />
                                        <div 
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content={`${(statsForSelect.positionCounts[4] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                                            style={{
                                                backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[4] / statsForSelect.totalUses})`
                                            }} />
                                        <div 
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content={`${(statsForSelect.positionCounts[5] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                                            style={{
                                                backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[5] / statsForSelect.totalUses})`
                                            }} />
                                </div>
                                {/* 전열 0,1,2 */}
                                <div className="flex-col gap-2 flex">
                                        <div 
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content={`${(statsForSelect.positionCounts[0] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                                            style={{
                                                backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[0] / statsForSelect.totalUses})`
                                            }} />
                                        <div 
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content={`${(statsForSelect.positionCounts[1] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                                            style={{
                                                backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[1] / statsForSelect.totalUses})`
                                            }} />
                                        <div 
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content={`${(statsForSelect.positionCounts[2] / statsForSelect.totalUses * 100).toFixed(1)}%`}
                                        className="relative w-6 h-6 border-[1px] border-gray-800 dark:border-zinc-500"
                                            style={{
                                                backgroundColor: `rgba(200, 0, 0, ${statsForSelect.positionCounts[2] / statsForSelect.totalUses})`
                                            }} />
                                </div>
                            </div>
                        </div>
                        {/* 함께한 사도 */}
                        {statsForSelect?.cooccurrence && (
                            <div className="w-[20%] flex flex-col justify-center">
                                <div className="mb-4 flex items-center">
                                    <span className="text-[16px] font-bold mr-2">함께한 사도</span>
                                    <InfoIcon text="함께 출전한 상위 5인의 사도입니다." />
                                </div>
                                <div>
                                    {Object.entries(statsForSelect?.cooccurrence || {})
                                        .sort(([, a], [, b]) => (b as number) - (a as number)) // 값 기준 내림차순 정렬
                                        .slice(0, 5) // 상위 5개만 선택
                                        .map(([key, value], index) => (
                                            <div className="flex items-center mb-1"
                                                key={"co_occurrence" + statsForSelect?.select + index}>
                                                <PersonalityIcon personality={findPersonalityByName(key)} />
                                                <span className="ml-1 font-bold mr-1">
                                                    {key}
                                                </span>
                                                <span>
                                                    {value as number}회
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                        {/* 사용된 조합 */}
                        <div className="w-[33%] flex flex-col justify-center">
                            {/* gap-y-2(8px) + mb-2(8px)로 얘만 mb-2고, 나머지는 mb-4(16px)로 설정 */}
                            <div className="mb-2 flex items-center">
                                <span className="text-[16px] font-bold mr-2">사용된 조합</span>
                                <InfoIcon text="위치는 무작위로 설정됩니다." />
                            </div>
                            {statsForSelect.selectCharComp.slice(0, 3).map((comp: any, ci: number) => (
                                <div key={"clash" + statsForSelect?.select + "comp" + ci}
                                    className={`flex font-bold text-[12px] gap-x-2 dark:text-zinc-950 ${ci === 2 ? "mb-0" : "mb-4"}`}>

                                    <div className="min-w-[78px] w-[16%] flex flex-col gap-y-1">
                                        {comp?.back?.map((name: string, i: number) => (
                                            <div key={"clash" + statsForSelect?.select + "comp" + name + ci + i}
                                                title={name}
                                                className={`flex-1 bg-${findPersonalityByName(name)} p-1 min-w-0 flex items-center max-h-[23px] ${statsForSelect?.select === name ? "border-[1px] border-black" : ""}`}>
                                                <span className="truncate">
                                                    {name === "시온" ? "시온 더 다크불릿" : name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="min-w-[78px] w-[16%] flex flex-col gap-y-1">
                                        {comp?.mid?.map((name: string, i: number) => (
                                            <div key={"clash" + statsForSelect?.select + "comp" + name + ci + i}
                                                title={name}
                                                className={`flex-1 bg-${findPersonalityByName(name)} p-1 min-w-0 flex items-center max-h-[23px] ${statsForSelect?.select === name ? "border-[1px] border-black" : ""}`}>
                                                <span className="truncate">
                                                    {name === "시온" ? "시온 더 다크불릿" : name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="min-w-[78px] w-[16%] flex flex-col gap-y-1">
                                        {comp?.front?.map((name: string, i: number) => (
                                            <div key={"clash" + statsForSelect?.select + "comp" + name + ci + i}
                                                title={name}
                                                className={`flex-1 bg-${findPersonalityByName(name)} p-1 min-w-0 flex items-center max-h-[23px] ${statsForSelect?.select === name ? "border-[1px] border-black" : ""}`}>
                                                <span className="truncate">
                                                    {name === "시온" ? "시온 더 다크불릿" : name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={`w-[15%] flex justify-center items-center font-bold text-[13px] ml-3 dark:text-zinc-100`}>
                                        <span>
                                            {comp?.count}회
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 text-gray-600">
                        사도를 선택해 주세요.
                    </div>
                )}
            </div>
        </div >
    );
}

export default SelectCharComponent;