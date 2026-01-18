import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'heukbaek.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS searches (
    id TEXT PRIMARY KEY,
    query TEXT NOT NULL,
    original_stance TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    search_id TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    source TEXT,
    summary TEXT,
    stance TEXT NOT NULL,
    published_at TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (search_id) REFERENCES searches(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_articles_search_id ON articles(search_id);
  CREATE INDEX IF NOT EXISTS idx_searches_created_at ON searches(created_at DESC);
`);

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

// Search operations
export function createSearch(id: string, query: string, originalStance?: string): Search {
  const stmt = db.prepare(`
    INSERT INTO searches (id, query, original_stance)
    VALUES (?, ?, ?)
  `);
  stmt.run(id, query, originalStance || null);
  return getSearch(id)!;
}

export function getSearch(id: string): Search | null {
  const stmt = db.prepare('SELECT * FROM searches WHERE id = ?');
  return stmt.get(id) as Search | null;
}

export function getAllSearches(): Search[] {
  const stmt = db.prepare('SELECT * FROM searches ORDER BY created_at DESC LIMIT 50');
  return stmt.all() as Search[];
}

export function deleteSearch(id: string): void {
  const stmt = db.prepare('DELETE FROM searches WHERE id = ?');
  stmt.run(id);
}

// Article operations
export function createArticle(article: Omit<Article, 'created_at'>): Article {
  const stmt = db.prepare(`
    INSERT INTO articles (id, search_id, title, url, source, summary, stance, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    article.id,
    article.search_id,
    article.title,
    article.url,
    article.source,
    article.summary,
    article.stance,
    article.published_at
  );
  return getArticle(article.id)!;
}

export function getArticle(id: string): Article | null {
  const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
  return stmt.get(id) as Article | null;
}

export function getArticlesBySearchId(searchId: string): Article[] {
  const stmt = db.prepare('SELECT * FROM articles WHERE search_id = ? ORDER BY stance, created_at');
  return stmt.all(searchId) as Article[];
}

export function getSearchWithArticles(searchId: string): { search: Search; articles: Article[] } | null {
  const search = getSearch(searchId);
  if (!search) return null;
  const articles = getArticlesBySearchId(searchId);
  return { search, articles };
}

export default db;
