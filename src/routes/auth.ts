import express from "express";
import { register, login } from "../controllers/authController";
import { RequestHandler } from "express";

const router = express.Router();

router.post('/register', (register) as RequestHandler);
router.post('/login', (login) as RequestHandler);

export default router;