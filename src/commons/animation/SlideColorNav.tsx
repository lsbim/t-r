import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface SlideColorNavProps {
    tabs: readonly PropsTab[];
    prevColor?: string; // 비선택 탭 색상
    prevHoverColor?: string;
    color: string;
    size: number;
    handler: (param: string) => void;
    initCategory?: string;
}
type PropsTab = {
    id: string;
    label: string;
    url?: string;
}

const SlideColorNav: React.FC<SlideColorNavProps> = ({
    tabs,
    prevColor = 'text-gray-400 dark:text-zinc-600',
    prevHoverColor = 'hover:text-gray-500 dark:hover:text-zinc-500',
    color,
    size = 14,
    handler,
    initCategory
}) => {

    const tabsRef = useRef<{ [key: string]: HTMLElement | null }>({});
    const [clipStyle, setClipStyle] = useState({ left: 0, width: 0 });
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [category, setCategory] = useState<string>(initCategory ?? tabs[0].id)

    useLayoutEffect(() => {
        const activeTab = tabsRef.current[category];
        if (activeTab) {
            const { offsetLeft, offsetWidth } = activeTab;
            setClipStyle({ left: offsetLeft, width: offsetWidth });

            // 첫 계산 후 로딩 상태 해제
            if (isFirstLoad) {
                const timer = setTimeout(() => setIsFirstLoad(false), 50);
                return () => clearTimeout(timer);
            }
        }
    }, [category, isFirstLoad]);

    const handleClick = (id: string) => {
        setCategory(id); // 내부 상태 업데이트
        handler(id);     // 부모에게도 알림
    };

    return (
        <div className={`relative font-bold flex gap-x-3`}>
            {tabs.map((tab) => {
                return (
                    <div
                        key={tab.id}
                        ref={(el) => { tabsRef.current[tab.id] = el; }}
                        onClick={() => handleClick(tab.id)}
                        className={`cursor-pointer select-none ${prevColor} ${prevHoverColor}  transition-colors duration-200`}
                        style={{ fontSize: `${size}px` }}
                    >
                        {tab.label}
                    </div>
                )
            })}
            <motion.div
                className={`absolute select-none ${color} top-0 left-0 flex items-center gap-x-3 pointer-events-none whitespace-nowrap`}
                aria-hidden="true"
                initial={false}
                animate={{
                    // inset(상 우 하 좌) -> 직사각형 클리핑
                    // 100% - (left + width) = 오른쪽 여백 계산
                    clipPath: `inset(0% calc(100% - ${clipStyle.left + clipStyle.width}px) 0% ${clipStyle.left}px)`
                }}
                transition={
                    isFirstLoad
                        ? { duration: 0 } // 애니메이션 시간 0으로 설정하여 첫 로딩은 즉시 색상반영
                        : { type: "spring", stiffness: 300, damping: 30 } // 클릭 시 애니메이션
                }
                style={{
                    opacity: clipStyle.width === 0 ? 0 : 1,
                    fontSize: `${size}px`
                }}
            >
                {/* 내용물은 Layer 1과 완전히 동일해야 함 (그래야 정확히 덮어씌워짐) */}
                {tabs.map((tab) => (
                    <div key={tab.id} className="opacity-100">
                        {tab.label}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export default SlideColorNav;