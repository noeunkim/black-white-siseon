'use client';

import { cn } from '@/lib/utils';
import { SearchResult } from '@/types';
import { ArticleCard } from './ArticleCard';
import { OriginalAnalysisCard } from './OriginalAnalysisCard';
import { motion } from 'framer-motion';
import { Scale, ThumbsDown, ThumbsUp } from 'lucide-react';

interface ComparisonViewProps {
  result: SearchResult;
}

export function ComparisonView({ result }: ComparisonViewProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <OriginalAnalysisCard
        analysis={result.originalAnalysis}
        query={result.query}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800">
          <Scale className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {result.topic} 관련 찬반 뉴스
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-700 dark:text-emerald-400">
                찬성 관점
              </h3>
              <p className="text-xs text-gray-500">
                {result.proArticles.length}개 기사
              </p>
            </div>
          </div>
          <div className="grid gap-3">
            {result.proArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <ThumbsDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-rose-700 dark:text-rose-400">
                반대 관점
              </h3>
              <p className="text-xs text-gray-500">
                {result.conArticles.length}개 기사
              </p>
            </div>
          </div>
          <div className="grid gap-3">
            {result.conArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={cn(
          'mt-8 p-6 rounded-2xl',
          'bg-gradient-to-br from-slate-50 to-slate-100',
          'dark:from-slate-800/50 dark:to-slate-900/50',
          'border border-slate-200 dark:border-slate-700'
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <Scale className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="font-bold">균형 잡힌 요약</h3>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {result.balancedSummary}
        </p>
      </motion.div>
    </div>
  );
}
