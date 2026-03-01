import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    LIBRARY_COLLAPSED_WIDTH,
    LIBRARY_EXPANDED_WIDTH,
    LIBRARY_MAX_WIDTH,
    LIBRARY_MIN_WIDTH,
    LIBRARY_SIDEBAR_KEY,
} from "../constants/sidebar.constants";
import type { LibrarySidebarItem, LibrarySidebarState, LibraryStatus } from "../types/sidebar.types";
import { useAuthStore } from "@/features/auth";
import { useQuery } from "@tanstack/react-query";
import { libraryService } from "../services/library.service";

const getInitialState = (): LibrarySidebarState => {
    const saved = localStorage.getItem(LIBRARY_SIDEBAR_KEY);
    return (saved as LibrarySidebarState) ?? "expanded";
};

const getInitialWidth = (state: LibrarySidebarState): number => {
    if (state === "collapsed") return LIBRARY_COLLAPSED_WIDTH;
    const savedWidth = localStorage.getItem(`${LIBRARY_SIDEBAR_KEY}-width`);
    return savedWidth ? parseInt(savedWidth) : LIBRARY_EXPANDED_WIDTH;
};

export const useLibrarySidebar = () => {
    const [state, setState] = useState<LibrarySidebarState>(getInitialState);
    const [width, setWidth] = useState(() => getInitialWidth(getInitialState()));
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startWidth = useRef(0);
    const isExpanded = state === "expanded";

    const { isAuthenticated } = useAuthStore();
    const isAnonymous = localStorage.getItem("isAnonymous") && localStorage.getItem("isAnonymous") === "true";
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["library"],
        queryFn: libraryService.getLibraryItems,
        enabled: isAuthenticated && !isAnonymous,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
    const items = useMemo((): LibrarySidebarItem[] => {
        if (!data?.data) return [];
        const { likesPlaylist, items: mixedItems, ownedPlaylists } = data.data;
        const result: LibrarySidebarItem[] = [];
        if (likesPlaylist) {
            result.push({
                id: likesPlaylist.id.toString(),
                type: "likes_playlist",
                title: likesPlaylist.name,
                subtitle: `${likesPlaylist.trackCount} ${likesPlaylist.trackCount === 1 ? "song" : "songs"}`,
                coverUrl: "",
                isPinned: true
            });
        }
        for (const item of mixedItems) {
            if (item.type === "playlist") {
                result.push({
                    id: item.id.toString(),
                    type: "playlist",
                    title: item.name,
                    subtitle: `${item.trackCount} ${item.trackCount === 1 ? "song" : "songs"}`,
                    coverUrl: item.coverImageUrl,
                });
            } else if (item.type === "artist") {
                result.push({
                    id: item.id.toString(),
                    type: "artist",
                    title: item.name,
                    subtitle: "Artist",
                    coverUrl: item.imageUrl,
                })
            }
        }
        for (const playlist of ownedPlaylists) {
            result.push({
                id: playlist.id.toString(),
                type: "owned_playlist",
                title: playlist.name,
                subtitle: `${playlist.trackCount} ${playlist.trackCount === 1 ? "song" : "songs"}`,
                coverUrl: playlist.coverImageUrl,
            })
        }
        return result;
    }, [data]);
    const status = useMemo((): LibraryStatus => {
        if (!isAuthenticated && isAnonymous) return "unauthenticated";
        if (isLoading) return "loading";
        if (isError) return "error";
        if (items.length === 0) return "empty";
        return "ok";
    }, [isAuthenticated, isAnonymous, isLoading, isError, items]);
    const canCollapse = status === "ok";
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (!canCollapse && state === "collapsed") setState("expanded");
    }, [canCollapse, state]);
    useEffect(() => {
        localStorage.setItem(LIBRARY_SIDEBAR_KEY, state);
    }, [state]);
    useEffect(() => {
        if (state === "expanded") localStorage.setItem(`${LIBRARY_SIDEBAR_KEY}-width`, String(width));
    }, [width, state]);
    const toggle = useCallback(() => {
        if (!canCollapse) return;
        setState(prev => {
            if (prev === "expanded") return "collapsed";
            const savedWidth = localStorage.getItem(`${LIBRARY_SIDEBAR_KEY}-width`);
            setWidth(savedWidth ? parseInt(savedWidth) : LIBRARY_EXPANDED_WIDTH);
            return "expanded";
        });
    }, [canCollapse]);
    const onDragStart = useCallback((e: React.MouseEvent) => {
        if (!canCollapse) return;
        isDragging.current = true;
        startX.current = e.clientX;
        startWidth.current = width;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    }, [width, canCollapse]);
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            const delta = e.clientX - startX.current;
            const newWidth = Math.min(
                Math.max(startWidth.current + delta, LIBRARY_MIN_WIDTH),
                LIBRARY_MAX_WIDTH
            );
            if (startWidth.current + delta < LIBRARY_MIN_WIDTH - 40) {
                setState("collapsed");
                setWidth(LIBRARY_COLLAPSED_WIDTH);
                isDragging.current = false;
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
                return;
            }
            setState("expanded");
            setWidth(newWidth);
        };
        const onMouseUp = () => {
            isDragging.current = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    const currentWidth = isExpanded ? width : LIBRARY_COLLAPSED_WIDTH;
    const showCreateLabel = isExpanded && width > 250;

    return {
        state,
        isExpanded,
        width: currentWidth,
        rawWidth: width,
        status,
        canCollapse,
        showCreateLabel,
        toggle,
        onDragStart,
        items,
        refetch
    };
};