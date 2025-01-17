import express, { RequestHandler } from "express";
import { createArticle, getArticles, getArticle, updateArticle, deleteArticle, getArticlesByTag, getMyOwnArticles, upvote } from "../controllers/articleController";
import { authMiddleware, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles('WRITER', 'EDITOR', 'ADMIN') as RequestHandler, createArticle);
router.get("/", getArticles);
router.get("/tag", getArticlesByTag as RequestHandler);
router.get("/:id", getArticle as RequestHandler);
router.put("/:id", authMiddleware, authorizeRoles('WRITER', 'EDITOR', 'ADMIN') as RequestHandler, updateArticle);
router.delete("/:id", authMiddleware, authorizeRoles('WRITER', 'EDITOR', 'ADMIN') as RequestHandler, deleteArticle);
router.get("/my", authMiddleware, getMyOwnArticles);
router.put("/upvote/:id", authMiddleware, upvote);

export default router;