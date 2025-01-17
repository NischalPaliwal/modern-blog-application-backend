import { Request, Response, NextFunction } from "express";
import { prisma } from "../server";

export const checkSubscription = (requiredPlan: 'PREMIUM' | 'PRO') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subscription = await prisma.subscription.findFirst({
                where: {
                    userId: req.user.id,
                    endDate: {
                        gte: new Date(),
                    },
                },
                orderBy: {
                    endDate: 'desc',
                },
            });

            if (!subscription) {
                return res.status(403).json({ message: "Active subscription required" });
            }

            if (requiredPlan === 'PRO' && subscription.plan !== 'PRO') {
                return res.status(403).json({ message: 'PRO subscription required' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
}