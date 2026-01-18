import { getSearchWithArticles } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = getSearchWithArticles(id);

    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const proArticles = result.articles.filter((a) => a.stance === 'pro');
    const conArticles = result.articles.filter((a) => a.stance === 'con');

    return NextResponse.json({
      id: result.search.id,
      query: result.search.query,
      topic: result.search.query,
      originalAnalysis: {
        title: result.search.query,
        topic: result.search.query,
        stance: result.search.original_stance || 'neutral',
        summary: '이전에 검색한 결과입니다.',
        keyPoints: [],
      },
      proArticles: proArticles.map((a) => ({
        id: a.id,
        title: a.title,
        url: a.url,
        source: a.source,
        summary: a.summary,
        stance: a.stance,
        keyPoint: a.summary?.split('.')[0] || '',
      })),
      conArticles: conArticles.map((a) => ({
        id: a.id,
        title: a.title,
        url: a.url,
        source: a.source,
        summary: a.summary,
        stance: a.stance,
        keyPoint: a.summary?.split('.')[0] || '',
      })),
      balancedSummary: '',
      createdAt: result.search.created_at,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search' },
      { status: 500 }
    );
  }
}
