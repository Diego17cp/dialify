import { Router } from "express";
import { SearchHistoryController } from "./searchHistory.controller";
import { authGuard } from "@/app/middlewares";

const router: Router = Router();

router.get("/suggestions", authGuard, SearchHistoryController.getSuggestions);

export { router as searchHistoryRoutes };