import { containerDarkBG } from "@/styles/container";
import InfoIcon from "@/components/icons/InfoIcon";
import { ReactNode } from "react";

// 통계 섹션 제목 + 설명 툴팁 + 내용
const StatSection = ({ title, info, children }: { title: string, info?: string, children: ReactNode }) => {
    return (
        <div className={`dark:brightness-90 w-full mx-auto flex flex-col p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 ${containerDarkBG}`}>
            <div className="flex items-center mb-3">
                <span className="text-xl font-bold mr-2 dark:text-zinc-200">{title}</span>
                {info && <InfoIcon text={info} />}
            </div>
            {children}
        </div>
    );
};

export default StatSection;