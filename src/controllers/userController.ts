import { prisma } from "../server";
import { Request, Response } from "express";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2).optional(),
    bio: z.string().optional()
});

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const{ name, bio } = profileSchema.parse(req.body);
        const updatedUser = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                name: name,
                bio: bio
            }
        });
    
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Invalid input' });
    }
}