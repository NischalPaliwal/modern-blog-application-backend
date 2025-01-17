import { Request, Response } from "express";
import { getUnreadNotifications as getUnread, markNotificationAsRead as markAsRead } from "../services/notificationService";

export const getUnreadNotifications = (req: Request, res: Response) => {
    try {
        const notification = getUnread(req.user.id);
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const markNotificationAsRead = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        markAsRead(Number(id), req.user.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}