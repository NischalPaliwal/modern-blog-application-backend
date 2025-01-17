import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../server";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token  = req.header('Authorization')?.replace('Bearer', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate!' });
    }
}

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access forbidden"
            });
        }
        next();
    };
}