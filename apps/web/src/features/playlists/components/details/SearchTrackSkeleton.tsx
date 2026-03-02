export const SearchTrackSkeleton = () => (
    <div className="flex flex-col gap-1 px-1">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl">
                <div className="w-11 h-11 rounded-lg bg-gray-800 animate-pulse shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                    <div
                        className="h-3 rounded-full bg-gray-800 animate-pulse"
                        style={{ width: `${45 + (i % 3) * 15}%` }}
                    />
                    <div
                        className="h-2.5 rounded-full bg-gray-800/60 animate-pulse"
                        style={{ width: `${25 + (i % 4) * 10}%` }}
                    />
                </div>
                <div className="w-16 h-7 rounded-full bg-gray-800 animate-pulse shrink-0" />
            </div>
        ))}
    </div>
);