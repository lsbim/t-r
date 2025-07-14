const Loading = () => {
    return (
        <>
            <div className="animate-pulse lg:w-[992px] w-full mx-auto flex flex-col h-[180px] bg-white p-4 shadow-md mt-4 overflow-x-scroll overflow-y-hidden">
            </div>
            <div className="animate-pulse lg:w-[992px] w-full mx-auto flex flex-col h-[400px] bg-white p-4 shadow-md overflow-x-scroll overflow-y-hidden">
            </div>

            <div className="flex overflow-x-scroll">
                <div className="w-[1024px] flex mx-auto justify-center">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={'loading' + index} className={`animate-pulse shadow-md p-2 w-[320px] h-[400px] bg-white ${index === 2 ? 'mr-0' : 'mr-4'}`}>

                        </div>
                    ))}
                </div>
            </div>
        </>

    );
}

export default Loading;