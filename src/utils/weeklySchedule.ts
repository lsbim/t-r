import { Costume } from "../data/costumes";

interface WeekData {
    startDate: Date;
    endDate: Date;
    activityCount: number;
    costumes?: Costume[];
}

export interface MonthSchedule {
    monthName: string;
    weeks: WeekData[];
}

interface Props {
    charName: string;
    count: number;
    costumes: Costume[];
}

// 특정 연도의 활동 일자를 목-수 기준으로 주간 집계
export const generateWeeklySchedule = (year: number, persData: Props[]): MonthSchedule[] => {

    const allCostumes = persData.flatMap(char => char.costumes);

    // 1~12월 생성
    const schedule: MonthSchedule[] = Array.from({ length: 12 }, (_, i) => ({
        monthName: `${i + 1}월`,
        weeks: [],
    }));

    const today = new Date();

    if (year < 2024) {
        return [];
    }

    // 1월 1일부터 계산 시작
    let currentDate = new Date(year, 0, 1);

    // 해당 연도의 첫번째 목요일
    while (currentDate.getDay() !== 4) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // 첫 목요일부터 7일씩 더해가며 해당 연도 내의 모든 주를 순회
    while (currentDate.getFullYear() === year) {
        const weekStartDate = new Date(currentDate);
        const weekEndDate = new Date(currentDate);
        weekEndDate.setDate(currentDate.getDate() + 6); // 수요일

        // '오늘' 이후는 제외
        // if (weekStartDate > today) break;

        const weekCostumes = allCostumes.filter(costume => {
            if(!costume?.launchDate) return;
            const costumeDate = new Date(costume.launchDate);
            return costumeDate >= weekStartDate && costumeDate <= weekEndDate;
        });

        // 해당 주차에 코스튬이 있거나, 빈 주차도 표시하고 싶다면 조건을 수정
        const activityCount = weekCostumes.length;

        // 목요일이 속한 월(monthIndex)을 기준으로 데이터를 저장
        const monthIndex = weekStartDate.getMonth();

        if (schedule[monthIndex]) {
            schedule[monthIndex].weeks.push({
                startDate: weekStartDate,
                endDate: weekEndDate,
                activityCount,
                costumes: weekCostumes
            });
        }

        // 다음 주 목요일로 이동
        currentDate.setDate(currentDate.getDate() + 7);
    }

    // 오늘날 이후의 주, 월 삭제
    // const filteredSchedule = schedule.filter((month, idx) => {
    //     if (year > today.getFullYear()) return false;
    //     if (year === 2024) {
    //         return idx >= 5;
    //     }
    //     return idx <= today.getMonth();
    // });

    return schedule;
};