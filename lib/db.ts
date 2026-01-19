import { generateId } from './utils';

// Types
export interface Search {
  id: string;
  query: string;
  original_stance: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  search_id: string;
  title: string;
  url: string | null;
  source: string | null;
  summary: string | null;
  stance: 'pro' | 'con' | 'neutral';
  published_at: string | null;
  created_at: string;
}

// In-memory storage (Global variables to survive hot-reloads in dev, but ephemeral in serverless)
// Note: In a real Vercel deployment, this data will likely disappear between requests or deployments.
const globalForStore = global as unknown as {
  searches: Map<string, Search>;
  articles: Map<string, Article>;
};

const searches = globalForStore.searches || new Map<string, Search>();
const articles = globalForStore.articles || new Map<string, Article>();

if (process.env.NODE_ENV !== 'production') {
  globalForStore.searches = searches;
  globalForStore.articles = articles;
}

// Search operations
export function createSearch(id: string, query: string, originalStance?: string): Search {
  const search: Search = {
    id,
    query,
    original_stance: originalStance || null,
    created_at: new Date().toISOString(),
  };
  searches.set(id, search);
  return search;
}

export function getSearch(id: string): Search | null {
  return searches.get(id) || null;
}

export function getAllSearches(): Search[] {
  return Array.from(searches.values()).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function deleteSearch(id: string): void {
  searches.delete(id);
  // Cleanup related articles
  for (const [articleId, article] of articles.entries()) {
    if (article.search_id === id) {
      articles.delete(articleId);
    }
  }
}

// Article operations
export function createArticle(articleData: Omit<Article, 'created_at'>): Article {
  const article: Article = {
    ...articleData,
    created_at: new Date().toISOString(),
  };
  articles.set(article.id, article);
  return article;
}

export function getArticle(id: string): Article | null {
  return articles.get(id) || null;
}

export function getArticlesBySearchId(searchId: string): Article[] {
  return Array.from(articles.values())
    .filter(article => article.search_id === searchId)
    .sort((a, b) => {
      // Sort by stance first, then created_at
      if (a.stance !== b.stance) return a.stance.localeCompare(b.stance);
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
}

export function getSearchWithArticles(searchId: string): { search: Search; articles: Article[] } | null {
  const search = getSearch(searchId);
  if (!search) return null;
  const searchArticles = getArticlesBySearchId(searchId);
  return { search, articles: searchArticles };
}

export default {
  searches,
  articles
};
