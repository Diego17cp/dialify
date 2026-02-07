import { User as DBUser } from "generated/prisma/client";

export type IUser = DBUser;
export interface CreateUser {
    email?: string;
    password?: string;
    phone?: string;
    username?: string;
    isAnonymous: boolean;
}
export interface UpdateUser extends Partial<CreateUser> {}
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