import { Link } from "react-router-dom";
import { LatestSummary } from "../../../types/latestTypes";
import { getPersonalityColor, getPersonalityDarkColor } from "../../../types/trickcalTypes";

const HomeRaidCard = ({ data, raidType }: {
    data: LatestSummary,
    raidType: 'clash' | 'clashV2' | 'frontier' | 'deepClash',
}) => {

    const raidNames = {
        clash: { krName: '차원 대충돌', krShortName: '대충돌' },
        clashV2: { krName: '차원 대충돌 2.0', krShortName: '대충돌 2.0' },
        frontier: { krName: '엘리아스 프론티어', krShortName: '프론티어' },
        deepClash: { krName: '심해 대격돌', krShortName: '심해 대격돌' },
    }[raidType];

    const seasonLabel = Number(data.seasonNumber) >= 10000
        ? `베타 시즌${Number(data.seasonNumber) - 10000}`
        : `시즌${data.seasonNumber}`;

    const isFrontier = raidType === 'frontier';
    const personalityColor = data.personality && !isFrontier
        ? getPersonalityColor(data.personality)
        : '#151e51';
    const personalityDarkColor = data.personality && !isFrontier
        ? getPersonalityDarkColor(data.personality)
        : '#29356b';
    const backgroundImage = data.personality
        ? `/images/boss/${data.name}(${data.personality}).webp`
        : data.name === '죽음' || data.name === '오리카'
            ? `/images/boss/${data.name}.webp`
            : `/images/boss/bg_${data.name}.webp`;

    const typeLink =
        raidType === 'deepClash'
            ? 'deep'
            : raidType.startsWith('clash')
                ? raidType.includes('V2')
                    ? 'clash/v2'
                    : 'clash/v1'
                : raidType;

    return (
        <Link
            to={`/${typeLink}/${data.seasonNumber}`}
            className="relative flex min-h-[150px] w-full overflow-hidden rounded-lg text-white shadow-sm will-change-transform"
            style={{
                background: `linear-gradient(105deg, color-mix(in srgb, ${personalityColor} 78%, #111827 22%) 0%, color-mix(in srgb, ${personalityDarkColor} 58%, #090f1d 42%) 100%)`,
            }}
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_120%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_54%)]" />
            <img
                src={backgroundImage}
                alt={data.name}
                className="pointer-events-none absolute bottom-[-18px] right-[-8px] z-[1] h-[158px] w-[75%] sm:w-[55%] object-contain object-bottom drop-shadow-xl sm:h-[184px]"
                onError={(event) => event.currentTarget.classList.add('hidden')}
            />
            <div className="relative z-10 flex w-full shrink-0 flex-col justify-center gap-y-2 p-2 sm:p-5">
                <span className="hidden text-[20px] font-bold leading-tight sm:inline">
                    {raidNames.krName}
                </span>
                <span className="inline text-[16px] font-bold leading-tight sm:hidden">
                    {raidNames.krShortName}
                </span>
                <span className="text-[11px] font-semibold sm:text-[12px]">
                    {seasonLabel} {data.name}
                </span>
                <span className="w-fit rounded-md bg-zinc-900/50 px-2.5 py-1 text-[10px] font-medium leading-snug text-zinc-200 sm:text-[11px]">
                    {data.startDate} ~ {data.endDate}
                </span>
            </div>
        </Link>
    );
}

export default HomeRaidCard;
