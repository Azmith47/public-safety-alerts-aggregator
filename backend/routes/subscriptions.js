import express from "express";
import {
	createSubscription,
	confirmSubscription,
} from "../controllers/subscriptionsController.js";

const router = express.Router();

router.post("/", createSubscription);
router.get("/confirm/:token", confirmSubscription);

export default router;
