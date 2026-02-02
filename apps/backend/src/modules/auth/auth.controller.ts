import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRequest, extractPlatform } from "@/app";
import { clearCookies, setAuthCookies } from "./auth.utils";
import { AppError } from "@/core";

export class AuthController {
	private service = new AuthService();

	private sendAuthResponse = (
		res: Response,
		result: { user: any; accessToken: string; refreshToken: string },
		platform: string,
		message: string,
	) => {
		const { user, accessToken, refreshToken } = result;

		if (platform === "web") {
			setAuthCookies(res, accessToken, refreshToken);
			return res.json({
				success: true,
				data: { user },
				message,
			});
		}

		return res.json({
			success: true,
			data: { user, accessToken, refreshToken },
			message,
		});
	};

	login = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password)
			throw new AppError("Email and password are required", 400);

		const result = await this.service.login(email, password);

		if (!result) throw new AppError("Invalid credentials", 401);

		const platform = extractPlatform(req);
		return this.sendAuthResponse(res, result, platform, "Login successful");
	};

	loginAnonymous = async (req: Request, res: Response) => {
		const result = await this.service.loginAnonymous();
		const platform = extractPlatform(req);
		return this.sendAuthResponse(
			res,
			result,
			platform,
			"Anonymous session created",
		);
	};

	register = async (req: Request, res: Response) => {
		const { email, password, username, phone } = req.body;

		if (!email || !password)
			throw new AppError("Email and password are required", 400);

		const result = await this.service.createAccount(
			email,
			password,
			username,
			phone,
		);

		const platform = extractPlatform(req);
		return this.sendAuthResponse(
			res,
			result,
			platform,
			"Account created successfully",
		);
	};

	refresh = async (req: Request, res: Response) => {
		const platform = extractPlatform(req);
		const refreshToken =
			platform === "web"
				? req.cookies?.refreshToken
				: req.body.refreshToken;

		if (!refreshToken) throw new AppError("Refresh token is required", 400);

		const result = await this.service.refresh(refreshToken);

		if (!result)
			throw new AppError("Invalid or expired refresh token", 401);

		return this.sendAuthResponse(
			res,
			result,
			platform,
			"Token refreshed successfully",
		);
	};

	logout = async (req: Request, res: Response) => {
		const platform = extractPlatform(req);

		if (platform === "web") clearCookies(res);

		return res.json({
			success: true,
			message: "Logged out successfully",
		});
	};

	convertAnonymous = async (req: AuthRequest, res: Response) => {
		const { email, password, username, phone } = req.body;
		const userId = req.user?.id;

		if (!userId) throw new AppError("Unauthorized", 401);

		if (!email || !password)
			throw new AppError("Email and password are required", 400);

		const result = await this.service.convertAnonymousToRegistered(
			userId,
			email,
			password,
			username,
			phone,
		);

		const platform = extractPlatform(req);
		return this.sendAuthResponse(
			res,
			result,
			platform,
			"Account upgraded successfully",
		);
	};

	me = async (req: AuthRequest, res: Response) => {
		if (!req.user) throw new AppError("Unauthorized", 401);

		return res.json({
			success: true,
			data: { user: req.user },
		});
	};

	requestPasswordReset = async (req: Request, res: Response) => {
		const { email } = req.body;
		try {
			const result = await this.service.requestPasswordReset(email);
			if (result) {
				return res.json({
					success: true,
					message: "Password reset email sent",
				});
			}
			return res.status(400).json({
				success: false,
				message: "Failed to send password reset email",
			});
		} catch (error) {
			console.error("Error in requestPasswordReset controller:", error);
			return res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	};

	resetPassword = async (req: Request, res: Response) => {
		const { token, newPassword } = req.body;
		try {
			if (!token || !newPassword) {
				return res.status(400).json({
					success: false,
					message: "Token and new password are required",
					code: "MISSING_REQUIRED_FIELDS",
				});
			}
			if (newPassword.length < 8) {
				return res.status(400).json({
					success: false,
					message: "Password must be at least 8 characters long",
					code: "WEAK_PASSWORD",
				});
			}
			const result = await this.service.resetPassword(token, newPassword);
			if (result) {
				return res.json({
					success: true,
					message: "Password has been reset successfully",
				});
			}
			return res.status(400).json({
				success: false,
				message: "Failed to reset password",
			});
		} catch (error) {
			console.error("Error in resetPassword controller:", error);
			if (error instanceof AppError) {
				const statusCode = error.statusCode || 400;
				let code = "";
				if (error.message.includes("Invalid or expired")) {
					code = "INVALID_OR_EXPIRED_TOKEN";
				} else if (error.message.includes("User not found")) {
					code = "USER_NOT_FOUND";
				} else {
					code = "RESET_PASSWORD_ERROR";
				}
				return res.status(statusCode).json({
					success: false,
					message: error.message,
					code,
				});
			}
			return res.status(500).json({
				success: false,
				message: "Internal server error",
				code: "INTERNAL_SERVER_ERROR",
			});
		}
	};
}
