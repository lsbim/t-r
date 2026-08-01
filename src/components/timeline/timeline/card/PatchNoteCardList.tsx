import React, { useMemo } from 'react';
import { Group } from 'react-konva';
import { PatchCategory, patchNotes } from '../../../../data/patchNotes';
import { dateToPx } from '../../../../utils/timeline/timelineFunction';
import PatchNoteCard from './PatchNoteCard';
import { PatchNoteItem, PatchNoteNode } from '../../../../types/timeline/timelineTypes';


interface PatchNoteCardListProps {
    rowY: number;
}

const PatchNoteCardList: React.FC<PatchNoteCardListProps> = ({
    rowY
}) => {

    const patchNoteNodeList: PatchNoteNode[] = useMemo(() => {
        const sorted = [...patchNotes].sort((a, b) => a.date.localeCompare(b.date));
        const lastDateByCategory: Partial<Record<PatchCategory, string>> = {};

        // 일별로 패치 객체 통합
        const groupedByDate = new Map<string, PatchNoteItem[]>();

        sorted.forEach((note) => {
            let prevDays: number | undefined;

            if (note.category) {
                const prevDate = lastDateByCategory[note.category];
                if (prevDate) {
                    prevDays = Math.round(
                        (new Date(note.date).getTime() - new Date(prevDate).getTime()) / 86400000
                    );
                }
                lastDateByCategory[note.category] = note.date;
            }

            const item: PatchNoteItem = {
                content: note.content,
                category: note.category,
                prevDays
            };

            if (!groupedByDate.has(note.date)) {
                groupedByDate.set(note.date, []);
            }
            groupedByDate.get(note.date)!.push(item);
        });

        return Array.from(groupedByDate.entries()).map(([date, items]) => ({
            type: "patchNote" as const,
            date,
            items,
        }));
    }, []);

    console.log("patchNoteNodeList: ", patchNoteNodeList)

    return (
        <Group>
            {patchNoteNodeList.map((note, index) => (
                <PatchNoteCard
                    key={`timeline_patchNote_${note.date}_${index}`}
                    note={note}
                    calX={dateToPx(note.date)}
                    rowY={rowY}
                />
            ))}
        </Group>
    );
};

export default React.memo(PatchNoteCardList);