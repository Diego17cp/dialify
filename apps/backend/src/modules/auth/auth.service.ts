import { DatabaseConnection } from "@/config";
import { AppError, hashPassword, verifyPassword } from "@/core";
import { generateTokens, parseUser, verifyRefreshToken } from "./auth.utils";
import { User } from "../users/user.model";
import { AuthResponse } from "./auth.types";
import { UsersRepository } from "../users/users.repository";
import { consumeResetToken, createResetToken } from "./forgot-password";
import { sendResetEmail } from "./mailer";

export class AuthService {
	private db = DatabaseConnection.getInstance().getClient();
	private userRepo = new UsersRepository();

	login = async (
		email: string,
		password: string,
	): Promise<AuthResponse | null> => {
		const user = await this.db.user.findUnique({
			where: { email, isActive: true },
		});
		if (!user) return null;

		
		const isValid = await verifyPassword(user.password || "", password);
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

			const { accessToken, refreshToken: newRefreshToken } =
				generateTokens(currentUser);

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
		username?: string,
		phone?: string,
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
				phone: phone || user.phone,
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
		phone?: string,
	): Promise<AuthResponse> => {
		const existingUser = await this.userRepo.findByEmail(email);
		if (existingUser)
			throw new AppError("An user with this email already exists", 409);
		const existingPhoneUser = phone
			? await this.userRepo.findByPhone(phone)
			: null;
		if (existingPhoneUser)
			throw new AppError(
				"An user with this phone number already exists",
				409,
			);
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
	};

	requestPasswordReset = async (email: string) => {
		const user = await this.userRepo.findByEmail(email);
		if (!user) throw new AppError("User not found", 404);
		const token = createResetToken(email);
		await sendResetEmail(email, token, user.username || undefined);
		return true;
	};
	resetPassword = async (token: string, newPassword: string) => {
		if (!token) throw new AppError("Reset token is required", 400);
		if (!newPassword) throw new AppError("New password is required", 400);
		if (newPassword.length < 8)
			throw new AppError(
				"Password must be at least 8 characters long",
				400,
			);
		const email = consumeResetToken(token);
		if (!email) throw new AppError("Invalid or expired token", 400);
            const user = await this.userRepo.findByEmail(email);
		if (!user) throw new AppError("User not found", 404);
        if (user && !user.isActive) throw new AppError("User is inactive", 403);

		const hashed = await hashPassword(newPassword);
		await this.db.user.update({
			where: { email },
			data: { password: hashed },
		});
		return true;
	};
}
