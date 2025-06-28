// For App Router
export async function GET() {
    try {
        const res = await fetch('https://zenquotes.io/api/random');
        const data = await res.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: "Failed to fetch quote" }, { status: 500 });
    }
} 