import { useCallback, useMemo, useState } from "react";

interface useCharExcludeProps<T> {
    data: T[] | undefined;
    getArr: (record: T) => string[]
}

export const useCharExclude = <T>({ data, getArr }: useCharExcludeProps<T>) => {
    const [excludedSet, setExcludedSet] = useState<Set<string>>(new Set());

    const filteredData = useMemo(() => {
        if (!data || excludedSet.size === 0) return data;
        return data.filter(r => !getArr(r).some(name => excludedSet.has(name)));
    }, [data, excludedSet, getArr]);

    const toggleExclude = useCallback((name: string) => {
        setExcludedSet(prev => {
            const next = new Set(prev);
            next.has(name) ? next.delete(name) : next.add(name);
            return next;
        });
    }, []);

    const clearExcluded = useCallback(() => setExcludedSet(new Set()), []);

    return { excludedSet, filteredData, toggleExclude, clearExcluded };
};