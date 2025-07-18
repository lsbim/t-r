import { useEffect } from "react";

const useTitle = (title: string) => {
    useEffect(() => {
        // const prevTitle = document.title;
        if (title === '트릭컬 레코드') {
            document.title = '트릭컬 레코드'
        } else {
            document.title = title + ' - 트릭컬 레코드';
        }


        // 클린업 사용 시 언마운트 -> 이전 타이틀 복구. 그러나 타이틀 변경을 2번 3번씩 하는게 거슬려서 사용x
        // return () => {
        //     document.title = prevTitle;
        // };
    }, [title])
}

export default useTitle;