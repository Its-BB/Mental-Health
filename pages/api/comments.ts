import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const comments = await prisma.comment.findMany({ include: { author: true } });
        return res.json(comments);
    }
    if (req.method === 'POST') {
        const { body, authorId, blogId, questionId } = req.body;
        const comment = await prisma.comment.create({
            data: { body, authorId, blogId, questionId },
        });
        return res.status(201).json(comment);
    }
    if (req.method === 'DELETE') {
        const { id } = req.body;
        await prisma.comment.delete({ where: { id } });
        return res.status(204).end();
    }
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
} 