export type LibrarySidebarState = "expanded" | "collapsed";
export type PlayerSidebarState = "expanded" | "collapsed";

export type LibrarySidebarItem = {
    id: string;
    type: "likes_playlist" | "playlist" | "artist" | "owned_playlist";
    title: string;
    subtitle: string;
    coverUrl: string | null;
    isPinned?: boolean;
};
export type LibraryStatus = "loading" | "error" | "empty" | "unauthenticated" | "ok";