import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { playlistsService } from "../services/playlists.service";
import type { PlaylistDetails } from "../types/playlist";

type EditForm = {
    name: string;
    description: string;
    isPublic: boolean;
    coverPreview: string | null;
    coverFile: File | null;
};

type EditFormErrors = {
    name?: string;
    description?: string;
};

export const useEditPlaylist = (details: PlaylistDetails) => {
    const queryClient = useQueryClient();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<EditForm>({
        name: details.name,
        description: details.description ?? "",
        isPublic: details.isPublic,
        coverPreview: details.tracks?.[0]?.thumbnailUrl ?? null,
        coverFile: null,
    });

    const [errors, setErrors] = useState<EditFormErrors>({});

    const openEditModal = () => {
        setForm({
            name: details.name,
            description: details.description ?? "",
            isPublic: details.isPublic,
            coverPreview: details.tracks?.[0]?.thumbnailUrl ?? null,
            coverFile: null,
        });
        setErrors({});
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);
    const handleChange = (field: keyof Omit<EditForm, "coverPreview" | "coverFile">, value: string | boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof EditFormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };
    const handleCoverClick = () => fileInputRef.current?.click();
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setForm(prev => ({ ...prev, coverFile: file, coverPreview: preview }));
    };
    const validate = () => {
        const newErrors: EditFormErrors = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (form.name.length > 100) newErrors.name = "Name must be less than 100 characters";
        if (form.description.length > 300) newErrors.description = "Description must be less than 300 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const editMutation = useMutation({
        mutationFn: () => playlistsService.editPlaylist(details.id, {
            name: form.name.trim(),
            description: form.description.trim(),
            isPublic: form.isPublic,
            // TODO: enviar coverFile cuando esté implementado en el backend
        }),
        onSuccess: () => {
            toast.success(`Playlist "${details.name}" updated!`);
            queryClient.invalidateQueries({ queryKey: ["playlistDetails", details.id] });
            closeEditModal();
        },
        onError: () => {
            toast.error("Failed to update playlist. Try again.");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        editMutation.mutate();
    };

    return {
        isEditModalOpen,
        openEditModal,
        closeEditModal,
        form,
        errors,
        handleChange,
        handleCoverClick,
        handleCoverChange,
        handleSubmit,
        fileInputRef,
        isUpdating: editMutation.isPending,
        isError: editMutation.isError,
    };
};