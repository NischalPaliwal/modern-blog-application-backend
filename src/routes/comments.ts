import express from "express";
import { authMiddleware } from "../middleware/auth";
import { createComment, getComments } from "../controllers/commentController";

const router = express.Router();

router.post("/create", authMiddleware, createComment);
router.get("/get", getComments);

export default router;