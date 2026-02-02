import { DatabaseConnection } from "@/config";
import { AppError, hashPassword, verifyPassword } from "@/core";
import { generateTokens, parseUser, verifyRefreshToken } from "./auth.utils";
import { User } from "../users/user.model";
import { AuthResponse } from "./auth.types";
import { UsersRepository } from "../users/users.repository";

export class AuthService {
    private db = DatabaseConnection.getInstance().getClient();
    private userRepo = new UsersRepository();

    login = async (email: string, password: string): Promise<AuthResponse | null> => {
        const user = await this.db.user.findUnique({
            where: { email, isActive: true },
        });
        if (!user) return null;
        
        const isValid = await verifyPassword(password, user.password || "");
        if (!isValid) return null;
        
        const parsedUser = parseUser(user);
        const { accessToken, refreshToken } = generateTokens(parsedUser);
        
        return {
            user: parsedUser,
            accessToken,
            refreshToken,
        };
    };

    loginAnonymous = async (): Promise<AuthResponse> => {
        const user = await this.userRepo.create({
            isAnonymous: true,
            username: `guest_${Date.now()}`,
        });
        const { accessToken, refreshToken } = generateTokens(user);

        return {
            user,
            accessToken,
            refreshToken,
        };
    };

    refresh = async (token: string): Promise<AuthResponse | null> => {
        if (!token) return null;
        
        try {
            const decoded = verifyRefreshToken(token);
            if (!decoded || !decoded.userId) return null;
            
            const currentUser = await this.userRepo.findById(decoded.userId);
            
            if (!currentUser) return null;

            const { accessToken, refreshToken: newRefreshToken } = generateTokens(currentUser);
            
            return {
                user: currentUser,
                accessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            console.error("Error refreshing token:", error);
            return null;
        }
    };

    convertAnonymousToRegistered = async (
        userId: number,
        email: string,
        password: string,
        username?: string
    ): Promise<AuthResponse> => {
        const user = await this.userRepo.findById(userId);
        if (!user || !user.isAnonymous) throw new AppError("Invalid user", 400);
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) throw new AppError("Email already exists", 409);

        const hashedPassword = await hashPassword(password);

        const updatedUser = await this.db.user.update({
            where: { id: userId },
            data: {
                email,
                password: hashedPassword,
                username: username || user.username,
                isAnonymous: false,
            },
        });
        const parsedUser = parseUser(updatedUser);
        const { accessToken, refreshToken } = generateTokens(parsedUser);

        return {
            user: parsedUser,
            accessToken,
            refreshToken,
        };
    };
    createAccount = async (
        email: string,
        password: string,
        username?: string,
        phone?: string
    ) : Promise<AuthResponse> => {
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) throw new AppError("An user with this email already exists", 409);
        const existingPhoneUser = phone ? await this.userRepo.findByPhone(phone) : null;
        if (existingPhoneUser) throw new AppError("An user with this phone number already exists", 409);
        const hashedPassword = await hashPassword(password);
        const newUser = await this.userRepo.create({
            email,
            password: hashedPassword,
            ...(username && { username }),
            ...(phone && { phone }),
            isAnonymous: false,
        });
        const { accessToken, refreshToken } = generateTokens(newUser);
        return {
            user: newUser,
            accessToken,
            refreshToken,
        };
    }
}
