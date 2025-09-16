import React, { useMemo } from "react";
import PersonalityIcon from "../../../commons/PersonalityIcon";
import { generateWeeklySchedule } from "../../../utils/weeklySchedule";
import type { Costume } from "../../../data/costumes";

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

    const weeklySchedule = useMemo(() => {
        // console.log(charData)

        return generateWeeklySchedule(selectYear, charData);
    }, [selectYear, charData]);

    // console.log(weeklySchedule)

    const getActivityColor = (count: number): string => {
        if (count === 0) return 'bg-gray-200';
        if (count <= 1) return 'bg-orange-200';
        if (count <= 2) return 'bg-orange-400';
        if (count <= 3) return 'bg-orange-600';
        return 'bg-orange-800';
    };


    return (
        <div className="w-[18%] bg-white shadow-md p-2">
            <div className="flex gap-x-2">
                <PersonalityIcon personality={pers} size={24} />
                <span className="font-bold md:text-[18px] text-[14px]">{pers}</span>
            </div>

            <div className="flex flex-col flex-wrap gap-y-2 mt-3 pb-2">
                {weeklySchedule.map(({ monthName, weeks }) => (
                    <div key={monthName} className="flex items-center gap-2">
                        <span className="w-10 text-sm font-semibold text-right">{monthName}</span>
                        <div className="flex gap-1">
                            {weeks.map((week, index) => {
                                const startDateStr = week.startDate.toLocaleDateString('ko-KR');

                                const costumeTooltipText = week?.costumes &&
                                    week?.costumes.map(cos => {
                                        if (cos.lvl === 'pretty') return `${cos.charName}: ${cos.cosName}★`;

                                        return `${cos.charName}: ${cos.cosName}`;
                                    }).join("\n");

                                return (
                                    <div
                                        key={startDateStr + index + pers}
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content={costumeTooltipText}
                                        className={`w-4 h-4 rounded-sm ${getActivityColor(week.activityCount)}
                                        ${week.costumes?.some(item => item.lvl === 'pretty') && 'border-2 border-black'}`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PersCalendar;