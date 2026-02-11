import { Router } from "express";
import { RecommendationProfileController } from "./recommendationProfile.controller";

const router: Router = Router();
router.get("/profile", RecommendationProfileController.getProfile);
router.post("/profile/recompute", RecommendationProfileController.recomputeProfile);
router.get("/recommendations", RecommendationProfileController.getRecommendations);

export { router as recommendationProfileRoutes };