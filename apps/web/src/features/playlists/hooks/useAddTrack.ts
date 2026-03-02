import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { playlistsService } from "../services/playlists.service";

export const useAddTrack = (playlistId: string) => {
    const queryClient = useQueryClient();

    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

    const mutation = useMutation({
        mutationFn: (trackId: string) =>
            playlistsService.addTrackToPlaylist(playlistId, trackId),
        onMutate: (trackId) => {
            setAddedIds(prev => new Set(prev).add(trackId));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["playlistDetails", playlistId] });
        },
        onError: (_err, trackId) => {
            setAddedIds(prev => {
                const next = new Set(prev);
                next.delete(trackId);
                return next;
            });
            toast.error("Failed to add track. Try again.");
        },
    });

    return {
        addTrack: mutation.mutate,
        addedIds,
        isPending: mutation.isPending,
    };
};
