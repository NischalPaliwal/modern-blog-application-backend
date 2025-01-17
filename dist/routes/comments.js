"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const commentController_1 = require("../controllers/commentController");
const router = express_1.default.Router();
router.post("/create", auth_1.authMiddleware, commentController_1.createComment);
router.get("/get", commentController_1.getComments);
exports.default = router;
