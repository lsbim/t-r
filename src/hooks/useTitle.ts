import { useEffect } from "react";

const useTitle = (title: string) => {
    useEffect(() => {
        const prevTitle = document.title;
        if (title === '트릭컬 레코드') {
            document.title = '트릭컬 레코드'
        } else {
            document.title = title + ' - 트릭컬 레코드';
        }

    }, [title])
}

export default useTitle;