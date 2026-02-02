import { User } from "../users/user.model";

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
	user: User;
}

export type Platform = "web" | "ios" | "android";

export interface AuthContext {
	platform?: Platform;
	deviceId?: string;
}
