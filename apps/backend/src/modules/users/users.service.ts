import { AppError } from "@/core";
import { UsersRepository } from "./users.repository";
import { CreateUser, UpdateUser, User } from "./user.model";

export class UsersService {
    private repo = new UsersRepository();

    private ensureUser = (user: User | null) => {
        if (!user) throw new AppError('User not found', 404);
        if (user && !user.isActive) throw new AppError('User is inactive', 403);
        return user;
    }

    async getUserById(id: string) {
        const exists = await this.repo.findById(id);
        return this.ensureUser(exists);
    }
    async getUserByEmail(email: string) {
        const exists = await this.repo.findByEmail(email);
        return this.ensureUser(exists);
    }
    async getUserByPhone(phone: string) {
        const exists = await this.repo.findByPhone(phone);
        return this.ensureUser(exists);
    }
    async createUser(data: CreateUser) {
        const user = await this.repo.create(data);
        return user;
    }
    async updateUser(id: string, data: UpdateUser) {
        const exists = await this.repo.findById(id);
        this.ensureUser(exists);
        const user = await this.repo.update(id, data);
        return user;
    }
    async deleteUser(id: string) {
        const exists = await this.repo.findById(id);
        this.ensureUser(exists);
        const user = await this.repo.delete(id);
        return user;
    }
}