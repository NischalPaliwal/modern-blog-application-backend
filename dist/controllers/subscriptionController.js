"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelSubscription = exports.getCurrentSubscription = exports.createSubscription = void 0;
const server_1 = require("../server");
const zod_1 = require("zod");
const subscriptionSchema = zod_1.z.object({
    plan: zod_1.z.enum(["FREE", "PREMIUM", "PRO"]),
    duration: zod_1.z.number().int().positive(),
});
const createSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { plan, duration } = subscriptionSchema.parse(req.body);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + duration);
        const subscription = yield server_1.prisma.subscription.create({
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: "Invalid Input", errors: error.errors });
        }
        res.status(500).json({ message: "Server Error" });
    }
});
exports.createSubscription = createSubscription;
const getCurrentSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscription = yield server_1.prisma.subscription.findFirst({
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
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getCurrentSubscription = getCurrentSubscription;
const cancelSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscription = yield server_1.prisma.subscription.findFirst({
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
        yield server_1.prisma.subscription.update({
            where: {
                id: subscription.id,
            },
            data: {
                endDate: new Date(),
            }
        });
        res.json({ message: "Subscription cancelled successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.cancelSubscription = cancelSubscription;
