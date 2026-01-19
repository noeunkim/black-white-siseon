import { analyzeAndGenerateSearchQueries, analyzeNewsWithClaude } from '@/lib/claude';
import { createArticle, createSearch } from '@/lib/db';
import { searchBothStances } from '@/lib/tavily';
import { scrapeArticle, extractSource } from '@/lib/scraper';
import { isYouTubeUrl, getYouTubeTranscript, getYouTubeTitle, extractVideoId } from '@/lib/youtube';
import { generateId } from '@/lib/utils';
import { NextRequest } from 'next/server';
import { StreamEvent } from '@/types';

function createSSEMessage(event: StreamEvent): string {
    return `data: ${JSON.stringify(event)}\n\n`;
}

function extractYouTubeVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

export async function POST(request: NextRequest) {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
        return new Response('Query is required', { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: StreamEvent) => {
                controller.enqueue(encoder.encode(createSSEMessage(event)));
            };

            try {
                send({ type: 'start', message: '분석을 시작합니다...' });

                const isUrl = query.startsWith('http://') || query.startsWith('https://');
                const isYouTube = isYouTubeUrl(query);
                let originalContent: string | null = null;
                let supportingQuery = '';
                let opposingQuery = '';
                let topic = query;
                let originalStance: 'pro' | 'con' | 'neutral' = 'neutral';
                let stanceDescription = '';

                if (isYouTube) {
                    send({ type: 'fetch_original', message: 'YouTube 영상 자막을 추출하는 중...' });

                    const videoId = extractVideoId(query);
                    const [youtubeContent, videoTitle] = await Promise.all([
                        getYouTubeTranscript(query),
                        videoId ? getYouTubeTitle(videoId) : Promise.resolve('YouTube 영상'),
                    ]);

                    if (youtubeContent?.transcript) {
                        originalContent = youtubeContent.transcript;
                        send({
                            type: 'fetch_original',
                            message: `자막 추출 완료: "${videoTitle.slice(0, 40)}..."`,
                            data: { hasContent: true, title: videoTitle, source: 'YouTube' },
                        });
                    } else {
                        send({
                            type: 'fetch_original',
                            message: '자막 없음. 영상 제목으로 검색합니다.',
                            data: { hasContent: false },
                        });
                        if (videoId) {
                            topic = (await getYouTubeTitle(videoId)).slice(0, 30);
                        }
                    }
                } else if (isUrl) {
                    send({ type: 'fetch_original', message: '원문 기사를 가져오는 중...' });

                    const article = await scrapeArticle(query);

                    if (article?.content) {
                        originalContent = article.content;
                        send({
                            type: 'fetch_original',
                            message: `원문 로드 완료: "${article.title.slice(0, 40)}..."`,
                            data: { hasContent: true, title: article.title, source: article.source },
                        });
                    } else {
                        send({
                            type: 'fetch_original',
                            message: '원문을 가져올 수 없습니다.',
                            data: { hasContent: false },
                        });
                    }
                }

                if (originalContent) {
                    send({ type: 'extract_topic', message: 'AI가 콘텐츠 입장을 분석하는 중...' });

                    const searchAnalysis = await analyzeAndGenerateSearchQueries(originalContent);
                    topic = searchAnalysis.topic;
                    originalStance = searchAnalysis.originalStance;
                    supportingQuery = searchAnalysis.supportingSearchQuery;
                    opposingQuery = searchAnalysis.opposingSearchQuery;
                    stanceDescription = searchAnalysis.stanceDescription;

                    send({
                        type: 'extract_topic',
                        message: `분석 완료: ${stanceDescription}`,
                        data: { topic, stance: originalStance, supportingQuery, opposingQuery },
                    });
                } else {
                    const shortTopic = topic.slice(0, 20);
                    supportingQuery = `${shortTopic} 찬성 지지`;
                    opposingQuery = `${shortTopic} 반대 비판`;
                }

                send({
                    type: 'search_pro',
                    message: `찬반 뉴스 동시 검색 중...`
                });

                const { supportingResults, opposingResults } = await searchBothStances(
                    supportingQuery,
                    opposingQuery,
                    6
                );

                const supportingPreview = supportingResults.map((r) => {
                    const isYT = r.url.includes('youtube.com') || r.url.includes('youtu.be');
                    const videoId = isYT ? extractYouTubeVideoId(r.url) : null;
                    return {
                        id: generateId(),
                        title: r.title,
                        url: r.url,
                        source: isYT ? 'YouTube' : extractSource(r.url),
                        summary: '',
                        stance: 'pro' as const,
                        keyPoint: '',
                        isYouTube: isYT,
                        videoId: videoId || undefined,
                        thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : undefined,
                    };
                });

                const opposingPreview = opposingResults.map((r) => {
                    const isYT = r.url.includes('youtube.com') || r.url.includes('youtu.be');
                    const videoId = isYT ? extractYouTubeVideoId(r.url) : null;
                    return {
                        id: generateId(),
                        title: r.title,
                        url: r.url,
                        source: isYT ? 'YouTube' : extractSource(r.url),
                        summary: '',
                        stance: 'con' as const,
                        keyPoint: '',
                        isYouTube: isYT,
                        videoId: videoId || undefined,
                        thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : undefined,
                    };
                });

                send({
                    type: 'search_pro_done',
                    message: `같은 입장 ${supportingResults.length}개 발견`,
                    data: { articles: supportingPreview },
                });

                send({
                    type: 'search_con_done',
                    message: `반대 입장 ${opposingResults.length}개 발견`,
                    data: { articles: opposingPreview },
                });

                send({ type: 'analyze', message: 'AI가 종합 분석 중...' });

                const analysis = await analyzeNewsWithClaude(
                    query,
                    originalContent,
                    supportingResults,
                    opposingResults,
                    originalStance
                );

                const searchId = generateId();
                createSearch(searchId, query, analysis.originalAnalysis.stance);

                const proArticles = analysis.proArticles.map((article) => {
                    const articleId = generateId();
                    const isYT = article.url.includes('youtube.com') || article.url.includes('youtu.be');
                    const videoId = isYT ? extractYouTubeVideoId(article.url) : null;

                    createArticle({
                        id: articleId,
                        search_id: searchId,
                        title: article.title,
                        url: article.url,
                        source: article.source,
                        summary: article.summary,
                        stance: 'pro',
                        published_at: null,
                    });
                    return {
                        id: articleId,
                        title: article.title,
                        url: article.url,
                        source: isYT ? 'YouTube' : article.source,
                        summary: article.summary,
                        stance: 'pro' as const,
                        keyPoint: article.keyPoint,
                        isYouTube: isYT,
                        videoId: videoId || undefined,
                        thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : undefined,
                    };
                });

                const conArticles = analysis.conArticles.map((article) => {
                    const articleId = generateId();
                    const isYT = article.url.includes('youtube.com') || article.url.includes('youtu.be');
                    const videoId = isYT ? extractYouTubeVideoId(article.url) : null;

                    createArticle({
                        id: articleId,
                        search_id: searchId,
                        title: article.title,
                        url: article.url,
                        source: article.source,
                        summary: article.summary,
                        stance: 'con',
                        published_at: null,
                    });
                    return {
                        id: articleId,
                        title: article.title,
                        url: article.url,
                        source: isYT ? 'YouTube' : article.source,
                        summary: article.summary,
                        stance: 'con' as const,
                        keyPoint: article.keyPoint,
                        isYouTube: isYT,
                        videoId: videoId || undefined,
                        thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : undefined,
                    };
                });

                const result = {
                    id: searchId,
                    query,
                    topic: analysis.topic,
                    originalAnalysis: analysis.originalAnalysis,
                    proArticles,
                    conArticles,
                    balancedSummary: analysis.balancedSummary,
                    createdAt: new Date().toISOString(),
                };

                send({
                    type: 'complete',
                    message: '분석 완료!',
                    data: { result },
                });
            } catch (error) {
                console.error('Stream error:', error);
                send({
                    type: 'error',
                    message: error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.',
                });
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}
