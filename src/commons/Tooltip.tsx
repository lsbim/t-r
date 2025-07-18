import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


interface TooltipData {
    top: number;
    left: number;
    text: string;
}

const Tooltip = () => {

    const [data, setData] = useState<null | TooltipData>(null);

    const calculateTooltipPosition = (mouseX: number, mouseY: number, text: string) => {
        // 툴팁의 대략적인 크기를 계산합니다
        // 실제로는 텍스트 길이와 폰트 크기를 기반으로 추정합니다
        const tooltipWidth = Math.min(text.length * 8, 300); // 최대 300px로 제한
        const tooltipHeight = Math.ceil(text.length * 8 / 300) * 20 + 16; // 줄 수에 따른 높이 추정

        // 브라우저 창의 크기를 가져옵니다
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;

        // 기본 위치 (마우스 오른쪽 아래)
        let left = mouseX + 10;
        let top = mouseY + 20;

        // 오른쪽 경계 체크 - 툴팁이 화면을 벗어나면 마우스 왼쪽에 표시
        if (left + tooltipWidth > windowWidth + scrollX) {
            left = mouseX - tooltipWidth - 10;
        }

        // 왼쪽 경계 체크 - 음수가 되면 최소 여백 확보
        if (left < scrollX + 10) {
            left = scrollX + 10;
        }

        // 아래쪽 경계 체크 - 툴팁이 화면을 벗어나면 마우스 위에 표시
        if (top + tooltipHeight > windowHeight + scrollY) {
            top = mouseY - tooltipHeight - 10;
        }

        // 위쪽 경계 체크 - 음수가 되면 최소 여백 확보
        if (top < scrollY + 10) {
            top = scrollY + 10;
        }

        return { left, top };
    };

    useEffect(() => {

        const onMouseover = (event: MouseEvent) => {
            // 실제 이벤트가 발생한 요소부터 시작해서 부모 요소들을 탐색합니다
            const tooltipElement = (event.target as Element)?.closest('[data-tooltip]');

            // data-tooltip 속성을 가진 요소를 찾았다면 툴팁을 표시합니다
            if (tooltipElement) {
                const text = tooltipElement.getAttribute("data-tooltip") ?? "";
                const rect = tooltipElement.getBoundingClientRect();

                // 요소의 중심점을 기준으로 초기 위치 계산
                const elementCenterX = rect.left + (rect.width / 2) + window.pageXOffset;
                const elementCenterY = rect.bottom + 5 + window.pageYOffset;


                const position = calculateTooltipPosition(elementCenterX, elementCenterY, text);


                setData({
                    text,
                    left: position.left,
                    top: position.top // 요소 바로 아래 5픽셀 간격
                });
            }
        };

        const onMouseout = (event: MouseEvent) => {
            const tooltipElement = (event.target as Element)?.closest('[data-tooltip]');
            if (tooltipElement) {
                setData(null);
            }
        };

        const onMousemove = ({ pageX, pageY }: MouseEvent) => {
            setData((prevData) => {
                if (prevData) {
                    // 마우스 움직임에 따라 위치를 다시 계산
                    const position = calculateTooltipPosition(pageX, pageY, prevData.text);
                    return {
                        ...prevData,
                        left: position.left,
                        top: position.top
                    };
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
                left: data.left,
                top: data.top,
            }}
        >
            {data.text}
        </div>
    );
}

export default Tooltip;