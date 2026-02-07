import { Router } from "express";
import { SearchController } from "./search.controller";

const router: Router = Router();
router.get("/", SearchController.search);

export { router as searchRoutes };