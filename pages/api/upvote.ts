import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    const { questionId, direction } = req.body;
    if (!questionId || !['up', 'down'].includes(direction)) {
        return res.status(400).json({ error: 'Invalid request' });
    }
    const question = await prisma.question.update({
        where: { id: questionId },
        data: {
            votes: {
                increment: direction === 'up' ? 1 : -1,
            },
        },
    });
    return res.json(question);
} 