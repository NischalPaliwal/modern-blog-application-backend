import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import authRoutes from "./routes/auth";
import articleRoutes from "./routes/article";
import commentRoutes from "./routes/comments";
import userRoutes from "./routes/user";
import subscriptionRoutes from "./routes/subscription";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});

app.use(limiter);

app.get('/health-check', (req: Request, res: Response) => {
  res.json({ message: "Health check endpoint!" });
});

app.use('/api/user', userRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/article', articleRoutes);
app.use('/api/subscription', subscriptionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, prisma };