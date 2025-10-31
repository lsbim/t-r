import * as Accordion from '@radix-ui/react-accordion';


interface Item {
    id: string
    header: React.ReactNode
    content: React.ReactNode
}

interface MyAccordionProps {
    items: Item[]
}

const MyAccordion: React.FC<MyAccordionProps> = ({ items }) => {
    return (
        <Accordion.Root
            type="multiple" // or single
            // defaultValue={items[0]?.id}
            className="w-full rounded-lg shadow-md"
        >
            {items.map(({ id, header, content }, index) => (
                <Accordion.Item
                    key={id}
                    value={id}
                    className={`${index === items.length - 1 || 'mb-[2px]'}`}
                >
                    <Accordion.Header className="flex">
                        <Accordion.Trigger className='group' asChild>
                            {/* asChild 사용 시, 이 div에 all props 전달 */}
                            <div className="w-full flex justify-between items-center p-4 cursor-pointer dark:bg-zinc-900 dark:hover:bg-zinc-950 dark:data-[state=open]:bg-zinc-950 hover:bg-amber-50 bg-white data-[state=open]:bg-amber-50">
                                <span className="text-[15px] font-medium">{header}</span>
                                {/* 아래 홑화살괄호 */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="
            w-6 h-6
            transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)]
            group-data-[state=open]:rotate-180
          "
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </div>
                        </Accordion.Trigger>
                    </Accordion.Header>

                    <Accordion.Content className=" dark:bg-zinc-900 bg-white overflow-hidden text-[14px] text-mauve11 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                        {content}
                    </Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}

export default MyAccordion;