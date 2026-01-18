'use client';

import { cn } from '@/lib/utils';
import { ArticleData } from '@/types';
import { ExternalLink, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface ArticleCardProps {
  article: ArticleData;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isPro = article.stance === 'pro';
  const isYouTube = article.isYouTube && article.videoId;

  if (isYouTube) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className={cn(
          'group rounded-xl overflow-hidden border transition-all',
          'bg-white dark:bg-gray-900',
          isPro
            ? 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400'
            : 'border-rose-200 dark:border-rose-800 hover:border-rose-400'
        )}
      >
        <div className="relative aspect-video bg-black">
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="player"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${article.videoId}?autoplay=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="thumbnail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
                <Image
                  src={article.thumbnail || `https://img.youtube.com/vi/${article.videoId}/mqdefault.jpg`}
                  alt={article.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110',
                    'bg-red-600 text-white shadow-lg'
                  )}>
                    <Play className="w-6 h-6 ml-1" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold">
                    YouTube
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                'text-xs font-semibold px-2 py-1 rounded-full',
                isPro
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
              )}
            >
              {isPro ? '찬성' : '반대'}
            </span>
          </div>

          <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2">
            {article.title}
          </h3>

          {article.keyPoint && (
            <div
              className={cn(
                'text-xs font-medium px-2 py-1.5 rounded-lg',
                isPro
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200'
              )}
            >
              💡 {article.keyPoint}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        'group block rounded-xl overflow-hidden transition-all hover:shadow-xl',
        'border bg-white dark:bg-gray-900',
        isPro
          ? 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400'
          : 'border-rose-200 dark:border-rose-800 hover:border-rose-400'
      )}
    >
      <div
        className={cn(
          'h-2',
          isPro
            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
            : 'bg-gradient-to-r from-rose-400 to-rose-500'
        )}
      />

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className={cn(
              'text-xs font-semibold px-2 py-1 rounded-full',
              isPro
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
            )}
          >
            {article.source}
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:underline">
          {article.title}
        </h3>

        {article.keyPoint && (
          <div
            className={cn(
              'text-xs font-medium px-2 py-1.5 rounded-lg mb-2',
              isPro
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200'
            )}
          >
            💡 {article.keyPoint}
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {article.summary}
        </p>
      </div>
    </motion.a>
  );
}
