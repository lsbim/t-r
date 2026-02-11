import * as Accordion from '@radix-ui/react-accordion';


interface CostumeItem {
    charName: string;
    cosName: string;
    lvl: string;
    launchDate: string;
}

interface Props {
    items: CostumeItem[];
}

const CostumeAccordion = ({ items }: Props) => {
    const VISIBLE_COUNT = 4; // 출력 최대 갯수
    const visibleItems = items.slice(0, VISIBLE_COUNT);
    const hiddenItems = items.slice(VISIBLE_COUNT);
    const hasMore = items.length > VISIBLE_COUNT;

    const getLvlStyle = (lvl: string) =>
        lvl === 'pretty' ? 'text-orange-500 font-bold' : 'text-gray-700 dark:text-zinc-200';

    // 사복 목록(리스트)
    const renderItem = (item: CostumeItem, index: number) => (
        <div
            key={`${item.cosName}_${index}`}
            className="flex justify-between items-center text-[13px]">
            <div className="flex flex-col truncate pr-2">
                <span className={`truncate ${getLvlStyle(item.lvl)}`}>
                    {item.cosName}
                </span>
            </div>
            <span className="text-gray-500 dark:text-zinc-400 text-[11px] whitespace-nowrap">
                {item.launchDate}
            </span>
        </div>
    );

    return (
        <div className="relative w-full">
            <div className="flex flex-col">
                {visibleItems.map(renderItem)}
            </div>

            {hasMore && (
                <Accordion.Root type="single" collapsible className="w-full">
                    <Accordion.Item value="more-items" className="border-none">

                        <Accordion.Trigger className="group relative w-full h-6 -mt-5 outline-none cursor-pointer z-10">
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-zinc-900 dark:via-zinc-900/90 flex justify-center items-end">
                                <div className="flex items-center text-orange-500 dark:text-orange-400 shadow-sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-5 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                            </div>
                        </Accordion.Trigger>

                        {/* 더보기 */}
                        <Accordion.Content
                            className="absolute left-0 right-0 top-full z-50 bg-white dark:bg-zinc-900 
                shadow-xl rounded-b-lg border border-t-0 border-gray-200 dark:border-zinc-700 overflow-hidden
                data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                            <div className="flex flex-col p-1 dark:bg-zinc-900 dark:text-zinc-200">
                                {hiddenItems.map((item, idx) => renderItem(item, idx + VISIBLE_COUNT))}
                            </div>
                        </Accordion.Content>

                    </Accordion.Item>
                </Accordion.Root>
            )}
        </div>
    );
};

export default CostumeAccordion;