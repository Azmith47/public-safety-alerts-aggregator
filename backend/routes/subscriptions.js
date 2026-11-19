import express from "express";
import {
	createSubscription,
	confirmSubscription,
	getSubscriptionsByEmail,
	deleteSubscription,
} from "../controllers/subscriptionsController.js";

const router = express.Router();

router.post("/", createSubscription);
router.get("/confirm/:token", confirmSubscription);
router.get("/", getSubscriptionsByEmail); // GET /api/subscriptions?email=...
router.delete("/:id", deleteSubscription);

export default router;
