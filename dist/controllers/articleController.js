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
exports.getArticlesByTag = exports.deleteArticle = exports.updateArticle = exports.getArticle = exports.upvote = exports.getMyOwnArticles = exports.getArticles = exports.createArticle = void 0;
const server_1 = require("../server");
const zod_1 = require("zod");
const articleSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    published: zod_1.z.boolean().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, published, tags } = articleSchema.parse(req.body);
        const article = yield server_1.prisma.article.create({
            data: {
                title,
                content,
                published: published || false,
                author: { connect: { id: req.user.id } },
                tags: {
                    connectOrCreate: (tags === null || tags === void 0 ? void 0 : tags.map(tag => ({
                        where: { name: tag },
                        create: { name: tag },
                    }))) || [],
                },
            },
            include: { tags: true },
        });
        res.status(201).json(article);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid input' });
    }
});
exports.createArticle = createArticle;
const getArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articles = yield server_1.prisma.article.findMany({
        where: { published: true },
        include: { author: true, tags: true },
    });
    res.json(articles);
});
exports.getArticles = getArticles;
const getMyOwnArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articles = yield server_1.prisma.article.findMany({
        where: {
            author: {
                id: req.user.id,
            },
        },
    });
    res.json(articles);
});
exports.getMyOwnArticles = getMyOwnArticles;
const upvote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield server_1.prisma.article.update({
        where: {
            id: Number(id),
        },
        data: {
            upvotes: {
                increment: 1
            },
        },
    });
    res.sendStatus(204);
});
exports.upvote = upvote;
const getArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const article = yield server_1.prisma.article.findUnique({
        where: { id: Number(id) },
        include: { author: true, tags: true, comments: { include: { author: true } } },
    });
    if (!article) {
        return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
});
exports.getArticle = getArticle;
const updateArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, content, published, tags } = articleSchema.parse(req.body);
        const article = yield server_1.prisma.article.update({
            where: { id: Number(id) },
            data: {
                title,
                content,
                published,
                tags: {
                    set: [],
                    connectOrCreate: (tags === null || tags === void 0 ? void 0 : tags.map(tag => ({
                        where: { name: tag },
                        create: { name: tag },
                    }))) || [],
                },
            },
            include: { tags: true },
        });
        res.json(article);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid input' });
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield server_1.prisma.article.delete({ where: { id: Number(id) } });
    res.status(204).send();
});
exports.deleteArticle = deleteArticle;
const getArticlesByTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tags, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    if (!tags || typeof tags !== 'string') {
        return res.status(400).json({ message: 'Tags are required and should be a comma-separated string' });
    }
    const tagArray = tags.split(',').map(tag => tag.trim());
    const articles = yield server_1.prisma.article.findMany({
        where: {
            published: true,
            tags: {
                some: {
                    name: {
                        in: tagArray,
                    }
                }
            }
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                },
            },
            tags: true,
        },
        skip: skip,
        take: Number(limit),
        orderBy: {
            createdAt: 'desc'
        },
    });
    const total = yield server_1.prisma.article.count({
        where: {
            published: true,
            tags: {
                some: {
                    name: {
                        in: tagArray,
                    },
                },
            },
        },
    });
    if (!articles) {
        return res.status(404).json({ message: 'Articles with given tag not found' });
    }
    res.json({
        articles,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
    });
});
exports.getArticlesByTag = getArticlesByTag;
