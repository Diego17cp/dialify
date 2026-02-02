import { DatabaseConnection } from "@/config";
import { CreateUser, UpdateUser, User } from "./user.model";

export class UsersRepository {
    private db = DatabaseConnection.getInstance().getClient();
    private users = this.db.user;

    private selectFields = {
        id: true,
        email: true,
        phone: true,
        username: true,
        isAnonymous: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
    }

    async findById(id: number, active: boolean = true): Promise<User | null> {
        return this.users.findUnique({
            where: { id, isActive: active },
            select: this.selectFields,
        });
    }

    async findByEmail(email: string, active: boolean = true): Promise<User | null> {
        return this.users.findUnique({
            where: { email, isActive: active },
            select: this.selectFields,
        });
    }

    async findByPhone(phone: string, active: boolean = true): Promise<User | null> {
        return this.users.findUnique({
            where: { phone, isActive: active },
            select: this.selectFields,
        });
    }

    async create(data: CreateUser): Promise<User> {
        const user = await this.users.create({
            data,
            select: this.selectFields,
        });
        return user;
    }

    async update(id: number, data: UpdateUser): Promise<User> {
        return this.users.update({
            where: { id },
            data,
            select: this.selectFields,
        });
    }

    async delete(id: number): Promise<User> {
        return this.users.update({
            where: { id },
            data: { isActive: false, deletedAt: new Date() },
            select: this.selectFields,
        });
    }
}
