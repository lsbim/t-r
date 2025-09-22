type SortArrowIconProps = {
    active: boolean;
    orderBy: 'asc' | 'desc'
}

const SortArrowIcon = ({ active, orderBy }: SortArrowIconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className={`size-3 ml-1 text-gray-700 transition-all duration-200 
                ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        ${active && orderBy === 'asc' ? 'rotate-180' : 'rotate-0'}`}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
        </svg>
    );
}

export default SortArrowIcon;