const NewBadge = ({ compact = false, className = "" }: { compact?: boolean, className?: string }) => (
    <div
        className={`pointer-events-none rounded-md bg-gradient-to-r from-[rgb(20,173,138)] to-[rgb(19,115,194)] font-bold text-zinc-100 shadow-md shadow-zinc-800/50 ${compact ? "border-2 border-zinc-100 px-1 text-[9px] leading-4" : "border-2 border-zinc-100 px-2 py-[2px] text-[11px]"} ${className}`}
    >
        NEW
    </div>
);

export default NewBadge;
