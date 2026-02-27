export const LibrarySkeleton = ({ isExpanded }: { isExpanded: boolean }) => {
    return (
        <div className="flex flex-col gap-1 px-2">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-2 rounded-lg">
                    {/* Cover */}
                    <div
                        className={`shrink-0 rounded-md bg-gray-700/50 animate-pulse ${
                            isExpanded ? "w-10 h-10" : "w-9 h-9"
                        }`}
                    />
                    {/* Info — solo en expanded */}
                    {isExpanded && (
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                            <div
                                className="h-3 rounded-full bg-gray-700/50 animate-pulse"
                                style={{ width: `${50 + (i % 3) * 15}%` }}
                            />
                            <div
                                className="h-2.5 rounded-full bg-gray-800/50 animate-pulse"
                                style={{ width: `${35 + (i % 4) * 10}%` }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};