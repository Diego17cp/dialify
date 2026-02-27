export type LibrarySidebarState = "expanded" | "collapsed";
export type PlayerSidebarState = "expanded" | "collapsed";

export type LibraryItem = {
    id: string;
    title: string;
    subtitle: string;
    coverUrl: string;
    type: "playlist" | "album" | "artist";
    isOwn?: boolean;
};
export type LibraryStatus = "loading" | "error" | "empty" | "unauthenticated" | "ok";