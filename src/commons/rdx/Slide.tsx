import * as Slider from "@radix-ui/react-slider";
import { useCallback } from "react";

const Slide = ({ max, value, handle }: { max: number, value: [number, number], handle?: (v: [number, number]) => void }) => {

    const handleCommit = useCallback((v: number[]) => {
        // 
        const sorted = v.slice().sort((a, b) => a - b);
        const clamped: [number, number] = [
            Math.max(1, Math.min(sorted[0], max)),
            Math.max(1, Math.min(sorted[1] ?? sorted[0], max)),
        ];

        handle?.(clamped);
    }, [handle, max]);


    return (
        <div className="flex items-center gap-x-3">
            <Slider.Root
                className="relative flex h-5 w-[200px] touch-none select-none items-center"
                value={value}
                min={1}
                max={max}
                step={1}
                // onValueCommit={handleCommit} 커서를 떼면 적용
                onValueChange={handleCommit} // 실시간 값의 변화 적용
            >
                <Slider.Track className="relative h-[10px] grow rounded-full bg-gray-200">
                    <Slider.Range className="absolute h-full rounded-full bg-black" />
                </Slider.Track>
                <Slider.Thumb
                    className="block size-4 rounded-[10px] bg-white shadow-[0_0_0_2px] shadow-blackA4 hover:bg-violet3 focus:outline-none"
                />
                <Slider.Thumb
                    className="block size-4 rounded-[10px] bg-white shadow-[0_0_0_2px] shadow-blackA4 hover:bg-violet3 focus:outline-none"
                />
            </Slider.Root>
        </div>
    );
}

export default Slide;