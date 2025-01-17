import { Request, Response } from "express";
import { prisma } from "../server";
import { z } from "zod";

const subscriptionSchema = z.object({
    plan: z.enum(["FREE", "PREMIUM", "PRO"]),
    duration: z.number().int().positive(),
});

export const createSubscription = async (req: Request, res: Response) => {
    try {
        const { plan, duration } = subscriptionSchema.parse(req.body);

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + duration);

        const subscription = await prisma.subscription.create({
            data: {
                plan: plan,
                endDate: endDate,
                user: {
                    connect: {
                        id: req.user.id,
                    },
                },
            },
        });

        res.status(201).json(subscription);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Invalid Input", errors: error.errors });
        }
        res.status(500).json({ message: "Server Error" });
    }
}

export const getCurrentSubscription = async (req: Request, res: Response) => {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: req.user.id,
                endDate: {
                    gte: new Date(),
                },
            },
            orderBy: {
                endDate: "desc",
            },
        });

        if (!subscription) {
            return res.status(404).json({ message: "No active subscription found!" });
        }

        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

export const cancelSubscription = async (req: Request, res: Response) => {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: req.user.id,
                endDate: {
                    gte: new Date(),
                },
            },
            orderBy: {
                endDate: "desc",
            },
        });

        if (!subscription) {
            return res.status(404).json({ message: "No active subscription found!" });
        }

        await prisma.subscription.update({
            where: {
                id: subscription.id,
            },
            data: {
                endDate: new Date(),
            }
        });

        res.json({ message: "Subscription cancelled successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}