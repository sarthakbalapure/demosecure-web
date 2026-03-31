import { Router } from "express";
import {
  getScanById,
  getScanHistory,
  startConfigScan,
  startPortScan,
  startScan,
  startSqlScan,
  startSslScan,
  startXssScan
} from "../controllers/scanController.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { scanValidator } from "../utils/validators.js";

const router = Router();

router.use(protect);
router.get("/", getScanHistory);
router.post("/", scanValidator, validate, startScan);
router.post("/sql", scanValidator, validate, startSqlScan);
router.post("/xss", scanValidator, validate, startXssScan);
router.post("/ssl", scanValidator, validate, startSslScan);
router.post("/ports", scanValidator, validate, startPortScan);
router.post("/config", scanValidator, validate, startConfigScan);
router.get("/:id", getScanById);

export default router;
