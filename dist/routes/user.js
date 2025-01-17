"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/notifications", auth_1.authMiddleware, notificationController_1.getUnreadNotifications);
router.put("/notifications/:id", auth_1.authMiddleware, notificationController_1.markNotificationAsRead);
router.put("/update", auth_1.authMiddleware, userController_1.updateProfile);
exports.default = router;
