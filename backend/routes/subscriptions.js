import express from "express";
import {
	createSubscription,
	handleMailchimpWebhook,
} from "../controllers/subscriptionsController.js";

const router = express.Router();

router.post("/", createSubscription);
router.post("/mailchimp/webhook", handleMailchimpWebhook);

export default router;
