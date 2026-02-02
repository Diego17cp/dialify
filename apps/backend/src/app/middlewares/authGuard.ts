import { AppError } from "@/core";
import { Platform, verifyAccessToken } from "@/modules/auth";
import { User } from "@/modules/users";
import { NextFunction, Request, Response } from "express";

export interface AuthRequest extends Request {
    user?: User;
    platform?: Platform;
}

export const extractPlatform = (req: AuthRequest): Platform => {
    const platformHeader = req.headers["X-Client-Platform"] || req.headers["x-client-platform"];
    const platform = Array.isArray(platformHeader) ? platformHeader[0] : platformHeader;
    return (platform as Platform) || "web";
}

// Requires token, independient if is anonymous or registered user
export const authGuard = (req: AuthRequest, _: Response, next: NextFunction) => {
    req.platform = extractPlatform(req);
    const token = req.platform !== "web"
        ? req.headers.authorization?.replace("Bearer ", "")
        : req.cookies.accessToken;
    if (!token) throw new AppError("Unauthorized", 401);
    const decoded = verifyAccessToken(token);
    if (!decoded) throw new AppError("Invalid token", 401);
    req.user = decoded as User;
    next();
}

// Only registered users
export const registeredUserGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
    authGuard(req, res, () => {
        if (req.user?.isAnonymous) throw new AppError("This action requires registration", 403);
        next();
    });
}

// No required token
export const optionalAuthGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
    req.platform = extractPlatform(req);
    const token = req.platform !== "web"
        ? req.headers.authorization?.replace("Bearer ", "")
        : req.cookies.accessToken;
    if (token) {
        const decoded = verifyAccessToken(token);
        if (decoded) req.user = decoded as User;
    }
    next();
}