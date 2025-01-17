import express from "express";
import { markNotificationAsRead, getUnreadNotifications } from "../controllers/notificationController";
import { updateProfile } from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/notifications", authMiddleware, getUnreadNotifications);
router.put("/notifications/:id", authMiddleware, markNotificationAsRead);
router.put("/update", authMiddleware, updateProfile);

export default router;