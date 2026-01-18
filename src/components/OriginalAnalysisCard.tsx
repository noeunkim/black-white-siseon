'use client';

import { cn } from '@/lib/utils';
import { OriginalAnalysis } from '@/types';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface OriginalAnalysisCardProps {
  analysis: OriginalAnalysis;
  query: string;
}

export function OriginalAnalysisCard({
  analysis,
  query,
}: OriginalAnalysisCardProps) {
  const stanceConfig = {
    pro: {
      icon: TrendingUp,
      label: '찬성 관점',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    con: {
      icon: TrendingDown,
      label: '반대 관점',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-200 dark:border-rose-800',
    },
    neutral: {
      icon: Minus,
      label: '중립 관점',
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-800/50',
      border: 'border-gray-200 dark:border-gray-700',
    },
  };

  const config = stanceConfig[analysis.stance];
  const StanceIcon = config.icon;
  const isUrl = query.startsWith('http');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl border-2 p-6 mb-8',
        config.border,
        config.bg
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
            'bg-white dark:bg-gray-800 shadow-sm'
          )}
        >
          <FileText className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
                config.bg,
                config.color
              )}
            >
              <StanceIcon className="w-3 h-3" />
              {config.label}
            </span>
          </div>

          <h2 className="text-lg font-bold mb-2 line-clamp-2">
            {analysis.title}
          </h2>

          {isUrl && (
            <a
              href={query}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline mb-2 block truncate"
            >
              {query}
            </a>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {analysis.summary}
          </p>

          <div className="flex flex-wrap gap-2">
            {analysis.keyPoints.map((point, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
