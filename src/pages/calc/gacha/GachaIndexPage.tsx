import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Footer from '../../../layouts/Footer';
import HeaderNav from '../../../layouts/HeaderNav';
import SEO from '../../../commons/component/SEO';
import TopRemote from '../../../layouts/TopRemote';
import { GachaInput, GachaResult } from '../../../types/calc/gachaTypes';
import { formatDate } from '../../../utils/function';
import GachaInputComponent from '../../../components/calc/gacha/GachaInputComponent';
import GachaResultComponent from '../../../components/calc/gacha/GachaResultComponent';
import { debounce } from 'es-toolkit';
import { calcGacha } from '../../../utils/calc/gachaFunction';

const today = new Date();
const after30days = new Date();
after30days.setDate(today.getDate() + 30);

const initGachaInput: GachaInput = {
    startDate: formatDate(today),
    endDate: formatDate(after30days),
    spend: {
        candyCharge: 5,
        starCandyCharge: 3
    },
    pass: {
        trickcalPass: false,
        trickcalPassFigure: false,
        skinPass: false,
        gemPass: false,
        starCandyPass: false,
    },
    raid: {
        clash: {
            stage: 26,
            rewardRank: 4,
        },
        clashV2: {
            stage: 23,
            rewardRank: 4,
        },
        frontier: {
            rewardRank: 4,
        },
    },
    pvp: {
        maxRank: 140,
        rewardRank: 200,
    },
    shop: {
        dailyGem: true,
        weeklyGem: true,
        monthlyGem: true,
        productCheck: false,
        nice:true
    },
    character: {
        interview: false,
    },
    archive: false,
}

const GachaIndexPage = () => {

    const [gachaInput, setGachaInput] = useState<GachaInput>(initGachaInput);
    const [gachaResult, setGachaResult] = useState<GachaResult>();

    const debouncedCalcGacha = useMemo(() => {
        return debounce((
            gachaInput: GachaInput
        ) => {

            const result = calcGacha(gachaInput); // 계산 실행
            console.log('계산 결과:', result); // 로그로 확인
            setGachaResult(result);
        }, 300);
    }, []);

    useEffect(() => {
        debouncedCalcGacha(gachaInput);
    }, [gachaInput]);


    // 언마운트 시 디바운스 취소
    useEffect(() => {
        return () => {
            if (typeof (debouncedCalcGacha as any).cancel === 'function') {
                (debouncedCalcGacha as any).cancel();
            }
        };
    }, [debouncedCalcGacha]);

    const handleGachaInput = useCallback((updater: (prev: GachaInput) => GachaInput) => {
        setGachaInput(updater);
    }, []);

    console.log(gachaInput);

    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen max-w-[100vw]">
            <SEO
                title="모집 계산"
                description="일정 기간동안 획득 가능한 트릭컬 리바이브의 사도 모집용 재화를 계산합니다."
            />
            <TopRemote />
            <HeaderNav />
            {/* 소개 */}
            <div className="lg:w-[992px] w-full mx-auto flex flex-col dark:bg-zinc-900 dark:text-zinc-200 bg-white p-4 pl-6 rounded-2xl mt-4 overflow-x-auto">
                <div className="flex flex-col justify-start mb-3">
                    <h1 className="text-[20px] font-bold mr-2">모집 계산</h1>
                    <span className="flex text-[14px]">일정 기간동안 획득 가능한 사도 모집용 재화를 계산합니다.</span>
                </div>
            </div>

            <GachaInputComponent gachaInput={gachaInput} handleGachaInput={handleGachaInput} />

            <GachaResultComponent />

            <Footer />
        </div>
    )
}

export default GachaIndexPage