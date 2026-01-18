'use client';

import { cn, formatDate, truncateText } from '@/lib/utils';
import { HistoryItem } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  Search,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  history: HistoryItem[];
  currentSearchId: string | null;
  onSelectSearch: (id: string) => void;
  onNewSearch: () => void;
  onDeleteSearch: (id: string) => void;
}

export function Sidebar({
  history,
  currentSearchId,
  onSelectSearch,
  onNewSearch,
  onDeleteSearch,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar-bg text-white transition-all duration-300',
        isCollapsed ? 'w-0 md:w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        {!isCollapsed && (
          <button
            onClick={onNewSearch}
            className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors"
          >
            <MessageSquarePlus className="w-5 h-5" />
            <span className="text-sm font-medium">새 검색</span>
          </button>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {history.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">검색 기록이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-1 px-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                    currentSearchId === item.id
                      ? 'bg-sidebar-hover'
                      : 'hover:bg-sidebar-hover'
                  )}
                  onClick={() => onSelectSearch(item.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      {truncateText(item.query, 25)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                  {hoveredId === item.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSearch(item.id);
                      }}
                      className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isCollapsed && (
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <span className="text-xs font-medium">흑백</span>
            </div>
            <span className="text-sm font-medium">흑백시선</span>
          </div>
        </div>
      )}
    </aside>
  );
}
