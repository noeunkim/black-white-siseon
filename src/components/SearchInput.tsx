'use client';

import { cn } from '@/lib/utils';
import { ArrowUp, Link2, Play } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface SearchInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function SearchInput({
  onSubmit,
  isLoading,
  placeholder = '뉴스 URL, YouTube 영상 또는 주제를 입력하세요...',
}: SearchInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  const isUrl = input.startsWith('http://') || input.startsWith('https://');
  const isYouTube = input.includes('youtube.com') || input.includes('youtu.be');

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div
        className={cn(
          'relative flex items-center gap-2 p-2 rounded-2xl border transition-all',
          'bg-card-bg border-border',
          'focus-within:border-gray-400 dark:focus-within:border-gray-600',
          'shadow-sm hover:shadow-md'
        )}
      >
        {isYouTube ? (
          <div className="pl-2">
            <Play className="w-5 h-5 text-red-500" />
          </div>
        ) : isUrl ? (
          <div className="pl-2">
            <Link2 className="w-5 h-5 text-blue-500" />
          </div>
        ) : null}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className={cn(
            'flex-1 bg-transparent px-3 py-2 text-base outline-none',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'disabled:opacity-50'
          )}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={cn(
            'p-2 rounded-xl transition-all',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            input.trim() && !isLoading
              ? 'bg-foreground text-background hover:opacity-80'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
          )}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500">
        뉴스 URL, YouTube 영상, 또는 관심 주제를 입력하면 반대 관점을 찾아드립니다
      </p>
    </form>
  );
}
