import { charInfo } from "../../../data/trickcalChar";

type Props = {
    allDates: string[];
    getYOffset: (iso: string) => number;
};

const CharacterLine = ({ getYOffset, allDates }: Props) => {

    const charsByDate = allDates.reduce<Record<string, string[]>>((acc, iso) => {
        acc[iso] = [];
        return acc;
    }, {});

    Object.entries(charInfo).forEach(([name, info]) => {
        // 성격별로 찢어놓은 우로스는 제외
        if (name.startsWith('우로스(')) return;

        const date = info.birthdate;
        if (charsByDate[date]) {
            charsByDate[date].push(name);
        }
    });

    return (
        <>
            {allDates.map(isoDate => {
                const names = charsByDate[isoDate] || [];
                if (!names.length || isoDate === "2023-09-27") return null;

                // 2) y 오프셋 한 번만 계산
                const baseY = getYOffset(isoDate);

                return names.map((name, idx) => {
                    const lineHeight = 22;  // 한 줄 높이(px)
                    const y = baseY + idx * lineHeight;

                    return (
                        <div
                            key={`${isoDate}-${name}`}
                            className={`absolute left-[50%] flex items-center whitespace-nowrap w-1/2 sm:w-auto `}
                            style={{ top: y }}
                        >
                            <div className={`h-[3px] ${charInfo[name].personality === '공명' ? 'resonance-bar' : `bg-${charInfo[name].personality}`} z-10 w-full sm:w-[200px]`} />
                            <div
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content={isoDate}
                                style={{ height: lineHeight }}
                                className={`rounded-bl-xl rounded-tr-xl text-[11px] sm:text-[13px] py-[1px] px-[10px] cursor-pointer
                                ${charInfo[name].personality === '공명' ? 'bg-gradient-to-r from-[rgb(131,185,235)] to-[rgb(198,131,236)]' : `bg-${charInfo[name].personality}`}`}>
                                <span className=" font-bold mr-1">
                                    {name}
                                </span>
                                출시
                            </div>
                        </div>
                    );
                });
            })}
        </>
    );
}

export default CharacterLine;