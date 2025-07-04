import { Personality, SynergyItem } from "../../types/trickcalTypes";

const PERSONALITY_ORDER: Personality[] = ["냉정", "우울", "활발", "광기", "순수"];

export const PersonalityListComponent = ({ data, count }: { data: SynergyItem[], count: number }) => {
    // 1) 입력받은 data를 전체 순서에 맞춰 정렬
    const flatList = PERSONALITY_ORDER
        .map(p => data.find(d => d.personality === p) || { personality: p, qty: 0 })
        .flatMap(d => Array.from({ length: d.qty }, () => d.personality));

    if (flatList.length === 0) return null;

    // console.log(data)

    return (
        <div className="flex pr-8 h-[78px] mb-2">
            <div
                className="grid grid-rows-2 grid-flow-col gap-1 justify-center items-center mb-4 h-[78px] w-[200px]"
                style={{ gridAutoColumns: "auto" }}
            >
                {flatList.map((personality, i) => (
                    <div style={{ zIndex: flatList.length - i }}
                        key={"personality_icon" + i}
                        className={`[filter:drop-shadow(0_3px_3px_rgba(0,0,0,0.3))] relative 
                    ${i % 2 === 0 ? "row-start-1 ml-[-10px]" : "row-start-2 mb-[52px]"}`}>
                        <div
                            className={`
                    w-6 h-6 bg-${personality} ml-[-12px] mb-[-12px] drop-shadow-md clip-pentagon rotate-[-12deg] 
                    [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)] `}
                        />
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center font-bold">
                {count}%
            </div>
        </div>
    );
};

export default PersonalityListComponent;
