export const getClashSortInfo = () => {

    const raw = localStorage.getItem('clash_sort');

    const sort = raw ?? 'boss'

    return sort === 'boss' || sort === 'pers' ? sort : 'boss';
}

export const updateClashSortInfo = (sort: "boss" | "pers") => {

    localStorage.setItem('clash_sort', sort);
}