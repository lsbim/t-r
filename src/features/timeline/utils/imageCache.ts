const imageCache = new Map<string, HTMLImageElement>();
const loadingCache = new Map<string, Promise<HTMLImageElement>>(); // 중복호출 방지

const createImage = (src: string): Promise<HTMLImageElement> => {
    const cached = imageCache.get(src);

    if (cached) {
        return Promise.resolve(cached);
    }

    const loading = loadingCache.get(src);

    if (loading) {
        return loading;
    }

    const promise = new Promise<HTMLImageElement>((resolve) => {
        const image = new window.Image();

        image.onload = async () => {
            // 가능하면 decode까지
            if (typeof image.decode === "function") {
                try {
                    await image.decode();
                } catch {
                }
            }

            imageCache.set(src, image);
            loadingCache.delete(src);

            resolve(image);
        };

        image.src = src;
    });

    loadingCache.set(src, promise);

    return promise;
};

export const preloadImages = async (urls: readonly string[]): Promise<Map<string, HTMLImageElement>> => {
    const uniqueUrls = [...new Set(urls)];

    await Promise.all(
        uniqueUrls.map((src) => createImage(src))
    );

    return imageCache;
};

export const getCachedImage = (src: string): HTMLImageElement | null => {
    return imageCache.get(src) ?? null;
};