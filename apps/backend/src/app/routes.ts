import { Router } from "express";
import {
    authRoutes,
    playbackHistoryRoutes,
    usersRoutes
} from "@/modules";
// import { authGuard } from "./middlewares/authGuard";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/playback-history", playbackHistoryRoutes);


router.use("/", (_, res) => {
    res.json({ message: "Welcome to Dialify Backend API" });
})

export default router;