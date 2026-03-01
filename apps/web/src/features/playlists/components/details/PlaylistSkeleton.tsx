export const PlaylistSkeleton = () => {
    return (
        <div className="flex flex-col">
            <div className="px-6 pt-8 pb-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-44 h-44 rounded-xl bg-gray-800 animate-pulse shrink-0" />
                    <div className="flex flex-col gap-3 flex-1 pt-2">
                        <div className="h-3 rounded-full bg-gray-800 animate-pulse w-24" />
                        <div className="h-10 rounded-xl bg-gray-800 animate-pulse w-3/4" />
                        <div className="h-3 rounded-full bg-gray-800 animate-pulse w-1/2" />
                        <div className="h-3 rounded-full bg-gray-800/60 animate-pulse w-2/5" />
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-5 h-5 rounded-full bg-gray-800 animate-pulse" />
                            <div className="h-3 rounded-full bg-gray-800 animate-pulse w-28" />
                            <div className="h-3 rounded-full bg-gray-800/60 animate-pulse w-16" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-6 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-28 rounded-full bg-gray-800 animate-pulse" />
                    <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
                    <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="grid grid-cols-[40px_1fr_180px_80px] gap-4 px-4 pb-2 border-b border-gray-800">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-2.5 rounded-full bg-gray-800 animate-pulse" />
                        ))}
                    </div>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-[40px_1fr_180px_80px] gap-4 px-4 py-3 items-center"
                        >
                            <div className="h-3 w-4 rounded-full bg-gray-800/70 animate-pulse mx-auto" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md bg-gray-800 animate-pulse shrink-0" />
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <div
                                        className="h-3 rounded-full bg-gray-800 animate-pulse"
                                        style={{ width: `${50 + (i % 4) * 12}%` }}
                                    />
                                    <div
                                        className="h-2.5 rounded-full bg-gray-800/60 animate-pulse"
                                        style={{ width: `${30 + (i % 3) * 10}%` }}
                                    />
                                </div>
                            </div>
                            <div className="h-2.5 rounded-full bg-gray-800/60 animate-pulse w-24 hidden sm:block" />
                            <div className="h-2.5 rounded-full bg-gray-800/60 animate-pulse w-8 ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};