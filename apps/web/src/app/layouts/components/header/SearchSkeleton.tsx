export const SearchSkeleton = () => {
    return (
        <div className="flex flex-col gap-2 px-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-2">
                    <div className="shrink-0 w-10 h-10 rounded-md bg-gray-700/60 animate-pulse" />
                    <div className="flex flex-col gap-1.5 flex-1">
                        <div
                            className="h-3 rounded-full bg-gray-700/60 animate-pulse"
                            style={{ width: `${55 + i * 10}%` }}
                        />
                        <div
                            className="h-2.5 rounded-full bg-gray-800/60 animate-pulse"
                            style={{ width: `${35 + i * 5}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};