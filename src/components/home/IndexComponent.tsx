

const IndexComponent = () => {

    return (
        <div className="sm:w-[600px] w-full dark:bg-zinc-900 dark:text-zinc-200 mx-auto flex flex-col mt-4 bg-white p-4 shadow-md">
            <div className="flex gap-x-3 justify-center items-center">
                <img
                    src="/images/boss/l1ly.png"
                    className="object-contain aspect-square w-12 h-12 border border-black"
                />
                <div>
                    <div className="font-bold text-[22px]">
                        트릭컬 레코드
                    </div>
                    <div className="text-[14px]">
                        차원 대충돌, 엘리아스 프론티어 랭킹 기록을 제공합니다.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IndexComponent;