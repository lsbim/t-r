const TopRemote = () => {

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ block: 'start' });
    };

    return (
        // PC용 리모콘
        <div className="fixed flex flex-col bottom-[60px] right-[40px] z-50 gap-y-[2px]">
            <a
                onClick={() => scrollToSection('top')}
                className="text-gray-400 dark:text-zinc-800 dark:border-zinc-800 px-2 bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.2)] w-[50px] h-[35px] cursor-pointer border-2 rounded-md flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
            </a>
        </div>
    );
}

export default TopRemote;