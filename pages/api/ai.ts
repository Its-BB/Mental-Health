import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

    try {
        console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'Present' : 'Missing');
        const apiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-small-3.2-24b-instruct:free',
                messages: [
                    { role: 'system', content: 'You are a helpful AI for learning recommendations.' },
                    { role: 'user', content: prompt },
                ],
                max_tokens: 150,
            }),
        });

        if (!apiRes.ok) {
            const error = await apiRes.text();
            console.error('OpenRouter API error:', error);
            return res.status(500).json({ error: 'OpenRouter error', details: error });
        }

        const data = await apiRes.json();
        const response = data.choices?.[0]?.message?.content || 'No response.';
        res.json({ response });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error', details: err instanceof Error ? err.message : String(err) });
    }
}
