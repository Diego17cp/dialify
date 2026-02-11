import { Router } from "express";
import { SearchController } from "./search.controller";
import { SearchHistoryController } from "@/modules/search-history/searchHistory.controller";

const router: Router = Router();
router.get("/", SearchController.search);
router.get("/suggestions", SearchHistoryController.getSuggestions);

export { router as searchRoutes };