"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articleController_1 = require("../controllers/articleController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/", auth_1.authMiddleware, (0, auth_1.authorizeRoles)('WRITER', 'EDITOR', 'ADMIN'), articleController_1.createArticle);
router.get("/", articleController_1.getArticles);
router.get("/tag", articleController_1.getArticlesByTag);
router.get("/:id", articleController_1.getArticle);
router.put("/:id", auth_1.authMiddleware, (0, auth_1.authorizeRoles)('WRITER', 'EDITOR', 'ADMIN'), articleController_1.updateArticle);
router.delete("/:id", auth_1.authMiddleware, (0, auth_1.authorizeRoles)('WRITER', 'EDITOR', 'ADMIN'), articleController_1.deleteArticle);
router.get("/my", auth_1.authMiddleware, articleController_1.getMyOwnArticles);
router.put("/upvote/:id", auth_1.authMiddleware, articleController_1.upvote);
exports.default = router;
