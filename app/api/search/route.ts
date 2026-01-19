import { analyzeAndGenerateSearchQueries, analyzeNewsWithClaude } from '@/lib/claude';
import { createArticle, createSearch, Article } from '@/lib/db';
import { searchBothStances } from '@/lib/tavily';
import { scrapeArticle } from '@/lib/scraper';
import { generateId } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const isUrl = query.startsWith('http://') || query.startsWith('https://');

        let originalContent: string | null = null;
        const shortQuery = query.slice(0, 20);
        let supportingQuery = `${shortQuery} 찬성 지지`;
        let opposingQuery = `${shortQuery} 반대 비판`;
        let originalStance: 'pro' | 'con' | 'neutral' = 'neutral';

        if (isUrl) {
            const article = await scrapeArticle(query);
            originalContent = article?.content || null;

            if (originalContent) {
                const searchAnalysis = await analyzeAndGenerateSearchQueries(originalContent);
                originalStance = searchAnalysis.originalStance;
                supportingQuery = searchAnalysis.supportingSearchQuery;
                opposingQuery = searchAnalysis.opposingSearchQuery;
            }
        }

        const { supportingResults, opposingResults } = await searchBothStances(
            supportingQuery,
            opposingQuery,
            5
        );

        const analysis = await analyzeNewsWithClaude(
            query,
            originalContent,
            supportingResults,
            opposingResults,
            originalStance
        );

        const searchId = generateId();
        createSearch(searchId, query, analysis.originalAnalysis.stance);

        const proArticles: Article[] = analysis.proArticles.map((article) => {
            const articleId = generateId();
            return createArticle({
                id: articleId,
                search_id: searchId,
                title: article.title,
                url: article.url,
                source: article.source,
                summary: article.summary,
                stance: 'pro',
                published_at: null,
            });
        });

        const conArticles: Article[] = analysis.conArticles.map((article) => {
            const articleId = generateId();
            return createArticle({
                id: articleId,
                search_id: searchId,
                title: article.title,
                url: article.url,
                source: article.source,
                summary: article.summary,
                stance: 'con',
                published_at: null,
            });
        });

        return NextResponse.json({
            id: searchId,
            query: query,
            topic: analysis.topic,
            originalAnalysis: analysis.originalAnalysis,
            proArticles: proArticles.map((a, i) => ({
                id: a.id,
                title: a.title,
                url: a.url,
                source: a.source,
                summary: a.summary,
                stance: a.stance,
                keyPoint: analysis.proArticles[i]?.keyPoint || '',
            })),
            conArticles: conArticles.map((a, i) => ({
                id: a.id,
                title: a.title,
                url: a.url,
                source: a.source,
                summary: a.summary,
                stance: a.stance,
                keyPoint: analysis.conArticles[i]?.keyPoint || '',
            })),
            balancedSummary: analysis.balancedSummary,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Failed to process search' },
            { status: 500 }
        );
    }
}
