import { Router } from "express";
import {
    authRoutes
} from "@/modules";
import { authGuard } from "./middlewares/authGuard";

const router: Router = Router();

router.use("/auth", authRoutes);



router.use("/", (_, res) => {
    res.json({ message: "Welcome to Dialify Backend API" });
})

export default router;