import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";

const LG_BREAKPOINT = 1024;

export const useHeader = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLg, setIsLg] = useState(window.innerWidth >= LG_BREAKPOINT);
    const [isSearchOpen, setIsSearchOpen] = useState(window.innerWidth >= LG_BREAKPOINT);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleResize = () => {
            const lg = window.innerWidth >= LG_BREAKPOINT;
            setIsLg(lg);
            setIsSearchOpen(lg);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSearch = () => {
        if (isLg) return;
        setIsSearchOpen(prev => !prev);
    }
    const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
    const closeDrawer = () => setIsDrawerOpen(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        searchInputRef.current?.blur();
    };
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        closeDrawer();
    }, [location.pathname]);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeDrawer();
                setIsSearchOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return {
        isSearchOpen,
        searchQuery,
        isDrawerOpen,
        searchInputRef,
        toggleSearch,
        toggleDrawer,
        closeDrawer,
        handleSearchChange,
        handleSearchSubmit,
        isLg,
    };
};