import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


interface TooltipData {
    top: number;
    left: number;
    text: string;
}

const Tooltip = () => {

    const [data, setData] = useState<null | TooltipData>(null);


    useEffect(() => {

        const onMouseover = (event: MouseEvent) => {
            // 실제 이벤트가 발생한 요소부터 시작해서 부모 요소들을 탐색합니다
            const tooltipElement = (event.target as Element)?.closest('[data-tooltip]');

            // data-tooltip 속성을 가진 요소를 찾았다면 툴팁을 표시합니다
            if (tooltipElement) {
                const text = tooltipElement.getAttribute("data-tooltip") ?? "";
                const rect = tooltipElement.getBoundingClientRect();
                setData({
                    text,
                    left: rect.left + (rect.width / 2),
                    top: rect.bottom + 5 // 요소 바로 아래 5픽셀 간격
                });
            }
        };

        const onMouseout = (event: MouseEvent) => {
            // 마우스가 data-tooltip 요소를 떠났는지 확인합니다
            const tooltipElement = (event.target as Element)?.closest('[data-tooltip]');
            if (tooltipElement) {
                setData(null);
            }
        };

        const onMousemove = ({ pageX, pageY }: MouseEvent) => {
            setData((prevData) => {
                if (prevData) {
                    return { ...prevData, left: pageX, top: pageY };
                }
                return prevData;
            });
        };

        document.addEventListener("mouseover", onMouseover);
        document.addEventListener("mouseout", onMouseout);
        document.addEventListener("mousemove", onMousemove);

        // 정리 함수: 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다
        return () => {
            document.removeEventListener("mouseover", onMouseover);
            document.removeEventListener("mouseout", onMouseout);
            document.removeEventListener("mousemove", onMousemove);
        };
    }, []);

    // console.log(data)


    if (!data || !data.text || !data.text.trim()) return null;

    return (
        <div
            className={`absolute z-50 bg-gray-800 bg-opacity-80 p-2 text-white text-[12px] rounded-sm whitespace-pre-line`}
            style={{
                left: data.left + 10,
                top: data.top + 20,
            }}
        >
            {data.text}
        </div>
    );
}

export default Tooltip;