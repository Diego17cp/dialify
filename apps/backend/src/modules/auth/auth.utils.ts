import { env } from "@/config";
import { IUser, User } from "../users/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";
import crypto from "crypto";

const JWT_SECRET = env.JWT_SECRET;
const REFRESH_SECRET = env.JWT_SECRET_REFRESH;
const JWT_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "30d";

const parseUser = (user: IUser): User => {
	return {
		id: user.id,
		email: user.email,
		username: user.username,
		phone: user.phone,
		isAnonymous: user.isAnonymous,
		isActive: user.isActive,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		deletedAt: user.deletedAt,
	};
};

const generateTokens = (payload: User) => {
	const accessToken = jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
		issuer: "dialify-backend",
		audience: "dialify-client",
	});
	const refreshToken = jwt.sign(
		{ 
			userId: payload.id,
			jti: crypto.randomUUID()
		}, 
		REFRESH_SECRET, 
		{
			expiresIn: REFRESH_EXPIRES_IN,
		}
	);
	return { accessToken, refreshToken };
};

const verifyAccessToken = (token: string): JwtPayload | null => {
	try {
		return jwt.verify(token, JWT_SECRET) as JwtPayload;
	} catch (error) {
		return null;
	}
};
const verifyRefreshToken = (token: string): JwtPayload | null => {
	try {
		return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
	} catch (error) {
		return null;
	}
};
const isProd = env.NODE_ENV === "production";
const setAuthCookies = (
	res: Response,
	accessToken: string,
	refreshToken: string
) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: isProd,
		sameSite: "strict",
		maxAge: 15 * 60 * 1000, // 15 minutes
		path: "/",
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: isProd,
		sameSite: "strict",
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
		path: "/api/auth/refresh",
	});
};
const clearCookies = (res: Response) => {
	res.clearCookie("accessToken", {
        path: "/",
        httpOnly: true,
        secure: isProd,
        sameSite: "strict"
    });
    res.clearCookie("refreshToken", {
        path: "/api/auth/refresh",
        httpOnly: true,
        secure: isProd,
        sameSite: "strict"
    });
};

export {
    parseUser,
    generateTokens,
    verifyAccessToken,
    verifyRefreshToken,
    setAuthCookies,
    clearCookies
}