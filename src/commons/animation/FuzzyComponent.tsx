import { useTheme } from '../../hooks/useTheme';
import FuzzyText from './FuzzyText';

interface FuzzyComponentProps {
    isActive: boolean;
    color: string;
    text: string;
}

const FuzzyComponent: React.FC<FuzzyComponentProps> = ({
    isActive = true,
    color = 'rgb(0,0,0)',
    text
}) => {
    const { theme } = useTheme();
    const textSize = 16;
    const repeatCount = 20; // 그림자 몇개 겹칠건지

    // 색상으로 그림자 20회 반복
    const shadow = Array(repeatCount)
        .fill(`0px 0px 1.2px ${color}`)
        .join(', ');


    return (
        <div className="relative flex items-center justify-center w-fit transition-colors">
            {isActive && (
                <div className="absolute z-0 flex items-center justify-center pointer-events-none select-none opacity-70">
                    <FuzzyText
                        fontSize={textSize + 3}
                        color={color}
                    >
                        {text}
                    </FuzzyText>
                </div>
            )}

            <span
                className="relative z-10 font-black text-zinc-100  ml-[-4px] select-none"
                style={{
                    fontSize: textSize,
                    textShadow: isActive ? shadow : '',
                    color: isActive ? '' : color
                }}
            >
                {text}
            </span>

        </div>
    );
};

export default FuzzyComponent;