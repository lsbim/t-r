
const Footer = () => {

    const first = 'rnqjatnqja'
    const mail = `${first}@gmail.com`

    return (
        <footer className="bg-white border-t border-zinc-300 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700 mt-auto h-[70px] w-full flex flex-col items-center justify-center p-2 text-[10px] sm:text-[12px] gap-y-2">
            <span>
                All data is retrieved from Trickcal, a game copyrighted by EPIDGames
            </span>
            <span>
                버그 및 데이터 오류 제보: {mail}
            </span>
        </footer>
    );
}

export default Footer;