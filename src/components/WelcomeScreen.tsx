'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Newspaper, Scale, Search, Zap } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: '뉴스 검색',
    description: 'URL 또는 주제 입력',
  },
  {
    icon: Scale,
    title: '관점 비교',
    description: '찬반 양론 동시 확인',
  },
  {
    icon: Zap,
    title: 'AI 분석',
    description: '핵심 논점 자동 추출',
  },
];

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div
          className={cn(
            'w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center',
            'bg-gradient-to-br from-gray-100 to-gray-200',
            'dark:from-gray-800 dark:to-gray-700',
            'shadow-lg'
          )}
        >
          <Newspaper className="w-10 h-10 text-gray-600 dark:text-gray-300" />
        </div>

        <h1 className="text-3xl font-bold mb-3">
          <span className="text-gray-900 dark:text-white">흑백</span>
          <span className="text-gray-500">시선</span>
        </h1>

        <p className="text-gray-500 max-w-md mx-auto mb-8">
          편향된 시각을 넘어 균형 잡힌 관점으로.
          <br />
          뉴스의 양면을 한눈에 확인하세요.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl',
                'bg-gray-100 dark:bg-gray-800/50',
                'border border-gray-200 dark:border-gray-700'
              )}
            >
              <feature.icon className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-2 text-sm text-gray-400">
          <p>예시: &quot;원전 확대 정책&quot;, &quot;기본소득 도입&quot;</p>
          <p>또는 뉴스 기사 URL을 직접 붙여넣기</p>
        </div>
      </motion.div>
    </div>
  );
}
