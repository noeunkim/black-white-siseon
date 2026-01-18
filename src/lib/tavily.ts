import { tavily } from '@tavily/core';
import { extractSource } from './scraper';

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY! });

export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
  isYouTube?: boolean;
  videoId?: string;
  thumbnail?: string;
}

const BLOCKED_DOMAINS = [
  'huggingface.co',
  'github.com',
  'stackoverflow.com',
  'medium.com',
  'brunch.co.kr',
  'namu.wiki',
  'tistory.com',
  'velog.io',
  'notion.so',
  'wikipedia.org',
  'namuwiki.kr',
];

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

function isValidResult(result: { title: string; url: string; content: string }): boolean {
  const hasKoreanTitle = /[가-힣]/.test(result.title);
  if (!hasKoreanTitle) return false;

  const url = result.url.toLowerCase();
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return true;
  }

  for (const blocked of BLOCKED_DOMAINS) {
    if (url.includes(blocked)) return false;
  }

  if (result.content.length < 50) return false;

  return true;
}

function truncateQuery(query: string, maxLength: number = 80): string {
  if (query.length <= maxLength) return query;
  return query.slice(0, maxLength);
}

export async function searchKoreanNews(
  query: string,
  maxResults: number = 6
): Promise<TavilyResult[]> {
  const safeQuery = truncateQuery(query, 80);
  
  const response = await tavilyClient.search(safeQuery, {
    searchDepth: 'advanced',
    maxResults: maxResults * 2,
    includeAnswer: false,
    topic: 'general',
  });

  const seen = new Set<string>();
  const validResults = response.results
    .filter((r) => {
      const key = r.url.replace(/[?#].*$/, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return isValidResult(r);
    })
    .slice(0, maxResults);

  return validResults.map((result) => {
    const isYouTube = result.url.includes('youtube.com') || result.url.includes('youtu.be');
    const videoId = isYouTube ? extractYouTubeVideoId(result.url) : null;

    return {
      title: result.title,
      url: result.url,
      content: result.content,
      score: result.score,
      published_date: result.publishedDate,
      isYouTube,
      videoId: videoId || undefined,
      thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : undefined,
    };
  });
}

export async function searchBothStances(
  supportingQuery: string,
  opposingQuery: string,
  maxResults: number = 6
): Promise<{ supportingResults: TavilyResult[]; opposingResults: TavilyResult[] }> {
  const [supportingResults, opposingResults] = await Promise.all([
    searchKoreanNews(supportingQuery, maxResults),
    searchKoreanNews(opposingQuery, maxResults),
  ]);

  return { supportingResults, opposingResults };
}

export { extractSource, tavilyClient };
