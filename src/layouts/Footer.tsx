import ThemeToggle from "../commons/component/ThemeToggle";
import { useTheme } from "../hooks/useTheme";

const Footer = () => {
    const { theme } = useTheme();
    const themeText = theme === 'dark' ? '라이트모드'
        : theme === 'light' && '다크모드';

    return (
        <div className="bg-gray-50 dark:bg-zinc-900 gap-y-1 dark:text-zinc-200 mt-auto h-[70px] w-full flex flex-col items-center justify-center p-2">
            <div className="flex items-center">
                <span className="text-[12px] w-[60px]">{themeText}</span>
                <ThemeToggle />
            </div>
            <small className="text-[10px] sm:text-[12px] ">
                All data is retrieved from Trickcal, a game copyrighted by EPIDGames
            </small>
        </div>
    );
}

export default Footer;