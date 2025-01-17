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
exports.getComments = exports.createComment = void 0;
const server_1 = require("../server");
const notificationService_1 = require("../services/notificationService");
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, articleId } = req.body;
        const comment = yield server_1.prisma.comment.create({
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
            yield (0, notificationService_1.createNotification)(comment.article.authorId, `New comment on your article "${comment.article.title}"`);
        }
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid input' });
    }
});
exports.createComment = createComment;
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId } = req.body;
        const comments = yield server_1.prisma.comment.findMany({
            where: {
                articleId: articleId
            }
        });
        res.send(comments);
    }
    catch (error) {
        res.status(404).json({ message: 'No comments found!' });
    }
});
exports.getComments = getComments;
