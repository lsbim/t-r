import React from 'react'
import { GachaInput } from '../../../types/calc/gachaTypes';
import ToggleSwitch from '../../../commons/component/ToggleSwitch';

interface GachaInputComponentProps {
    gachaInput: GachaInput,
    handleGachaInput: (updater: (prev: GachaInput) => GachaInput) => void
}

const GachaInputComponent: React.FC<GachaInputComponentProps> = (
    {
        gachaInput,
        handleGachaInput
    }) => {
    return (
        <div className="rounded-2xl lg:w-[992px] w-full mx-auto bg-white dark:bg-zinc-900 dark:text-zinc-200 p-4 gap-y-2 flex flex-col">
            <div className='flex gap-x-2 items-center'>
                <span className='font-bold'>
                    기간
                </span>
                <div className="flex gap-x-3">
                    <input
                        type="date"
                        value={gachaInput.startDate}
                        onChange={(e) => {
                            handleGachaInput(prev => ({ ...prev, startDate: e.target.value }));
                        }}
                    />
                    <span>~</span>
                    <input
                        type="date"
                        value={gachaInput.endDate}
                        onChange={(e) => {
                            handleGachaInput(prev => ({ ...prev, endDate: e.target.value }));
                        }}
                    />
                </div>
            </div>
            <div className='flex items-center gap-x-2'>
                <span className='font-bold'>
                    트릭컬 패스
                </span>
                <ToggleSwitch
                    size="sm"
                    onChange={(checked) => handleGachaInput(prev => ({ ...prev, pass: { ...prev.pass, trickcalPass: checked } }))}
                />
            </div>
            <div className='flex items-center gap-x-2'>
                <span className='font-bold'>
                    사복 패스
                </span>
                <ToggleSwitch
                    size="sm"
                    onChange={(checked) => handleGachaInput(prev => ({ ...prev, pass: { ...prev.pass, skinPass: checked } }))}
                />
            </div>
            <div className='flex items-end justify-center w-full'>
                상세 설정
            </div>
        </div>
    )
}

export default React.memo(GachaInputComponent)