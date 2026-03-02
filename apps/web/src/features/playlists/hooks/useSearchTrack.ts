import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { playlistsService } from "../services/playlists.service";

const DEBOUNCE_MS = 400;
const LIMIT = 20;

export const useSearchTracks = (observerRef: React.RefObject<HTMLDivElement | null>) => {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const trimmed = query.trim();
            setDebouncedQuery(trimmed);
            if (trimmed.length >= 1) setHasSearched(true);
        }, DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [query]);

    const searchQuery = useInfiniteQuery({
        queryKey: ["trackSearch", debouncedQuery],
        queryFn: ({ pageParam }) =>
            playlistsService.searchTracks(debouncedQuery, pageParam as number, LIMIT),
        initialPageParam: 1,
        getNextPageParam: (last, pages) =>
            last.length === LIMIT ? pages.length + 1 : undefined,
        enabled: debouncedQuery.length >= 1,
    });

    const tracks = searchQuery.data?.pages.flat() ?? [];

    useEffect(() => {
        const el = observerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) {
                    searchQuery.fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [searchQuery.hasNextPage, searchQuery.isFetchingNextPage, searchQuery.fetchNextPage]);

    return {
        query,
        setQuery,
        tracks,
        isSearching: searchQuery.isFetching && !searchQuery.isFetchingNextPage,
        isFetchingNextPage: searchQuery.isFetchingNextPage,
        hasResults: tracks.length > 0,
        hasQuery: debouncedQuery.length >= 1,
        hasSearched,
    };
};