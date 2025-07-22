import { useState } from "react";

const RankRangeInputComponent = ({ handleCustomRank }: { handleCustomRank: (start: string, end: string) => void; }) => {

    const [startRank, setStartRank] = useState("");
    const [endRank, setEndRank] = useState("");

    // console.log(startRank, endRank)

    return (
        <div className="flex-col flex justify-end ml-auto">
            <div className="text-[12px] text-orange-500 font-bold mb-2">
                순위 지정
            </div>
            <div className="text-[13px] flex h-[25px] justify-items-center">
                <input
                    type="number"
                    placeholder="시작"
                    value={startRank}
                    onChange={e => {
                        const v = e.target.value;
                        if (v === "") {
                            setStartRank("");
                            return;
                        }
                        const n = Number(v);
                        if (n < 1 || n > 300) return;
                        setStartRank(v);
                    }}
                    min={1}
                    max={300}
                    className="border-2 border-gray-400 p-1 w-[40px] flex justify-items-center rounded-md"
                />
                <span className="mx-1 flex items-center">
                    ~
                </span>
                <input
                    type="number"
                    placeholder="끝"
                    value={endRank}
                    onChange={e => {
                        const v = e.target.value;
                        if (v === "") {
                            setEndRank("");
                            return;
                        }
                        const n = Number(v);
                        if (n < 1 || n > 300) return;
                        setEndRank(v);
                    }}
                    min={1}
                    max={300}
                    className="border-2 border-gray-400 p-1 w-[40px] flex justify-items-center rounded-md"
                />
                <div
                    onClick={() => handleCustomRank(startRank, endRank)}
                    className="text-white bg-orange-400 w-[50px] h-[25px] hover:bg-orange-500 cursor-pointer transition-colors flex justify-center items-center rounded-sm ml-2">
                    적용
                </div>
            </div>
        </div>
    );
}

export default RankRangeInputComponent;