import { Request, Response } from 'express';
import { prisma } from '../server';
import { z } from 'zod';

const articleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, published, tags } = articleSchema.parse(req.body);
    const article = await prisma.article.create({
      data: {
        title,
        content,
        published: published || false,
        author: { connect: { id: req.user.id } },
        tags: {
          connectOrCreate: tags?.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: { tags: true },
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: 'Invalid input' });
  }
};

export const getArticles = async (req: Request, res: Response) => {
  const articles = await prisma.article.findMany({
    where: { published: true },
    include: { author: true, tags: true },
  });
  res.json(articles);
};

export const getMyOwnArticles = async (req: Request, res: Response) => {
  const articles = await prisma.article.findMany({
    where: {
      author: {
        id: req.user.id,
      },
    },
  });

  res.json(articles);
}

export const upvote = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.article.update({
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
}

export const getArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const article = await prisma.article.findUnique({
    where: { id: Number(id) },
    include: { author: true, tags: true, comments: { include: { author: true } } },
  });
  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }
  res.json(article);
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, published, tags } = articleSchema.parse(req.body);
    const article = await prisma.article.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        published,
        tags: {
          set: [],
          connectOrCreate: tags?.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: { tags: true },
    });
    res.json(article);
  } catch (error) {
    res.status(400).json({ message: 'Invalid input' });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.article.delete({ where: { id: Number(id) } });
  res.status(204).send();
};

export const getArticlesByTag = async (req: Request, res: Response) => {
  const { tags, page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  if (!tags || typeof tags !== 'string') {
    return res.status(400).json({ message: 'Tags are required and should be a comma-separated string' });
  }

  const tagArray = tags.split(',').map(tag => tag.trim());

  const articles = await prisma.article.findMany({
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

  const total = await prisma.article.count({
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
}