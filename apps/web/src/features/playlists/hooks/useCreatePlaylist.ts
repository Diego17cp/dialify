import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { playlistsService } from "../services/playlists.service";

export const useCreatePlaylist = (listRef: React.RefObject<HTMLDivElement | null>) => {
    const queryClient = useQueryClient();
	const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
	const openCreatePlaylist = () => setIsCreatePlaylistOpen(true);
	const closeCreatePlaylist = () => {
        setIsCreatePlaylistOpen(false);
        setData({
            name: "",
            description: "",
            isPublic: false,
        });
        setErrors({});
    }
	const [data, setData] = useState<{
		name: string;
		description: string;
		isPublic: boolean;
	}>({
		name: "",
		description: "",
		isPublic: false,
	});
    const [errors, setErrors] = useState<{
        name?: string;
        description?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!data.name) newErrors.name = "Name is required";
        if (data.description && data.description.length > 300) newErrors.description = "Description must be less than 300 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof typeof data, value: string | boolean) => {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (errors[field as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const createPlaylistMutation = useMutation({
        mutationFn: playlistsService.createPlaylist,
        onSuccess: (_data, variables) => {
            closeCreatePlaylist();
            toast.success(`"${variables.name}" created!`);
            queryClient.invalidateQueries({ queryKey: ["library"] });
            setTimeout(() => {
                listRef.current?.scrollTo({
                    top: listRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }, 500);
        },
        onError: () => {
            toast.error("Failed to create playlist. Try again.");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fix the errors in the form");
            return;
        }
        createPlaylistMutation.mutate(data);
    }
    
    return {
        isCreatePlaylistOpen,
        openCreatePlaylist,
        closeCreatePlaylist,
        data,
        errors,
        handleChange,
        handleSubmit,
        isSubmitting: createPlaylistMutation.isPending,
        isError: createPlaylistMutation.isError,
        httpError: createPlaylistMutation.error,
        listRef,
    }
};
