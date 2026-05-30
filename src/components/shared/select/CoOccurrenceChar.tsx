import React from 'react';
import InfoIcon from '../../../commons/icon/InfoIcon';
import { findPersonalityByName } from '../../../utils/function';

const CoOccurrenceChar = ({ statsForSelect }: { statsForSelect: any }) => {

    // 내림차순
    const sorted = Object.entries(statsForSelect?.cooccurrence || {})
        .sort(([, a], [, b]) => (b as number) - (a as number));

    // 픽 수 key에 저장
    const uniqueValues = [...new Set(sorted.map(([, v]) => v as number))];

    const RANK_COLORS: Record<number, string> = {
        0: 'bg-[rgba(254,201,39,0.1)] border-[rgba(254,201,39,0.6)]',
        1: 'bg-[rgba(214,234,242,0.3)] border-slate-300',
        2: 'bg-[rgba(193,175,129,0.2)] border-[rgba(193,175,129,0.6)]',
    };

    const getBgColor = (value: number): string => {
        const rank = uniqueValues.indexOf(value); // 중복 순위 포함 1,2,3위 배경색 지정
        return RANK_COLORS[rank] ?? 'bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700';
    };

    return (
        <div className="w-full h-[200px] p-3 pb-1 flex flex-col gap-y-3 bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-xl border border-zinc-300">
            <div className="flex">
                <span className="text-[16px] font-bold mr-2">함께한 사도</span>
                <InfoIcon text="함께 출전한 사도 목록입니다." />
            </div>
            {/* 스크롤이 무조건 있기 때문에 최상위 태그와 pb-2 나눠먹기 */}
            <div className="w-full overflow-x-auto pb-2 flex-1">
                <div className="inline-flex gap-x-2">
                    {sorted.map(([key, value], index) => (
                        <div className={`border flex flex-col items-center justify-center rounded-lg w-[90px] h-[120px] p-2 gap-y-1 ${getBgColor(value as number)}`}
                            key={"co_occurrence" + statsForSelect?.select + index}>
                            <div className={`overflow-hidden rounded-full w-14 h-14 border-4 border-${findPersonalityByName(key)}-dark`}>
                                <img
                                    src={`/images/profile/${key.startsWith('우로스(') ? '우로스' : key}.webp`}
                                />
                            </div>
                            <span className="font-bold truncate w-full text-center text-[13px]">
                                {key}
                            </span>
                            <span className="text-[15px]">
                                {value as number}회
                            </span>
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    )
}

export default React.memo(CoOccurrenceChar)