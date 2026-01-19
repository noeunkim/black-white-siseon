import { getSearchWithArticles, deleteSearch } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const result = getSearchWithArticles(id);

    if (!result) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Format response to match expected structure
    // We might need to adapt the structure if the frontend expects 'proArticles' etc.
    // The 'getSearchWithArticles' returns { search, articles[] }
    // We need to split articles into pro and con

    const proArticles = result.articles.filter(a => a.stance === 'pro');
    const conArticles = result.articles.filter(a => a.stance === 'con');

    return NextResponse.json({
        id: result.search.id,
        query: result.search.query,
        originalAnalysis: { stance: result.search.original_stance }, // fallback
        proArticles,
        conArticles,
        createdAt: result.search.created_at
    });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    deleteSearch(id);
    return NextResponse.json({ success: true });
}
