"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationAsRead = exports.getUnreadNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
const getUnreadNotifications = (req, res) => {
    try {
        const notification = (0, notificationService_1.getUnreadNotifications)(req.user.id);
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUnreadNotifications = getUnreadNotifications;
const markNotificationAsRead = (req, res) => {
    try {
        const { id } = req.params;
        (0, notificationService_1.markNotificationAsRead)(Number(id), req.user.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
