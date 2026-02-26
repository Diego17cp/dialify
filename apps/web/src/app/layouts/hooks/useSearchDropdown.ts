import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchService } from "../services/search.service";

const DEBOUNCE_MS = 400;

export const useSearchDropdown = (searchQuery: string, inputRef: React.RefObject<HTMLInputElement | null>) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["search", debouncedQuery],
        queryFn: () => searchService.search(debouncedQuery),
        enabled: debouncedQuery.length > 0,
        staleTime: 1000 * 30, // 30 seconds
        retry: false,
    });

    const { data: recentData, isLoading: isRecentLoading, isError: isRecentError } = useQuery({
        queryKey: ["recentTracks"],
        queryFn: () => searchService.playbackHistory(30),
        staleTime: 1000 * 60, // 1 minute
    })

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const clickedOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
            const clickedOutsideInput = inputRef.current && !inputRef.current.contains(target);
            if (clickedOutsideDropdown && clickedOutsideInput) setIsDropdownOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [inputRef]);

    const openDropdown = () => setIsDropdownOpen(true);
    const closeDropdown = () => setIsDropdownOpen(false);

    // TODO: do play on click instead of just closing dropdown

    const results = data?.data || [];
    const recentTracks = recentData?.data || [];
    const hasQuery = searchQuery.trim().length > 0;
    const isSearching = searchQuery.trim() !== debouncedQuery || (isLoading && hasQuery);
    const hasRecents = recentTracks.length > 0;
    const hasResults = results.length > 0;
    const showEmpty = hasQuery && !isSearching && !hasResults && !isError;

    return {
        isDropdownOpen,
        isSearching,
        isError,
        results,
        recentTracks,
        hasQuery,
        hasRecents,
        hasResults,
        showEmpty,
        dropdownRef,
        openDropdown,
        closeDropdown,
        isRecentLoading,
        isRecentError,
    }
}