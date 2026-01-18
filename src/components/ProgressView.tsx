'use client';

import { cn } from '@/lib/utils';
import { ArticleData, StreamEventType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface ProgressStep {
  id: StreamEventType;
  label: string;
  description: string;
}

const STEPS: ProgressStep[] = [
  { id: 'start', label: '초기화', description: '분석 준비' },
  { id: 'fetch_original', label: '원문 수집', description: '콘텐츠 로드' },
  { id: 'extract_topic', label: '주제 추출', description: 'AI 분석' },
  { id: 'search_pro', label: '찬성 검색', description: '뉴스 수집' },
  { id: 'search_con', label: '반대 검색', description: '뉴스 수집' },
  { id: 'analyze', label: 'AI 분석', description: '종합 분석' },
  { id: 'complete', label: '완료', description: '결과 생성' },
];

interface ProgressViewProps {
  currentStep: StreamEventType;
  message: string;
  proArticles: ArticleData[];
  conArticles: ArticleData[];
}

export function ProgressView({
  currentStep,
  message,
  proArticles,
  conArticles,
}: ProgressViewProps) {
  const getCurrentStepIndex = () => {
    if (currentStep === 'search_pro_done') return 3;
    if (currentStep === 'search_con_done') return 4;
    if (currentStep === 'analyze_progress') return 5;
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    return idx >= 0 ? idx : 0;
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-200 dark:bg-gray-800" />
          <div 
            className="absolute top-4 left-0 h-[2px] bg-emerald-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
          />
          
          {STEPS.map((step, index) => {
            const isActive = index === currentIndex;
            const isComplete = index < currentIndex;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isActive ? 1 : 0.9 }}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                    isComplete && 'bg-emerald-500 text-white',
                    isActive && 'bg-blue-500 text-white ring-4 ring-blue-500/20',
                    !isComplete && !isActive && 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                  )}
                >
                  {isComplete ? '✓' : index + 1}
                </motion.div>
                <div className="mt-2 text-center">
                  <p className={cn(
                    'text-xs font-semibold',
                    isActive && 'text-blue-500',
                    isComplete && 'text-emerald-500',
                    !isActive && !isComplete && 'text-gray-400'
                  )}>
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <motion.div
        key={message}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          {currentIndex < STEPS.length - 1 && (
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{message}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ArticleSection
          title="찬성 관점"
          articles={proArticles}
          stance="pro"
          isSearching={currentIndex === 3}
          isComplete={currentIndex > 3}
        />
        <ArticleSection
          title="반대 관점"
          articles={conArticles}
          stance="con"
          isSearching={currentIndex === 4}
          isComplete={currentIndex > 4}
        />
      </div>

      {currentIndex >= 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-blue-700 dark:text-blue-300">AI 종합 분석 중</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">{message}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ArticleSection({
  title,
  articles,
  stance,
  isSearching,
  isComplete,
}: {
  title: string;
  articles: ArticleData[];
  stance: 'pro' | 'con';
  isSearching: boolean;
  isComplete: boolean;
}) {
  const isPro = stance === 'pro';

  return (
    <div className={cn(
      'rounded-2xl border-2 p-5 transition-all duration-300',
      isPro ? 'border-emerald-200 dark:border-emerald-800' : 'border-rose-200 dark:border-rose-800',
      isSearching && (isPro ? 'ring-2 ring-emerald-500/30' : 'ring-2 ring-rose-500/30')
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-3 h-3 rounded-full',
            isPro ? 'bg-emerald-500' : 'bg-rose-500',
            isSearching && 'animate-pulse'
          )} />
          <h3 className={cn(
            'font-bold',
            isPro ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
          )}>
            {title}
          </h3>
        </div>
        {articles.length > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {articles.length}개
          </span>
        )}
      </div>

      <div className="space-y-2 min-h-[180px]">
        {isSearching && articles.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">검색 중...</span>
            </div>
          </div>
        )}

        <AnimatePresence>
          {articles.map((article, index) => (
            <motion.a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: isPro ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className={cn(
                'block p-3 rounded-lg border transition-all hover:shadow-md group',
                isPro
                  ? 'border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-900/10'
                  : 'border-rose-100 dark:border-rose-900 hover:border-rose-300 dark:hover:border-rose-700 bg-rose-50/30 dark:bg-rose-900/10'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded',
                      isPro
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-800 dark:text-rose-200'
                    )}>
                      {article.source}
                    </span>
                  </div>
                  <p className="text-sm font-medium line-clamp-2 group-hover:underline">
                    {article.title}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-gray-300 group-hover:text-gray-500" />
              </div>
            </motion.a>
          ))}
        </AnimatePresence>

        {isComplete && articles.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <span className="text-sm">검색 결과 없음</span>
          </div>
        )}
      </div>
    </div>
  );
}
