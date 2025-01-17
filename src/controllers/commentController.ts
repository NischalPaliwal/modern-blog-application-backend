import { Request, Response } from "express";
import { prisma } from "../server";
import { createNotification } from "../services/notificationService";

export const createComment = async (req: Request, res: Response) => {
    try {
        const { content, articleId } = req.body;
        const comment = await prisma.comment.create({
            data: {
                content: content,
                author: {
                    connect: {
                        id: req.user.id
                    }
                },
                article: {
                    connect: {
                        id: Number(articleId)
                    }
                }
            },
            include: {
                author: true,
                article: true
            }
        });

        if (comment.article.authorId !== req.user.id) {
            await createNotification(comment.article.authorId, `New comment on your article "${comment.article.title}"`);
        }

        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: 'Invalid input' });
    }
}

export const getComments = async (req: Request, res: Response) => {
    try {
        const { articleId } = req.body;
        const comments = await prisma.comment.findMany({
            where: {
                articleId: articleId
            }
        });
        res.send(comments);
    } catch (error) {
        res.status(404).json({ message: 'No comments found!' });
    }
}