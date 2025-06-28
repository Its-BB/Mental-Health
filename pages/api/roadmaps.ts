import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const roadmaps = await prisma.roadmap.findMany({ include: { user: true } });
        return res.json(roadmaps);
    }
    if (req.method === 'POST') {
        const { title, data, userId } = req.body;
        const roadmap = await prisma.roadmap.create({
            data: { title, data, userId },
        });
        return res.status(201).json(roadmap);
    }
    if (req.method === 'PUT') {
        const { id, title, data } = req.body;
        const roadmap = await prisma.roadmap.update({
            where: { id },
            data: { title, data },
        });
        return res.json(roadmap);
    }
    if (req.method === 'DELETE') {
        const { id } = req.body;
        await prisma.roadmap.delete({ where: { id } });
        return res.status(204).end();
    }
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
} 