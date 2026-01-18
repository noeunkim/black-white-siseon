export interface OriginalAnalysis {
  title: string;
  topic: string;
  stance: 'pro' | 'con' | 'neutral';
  summary: string;
  keyPoints: string[];
}

export interface SearchResult {
  id: string;
  query: string;
  topic: string;
  originalAnalysis: OriginalAnalysis;
  proArticles: ArticleData[];
  conArticles: ArticleData[];
  balancedSummary: string;
  createdAt: string;
}

export interface ArticleData {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  stance: 'pro' | 'con';
  keyPoint: string;
  isYouTube?: boolean;
  videoId?: string;
  thumbnail?: string;
}

export interface HistoryItem {
  id: string;
  query: string;
  createdAt: string;
}

export type StreamEventType =
  | 'start'
  | 'extract_topic'
  | 'fetch_original'
  | 'search_pro'
  | 'search_con'
  | 'search_pro_done'
  | 'search_con_done'
  | 'analyze'
  | 'analyze_progress'
  | 'complete'
  | 'error';

export interface StreamEvent {
  type: StreamEventType;
  message: string;
  data?: unknown;
}

export interface SearchProgress {
  currentStep: StreamEventType;
  message: string;
  proArticles: ArticleData[];
  conArticles: ArticleData[];
  isComplete: boolean;
  result?: SearchResult;
  error?: string;
}
