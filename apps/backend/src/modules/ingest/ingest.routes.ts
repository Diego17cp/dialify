import { Router } from "express";

const router: Router = Router();
import { IngestController } from "./ingest.controller";

router.post("/", IngestController.ingest);

export { router as ingestRoutes };