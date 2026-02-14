export interface User {
    id: string;
    email: string | null;
    phone: string | null;
    username: string | null;
    isAnonymous: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}