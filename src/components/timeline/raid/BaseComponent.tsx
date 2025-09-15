import { charInfo } from "../../../data/trickcalChar";

type Props = {
    allDates: string[];
    getYOffset: (iso: string) => number;
    BASE_DATE_HEIGHT: number;
};

const BaseComponent = ({ allDates, getYOffset, BASE_DATE_HEIGHT }: Props) => {
    return (
        <>
            {/* 중앙 세로선 */}
            <div className="absolute left-1/2 w-[2px] bg-black h-full z-50" />

            {/* 날짜 라벨 + 가로선 */}
            {allDates.map(iso => {
                const y = getYOffset(iso);
                return (
                    <div
                        key={iso}
                        className="absolute left-1/2 -ml-[35px] flex items-center w-[70px] z-50 select-none"
                        style={{ top: y, height: Number(BASE_DATE_HEIGHT) }}
                    >

                        <div
                            className="whitespace-nowrap text-[12px] bg-black text-white px-1 w-full h-full">
                            {iso}
                        </div>
                    </div>
                );
            })}
        </>

    );
}

export default BaseComponent;