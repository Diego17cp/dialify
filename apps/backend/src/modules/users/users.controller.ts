import { Response } from "express";
import { UsersService } from "./users.service";
import { AuthRequest } from "@/app";
import { AppError } from "@/core";
import { UpdateUser } from "./user.model";
import { clearCookies } from "../auth";

export class UsersController {
    private service = new UsersService();

    updateProfile = async (req: AuthRequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) throw new AppError("Unauthorized", 401);

        const { email, username, phone } = req.body;

        if (!email && !username && !phone) throw new AppError("At least one field must be provided", 400);

        const updateData: UpdateUser = {};
        if (email) updateData.email = email;
        if (username) updateData.username = username;
        if (phone) updateData.phone = phone;

        try {
            const updatedUser = await this.service.updateUser(userId, updateData);
            return res.json({
                success: true,
                data: { user: updatedUser },
                message: "Profile updated successfully",
            });
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Failed to update profile", 500);
        }
    };

    deleteAccount = async (req: AuthRequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) throw new AppError("Unauthorized", 401);
        try {
            await this.service.deleteUser(userId);
            if (req.platform === "web") clearCookies(res);
            return res.json({
                success: true,
                message: "Account deleted successfully",
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Failed to delete account", 500);
        }
    };
    // TODO: Add more user-related controller methods as needed like profile, etc
}