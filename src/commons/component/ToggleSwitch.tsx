import { useState } from "react";

interface ToggleSwitchProps {
    defaultChecked?: boolean; // 토클 초기 상태
    onChange?: (checked: boolean) => void;
    disabled?: boolean; // 토글이 비활성화 돼야 하는지 여부
    activeColor?: string;
    size?: 'sm' | 'md' | 'lg';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    defaultChecked = false,
    onChange,
    disabled = false,
    activeColor = 'bg-orange-500',
    size = 'md'
}) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    const handleToggle = () => {
        if (disabled) return;

        const newValue = !isChecked;
        setIsChecked(newValue);

        // 부모 컴포넌트에 상태 변경 알림
        if (onChange) {
            onChange(newValue);
        }
    };

    // 크기에 따른 스타일
    const sizeStyles = {
        sm: {
            container: 'w-10 h-5',
            circle: 'w-4 h-4',
            translate: 'translate-x-5'
        },
        md: {
            container: 'w-14 h-7',
            circle: 'w-6 h-6',
            translate: 'translate-x-7'
        },
        lg: {
            container: 'w-16 h-8',
            circle: 'w-7 h-7',
            translate: 'translate-x-8'
        }
    };

    const currentSize = sizeStyles[size];

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            onClick={handleToggle}
            disabled={disabled}
            className={`
                ${currentSize.container} 
                relative inline-flex items-center rounded-full
                transition-colors duration-300 ease-in-out
                focus:outline-none
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isChecked ? activeColor : 'bg-gray-300 dark:bg-zinc-600'}
            `}
        >
            {/* 원형 버튼 */}
            <span
                className={`
                    ${currentSize.circle}
                    inline-block rounded-full bg-white shadow-md
                    transform transition-transform duration-300 ease-in-out
                    ${isChecked ? currentSize.translate : 'translate-x-0.5'}
                `}
            />
        </button>
    );
};

export default ToggleSwitch;