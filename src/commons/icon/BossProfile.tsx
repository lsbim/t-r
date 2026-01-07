import { Personality } from "../../types/trickcalTypes";

interface BossProfileProps {
    personality?: Personality;
    name: string;
    background?: boolean;
}

const BossProfile: React.FC<BossProfileProps> = ({
    personality,
    name,
    background = true
}) => {

    const bossImgUrl = personality ? `/images/boss/${name}(${personality}).webp`
        : `/images/boss/${name}.webp`

    const customTranslateY = personality ? '-translate-y-[25%]'
        : name === '크레용사용' ? '-translate-y-[40%]'
            : '-translate-y-[30%]';


    return (
        <div className="relative ml-8 flex justify-end w-[218px] aspect-[218/30] [mask-image:linear-gradient(to_left,rgba(0,0,0,1)_30%,transparent_75%)] h-[30px] overflow-hidden">
            <img
                src={bossImgUrl}
                alt={name}
                className={`h-[80px] object-cover object-top ${customTranslateY} z-10`}
            />
            {personality && background && (
                <img
                    src={`/images/boss/bg_${personality}.webp`}
                    alt={personality}
                    className={`absolute top-0 right-0 h-[80px] object-cover object-top -translate-y-[30%] -z-10`}
                />
            )}
        </div>
    );
}

export default BossProfile;