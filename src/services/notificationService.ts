import { prisma } from "../server";

export const createNotification = async (userId: number, content: string) => {
    return await prisma.notification.create({
        data: {
           content: content,
           user: {
            connect: {
                id: userId
            }
           } 
        }
    });
}

export const getUnreadNotifications = async (userId: number) => {
    return await prisma.notification.findMany({
        where: {
            userId: userId,
            read: false
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export const markNotificationAsRead = async (id: number, userId: number) => {
    return await prisma.notification.updateMany({
        where: {
            userId: userId,
            id: id
        },
        data: {
            read: true
        }
    });
}