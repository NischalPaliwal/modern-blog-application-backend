import express, { RequestHandler } from "express";
import { createSubscription, getCurrentSubscription, cancelSubscription } from "../controllers/subscriptionController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post('/', authMiddleware, createSubscription);
router.get('/current', authMiddleware, getCurrentSubscription as RequestHandler);
router.post('/cancel', authMiddleware, cancelSubscription as RequestHandler);

export default router;