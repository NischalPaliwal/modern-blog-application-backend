"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscriptionController_1 = require("../controllers/subscriptionController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.authMiddleware, subscriptionController_1.createSubscription);
router.get('/current', auth_1.authMiddleware, subscriptionController_1.getCurrentSubscription);
router.post('/cancel', auth_1.authMiddleware, subscriptionController_1.cancelSubscription);
exports.default = router;
