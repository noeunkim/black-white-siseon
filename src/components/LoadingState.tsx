'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Search, Sparkles, FileSearch, Scale } from 'lucide-react';

interface LoadingStateProps {
  stage: 'searching' | 'analyzing' | 'comparing';
}

const stages = {
  searching: {
    icon: Search,
    title: '뉴스 검색 중',
    description: '찬반 양측의 관련 기사를 수집하고 있습니다...',
  },
  analyzing: {
    icon: FileSearch,
    title: '기사 분석 중',
    description: 'AI가 각 기사의 핵심 내용을 파악하고 있습니다...',
  },
  comparing: {
    icon: Scale,
    title: '관점 비교 중',
    description: '양측 의견을 정리하고 균형 잡힌 요약을 준비합니다...',
  },
};

export function LoadingState({ stage }: LoadingStateProps) {
  const { icon: Icon, title, description } = stages[stage];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={cn(
            'absolute inset-0 rounded-full blur-xl',
            'bg-gradient-to-br from-blue-400/30 to-purple-400/30'
          )}
        />
        <div
          className={cn(
            'relative w-16 h-16 rounded-2xl flex items-center justify-center',
            'bg-gradient-to-br from-gray-100 to-gray-200',
            'dark:from-gray-800 dark:to-gray-700'
          )}
        >
          <Icon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </motion.div>
      </div>

      <h3 className="mt-6 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 text-center max-w-sm">
        {description}
      </p>

      <div className="flex gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [-2, 2, -2],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
          />
        ))}
      </div>
    </motion.div>
  );
}
