import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const questions = await prisma.question.findMany({ include: { author: true, comments: true } });
        return res.json(questions);
    }
    if (req.method === 'POST') {
        const { title, body, tags, authorId } = req.body;
        const question = await prisma.question.create({
            data: { title, body, tags, authorId },
        });
        return res.status(201).json(question);
    }
    if (req.method === 'PUT') {
        const { id, title, body, tags } = req.body;
        const question = await prisma.question.update({
            where: { id },
            data: { title, body, tags },
        });
        return res.json(question);
    }
    if (req.method === 'DELETE') {
        const { id } = req.body;
        await prisma.question.delete({ where: { id } });
        return res.status(204).end();
    }
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
} 