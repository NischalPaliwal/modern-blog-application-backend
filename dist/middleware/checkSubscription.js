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
exports.checkSubscription = void 0;
const server_1 = require("../server");
const checkSubscription = (requiredPlan) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const subscription = yield server_1.prisma.subscription.findFirst({
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
        }
        catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    });
};
exports.checkSubscription = checkSubscription;
