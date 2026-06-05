export function rankBG(rank: number) {
    switch (rank) {
        case 0:
            return 'bg-gradient-to-b from-[rgba(254,201,39,0.5)] to-[rgba(254,201,39,1)]'
        case 1:
            return 'bg-gradient-to-b from-[rgba(209,229,236,0.2)] to-[rgba(214,234,242,1)]'
        case 2:
            return 'bg-gradient-to-b from-[rgba(193,175,129,0.5)] to-[rgba(193,175,129,1)]'
    }
}

export function rankBorderShadow(rank: number) {
    switch (rank) {
        case 0:
            return 'border-[rgb(254,201,39)] shadow-[4px_4px_0_0_rgba(254,201,39,0.2)]'
        case 1:
            return 'border-[rgb(209,229,236)] shadow-[4px_4px_0_0_rgba(209,229,236,0.2)]'
        case 2:
            return 'border-[rgb(193,175,129)] shadow-[4px_4px_0_0_rgba(193,175,129,0.2)]'
    }
}