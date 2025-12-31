import React, { useMemo } from "react";
import PersonalityIcon from "../../commons/icon/PersonalityIcon";
import { type Costume } from "../../data/costumes";
import { generateWeeklySchedule } from "../../utils/weeklySchedule";

interface CharacterData {
    charName: string;
    count: number;
    latestDate: string | null;
    costumes: Costume[];
}

// Props 타입 수정
interface Props {
    selectYear: number;
    pers: string;
    charData: CharacterData[];
}

const PersCalendar: React.FC<Props> = (
    { selectYear, pers, charData }) => {

    const now = new Date();
    const limitDate = new Date("2024-06-01");

    const weeklySchedule = useMemo(() => {
        // console.log(charData)

        return generateWeeklySchedule(selectYear, charData);
    }, [selectYear, charData]);

    // console.log(weeklySchedule)

    const sumPersCostume = useMemo(() => {
        return charData.reduce((sum, data) => {
            return data.costumes.length > 0 ? sum + data.costumes.length : sum + 0;
        }, 0);
    }, [charData])


    // console.log(charData)
    console.log(weeklySchedule)

    return (
        <div className="min-w-[148px] w-[15%] bg-white dark:bg-zinc-900 dark:text-zinc-200 shadow-md p-2">
            <div className="flex gap-x-2 justify-between items-center pr-2">
                <div className="flex gap-x-2">
                    <PersonalityIcon personality={pers} size={24} />
                    <span className="font-bold md:text-[18px] text-[14px]">{pers}</span>
                </div>
                <span className="font-bold md:text-[16px] text-[13px]">{sumPersCostume}</span>
            </div>

            <div className="flex flex-col flex-wrap gap-y-2 mt-3 pb-2">
                {weeklySchedule.map(({ monthName, weeks }) => {

                    // console.log(weeks)

                    return (
                        <div key={monthName} className="flex items-center gap-2">
                            <span className={`w-7 text-[13px] font-semibold text-right transition-opacity ${weeks[0]?.startDate < limitDate || weeks[0]?.startDate > now || !weeks[0]?.startDate ? 'opacity-20' : 'opacity-100'}`}>
                                {monthName}
                            </span>
                            <div className="flex gap-1">
                                {weeks.map((week, index) => {
                                    const startDateStr = week?.startDate.toLocaleDateString('ko-KR');

                                    const isOutOfRange = week?.startDate < limitDate || week?.startDate > now || !week?.startDate;

                                    const costumeTooltipText = week?.costumes &&
                                        week?.costumes.map(cos => {
                                            if (cos.lvl === 'pretty') return `${cos.charName}: ${cos.cosName}★`;

                                            return `${cos.charName}: ${cos.cosName}`;
                                        }).join("\n");

                                    

                                    return (
                                        <div
                                            key={startDateStr + index + pers}
                                            data-tooltip-id={isOutOfRange ? "" : "my-tooltip"}
                                            data-tooltip-content={costumeTooltipText}
                                            className={`w-4 h-4 rounded-sm ${getActivityColor(week?.activityCount)}
                                        ${week.costumes?.some(item => item.lvl === 'pretty') && 'border-2 border-black dark:shadow-[0_0_4px_rgba(255,255,255,0.1)] dark:shadow-white'}
                                        ${isOutOfRange ? 'opacity-20' : 'opacity-100'}`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

function getActivityColor(count: number): string {
    if (count === 0) return 'bg-gray-200 dark:bg-zinc-700';
    if (count <= 1) return 'bg-orange-300';
    if (count <= 2) return 'bg-orange-500';
    if (count <= 3) return 'bg-orange-700';
    return 'bg-orange-800';
};

export default PersCalendar;