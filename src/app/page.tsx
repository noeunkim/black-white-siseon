'use client';

import { ComparisonView } from '@/components/ComparisonView';
import { ProgressView } from '@/components/ProgressView';
import { SearchInput } from '@/components/SearchInput';
import { Sidebar } from '@/components/Sidebar';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ArticleData, HistoryItem, SearchResult, StreamEvent, StreamEventType } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentSearchId, setCurrentSearchId] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState<StreamEventType>('start');
  const [progressMessage, setProgressMessage] = useState('');
  const [proArticles, setProArticles] = useState<ArticleData[]>([]);
  const [conArticles, setConArticles] = useState<ArticleData[]>([]);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/history');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchResult(null);
    setCurrentStep('start');
    setProgressMessage('분석을 시작합니다...');
    setProArticles([]);
    setConArticles([]);

    try {
      const response = await fetch('/api/search/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event: StreamEvent = JSON.parse(line.slice(6));
              
              setCurrentStep(event.type);
              setProgressMessage(event.message);

              if (event.type === 'search_pro_done' && event.data) {
                const data = event.data as { articles: ArticleData[] };
                setProArticles(data.articles);
              }

              if (event.type === 'search_con_done' && event.data) {
                const data = event.data as { articles: ArticleData[] };
                setConArticles(data.articles);
              }

              if (event.type === 'complete' && event.data) {
                const data = event.data as { result: SearchResult };
                setSearchResult(data.result);
                setCurrentSearchId(data.result.id);
                await fetchHistory();
              }

              if (event.type === 'error') {
                throw new Error(event.message);
              }
            } catch (parseError) {
              console.error('Parse error:', parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSearch = async (id: string) => {
    try {
      const response = await fetch(`/api/history/${id}`);
      if (response.ok) {
        const result = await response.json();
        setSearchResult(result);
        setCurrentSearchId(id);
      }
    } catch (error) {
      console.error('Failed to load search:', error);
    }
  };

  const handleNewSearch = () => {
    setSearchResult(null);
    setCurrentSearchId(null);
    setProArticles([]);
    setConArticles([]);
  };

  const handleDeleteSearch = async (id: string) => {
    try {
      await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
      if (currentSearchId === id) {
        setSearchResult(null);
        setCurrentSearchId(null);
      }
      await fetchHistory();
    } catch (error) {
      console.error('Failed to delete search:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        history={history}
        currentSearchId={currentSearchId}
        onSelectSearch={handleSelectSearch}
        onNewSearch={handleNewSearch}
        onDeleteSearch={handleDeleteSearch}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {isLoading ? (
            <ProgressView
              currentStep={currentStep}
              message={progressMessage}
              proArticles={proArticles}
              conArticles={conArticles}
            />
          ) : searchResult ? (
            <ComparisonView result={searchResult} />
          ) : (
            <WelcomeScreen />
          )}
        </div>

        <div className="p-4 border-t border-border bg-background">
          <SearchInput
            onSubmit={handleSearch}
            isLoading={isLoading}
            placeholder={
              searchResult
                ? '다른 주제를 검색하세요...'
                : '뉴스 URL 또는 주제를 입력하세요...'
            }
          />
        </div>
      </main>
    </div>
  );
}
