import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.query;
    let url = 'https://api.coursera.org/api/courses.v1?limit=24';
    if (query && typeof query === 'string' && query.trim().length > 0) {
        url = `https://api.coursera.org/api/courses.v1?q=search&query=${encodeURIComponent(query)}&limit=24`;
    }
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
} 