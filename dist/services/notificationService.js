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
exports.markNotificationAsRead = exports.getUnreadNotifications = exports.createNotification = void 0;
const server_1 = require("../server");
const createNotification = (userId, content) => __awaiter(void 0, void 0, void 0, function* () {
    return yield server_1.prisma.notification.create({
        data: {
            content: content,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
});
exports.createNotification = createNotification;
const getUnreadNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield server_1.prisma.notification.findMany({
        where: {
            userId: userId,
            read: false
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
});
exports.getUnreadNotifications = getUnreadNotifications;
const markNotificationAsRead = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield server_1.prisma.notification.updateMany({
        where: {
            userId: userId,
            id: id
        },
        data: {
            read: true
        }
    });
});
exports.markNotificationAsRead = markNotificationAsRead;
