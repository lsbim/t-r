import { useMemo, useState } from "react";
import { CostumeMapItem, getDaysSince } from "../../../pages/timeline/costume/IndexPage";
import PersonalityIcon from "../../../commons/PersonalityIcon";
import { charInfo } from "../../../data/trickcalChar";
import SortArrowIcon from "../../../commons/SortArrowIcon";

type SortConfig = {
    key: 'count' | 'since' | 'birthDate';
    orderBy: 'asc' | 'desc'
}

const CostumeBoard = ({ charStatList }: { charStatList: CostumeMapItem[] }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'since',
        orderBy: 'desc'
    })
    const [currentPage, setCurrentPage] = useState(1);

    const itemPerPage = 10; // 페이지당 몇개의 목록을
    const currentDataRange = (currentPage - 1) * itemPerPage;

    const lastPage = Math.ceil(charStatList.length / 10) ?? 1;
    const pages = useMemo(() => Array.from({ length: lastPage }, (_, i) => i + 1), [lastPage]);

    // const currentPageData = charStatList.slice(currentDataRange, currentDataRange + itemPerPage);

    // 정렬 로직
    const currentPageData = useMemo(() => {

        const sortItems = [...charStatList];
        if (sortConfig.key === 'birthDate') {
            sortItems.sort((a, b) => {
                const aValue = charInfo[a.charName].birthdate;
                const bValue = charInfo[b.charName].birthdate;
                const res = aValue.localeCompare(bValue);
                return sortConfig.orderBy === 'asc' ? res : -res;
            });
        } else {
            sortItems.sort((a, b) => {
                let aValue, bValue;

                if (sortConfig.key === 'count') {
                    aValue = a.count;
                    bValue = b.count;
                } else { // since - latestDate로 정렬
                    // null 값들을 맨 뒤로 보내기
                    if (!a.latestDate && !b.latestDate) return -1;
                    if (!a.latestDate) return 1;
                    if (!b.latestDate) return -1;

                    aValue = a.latestDate;
                    bValue = b.latestDate;
                }

                if (aValue < bValue) {
                    return sortConfig.orderBy === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.orderBy === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        // console.log(sortItems)

        return sortItems.slice(currentDataRange, currentDataRange + itemPerPage);;
    }, [sortConfig, currentDataRange])

    // console.log(currentPageData)
    const handleCostumeBoardSort = (key: SortConfig['key']) => {
        setSortConfig(prev => {
            if (key !== prev.key) {
                return { key: key, orderBy: 'desc' };
            }
            return { ...prev, orderBy: prev.orderBy === 'desc' ? 'asc' : 'desc' };
        });
        setCurrentPage(1);
    };

    return (
        <div className="md:w-[768px] min-h-[431px] w-full flex flex-col mx-auto bg-white shadow-md mb-[50px]">
            {/* 카테고리 */}
            {currentPageData && (
                <div className="font-bold flex mb-1 md:gap-x-3 gap-x-1 w-full bg-orange-50 border-b-2 border-gray-200 md:text-[15px] text-[12px]">
                    <div className={`py-1 px-2 flex justify-center ${boardCategoryWidthStyle('name')}`} >
                        이름
                    </div>
                    <div
                        onClick={() => handleCostumeBoardSort('count')}
                        className={`py-1 px-2 flex cursor-pointer justify-center items-center group ${boardCategoryWidthStyle('count')}`}>
                        개수
                        <SortArrowIcon
                            active={sortConfig.key === 'count'}
                            orderBy={sortConfig.orderBy}
                        />
                    </div>
                    <div
                        onClick={() => handleCostumeBoardSort('since')}
                        className={`py-1 px-2 flex cursor-pointer justify-center items-center group ${boardCategoryWidthStyle('since')}`}>
                        마지막 사복
                        <SortArrowIcon
                            active={sortConfig.key === 'since'}
                            orderBy={sortConfig.orderBy}
                        />
                    </div>
                    <div
                        onClick={() => handleCostumeBoardSort('birthDate')}
                        className={`py-1 px-2 flex cursor-pointer justify-center items-center group ${boardCategoryWidthStyle('birthDate')} mx-auto`}>
                        사도 출시일
                        <SortArrowIcon
                            active={sortConfig.key === 'birthDate'}
                            orderBy={sortConfig.orderBy}
                        />
                    </div>
                </div>
            )}

            {/* 데이터 */}
            <div className="flex flex-col md:gap-y-2 gap-y-3 flex-grow">
                {currentPageData && currentPageData.map((c, index) => (
                    <div
                        key={"costume_board_" + currentPage + index}
                        className="flex md:gap-x-3 gap-x-1 md:text-[14px] text-[12px]">

                        <div className={`py-[2px] px-2 flex items-center gap-x-2 ${boardCategoryWidthStyle('name')} md:text-[15px] text-[13px] font-bold`}>
                            <PersonalityIcon personality={charInfo[c.charName].personality} size={16} />
                            <span className="truncate max-w-[60px] md:max-w-[140px]">
                                {c.charName === '시온' ? '시온 더 다크불릿' : c.charName}
                            </span>
                        </div>
                        <div className={`font-bold py-[2px] px-2 flex items-center justify-center ${boardCategoryWidthStyle('count')}`}>
                            {c.count}
                        </div>
                        <div
                            className={`cursor-pointer py-[2px] px-2 flex items-center justify-between gap-x-4 font-bold text-red-500 ${boardCategoryWidthStyle('since')}`}>
                            <span className={`flex items-center justify-center font-normal text-gray-700 `}>
                                {c.latestDate === "2023-09-27" ? "無" : c.latestDate}
                            </span>
                            <span
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content={c?.costumes && c?.costumes[c.costumes.length - 1]?.cosName}
                                className={`flex items-center justify-center ${getSinceColor(c.since)}`}>
                                {c.since}일 전
                            </span>
                        </div>
                        <div className={`py-[2px] px-2 mx-auto flex items-center justify-center text-gray-700 ${boardCategoryWidthStyle('birthDate')}`}>
                            {charInfo[c.charName].birthdate}
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지 */}
            <div className="flex items-end justify-center md:gap-x-2 gap-x-1 my-2 md:text-[16px] text-[14px]">
                {pages.map(p => (
                    <div
                        onClick={() => {
                            if (p === currentPage) return;
                            setCurrentPage(p);
                        }}
                        className={`cursor-pointer p-2 ${p === currentPage ? 'text-orange-500 shadow-sm font-bold' : ''}`}
                        key={"costume_board_page" + p}>
                        {p}
                    </div>
                ))}
            </div>
        </div>
    );
}

function getSinceColor(since: number) {

    if (since <= 90) {
        return 'text-blue-600';
    } else if (since <= 180) {
        return 'text-green-600';
    } else if (since <= 365) {
        return 'text-amber-600';
    } else if (since <= 600) {
        return 'text-red-500';
    } else {
        return 'text-black';
    }
};

function boardCategoryWidthStyle(type: 'name' | 'count' | 'since' | 'birthDate') {

    /*         아래처럼 동적으로 만들 시 오작동
             return `md:dw-[${boardCaterogyWidths.dtName}px] w-[${boardCaterogyWidths.moName}]`;
     */

    switch (type) {
        case 'name':
            return 'md:w-[170px] w-[25%]';
        case 'count':
            return 'md:w-[100px] w-[14%]';
        case 'since':
            return 'md:w-[200px] w-[35%]';
        case 'birthDate':
            return 'md:w-[120px] w-[22%]';
        default:
            return '';
    }
};

export default CostumeBoard;