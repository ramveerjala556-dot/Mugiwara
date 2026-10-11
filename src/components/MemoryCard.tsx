import React from 'react';
import { Brain, ArrowRight, Layers, Lightbulb, Wrench, AlertTriangle } from 'lucide-react';
import type { Memory } from '../services/api.ts';

interface MemoryCardProps {
  memories: Memory[];
  onViewAll: () => void;
  onSelectMemory: (memory: Memory) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memories,
  onViewAll,
  onSelectMemory,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tech':
        return {
          icon: <Layers className="w-3.5 h-3.5 text-sky-600" />,
          bg: 'bg-sky-100 border-sky-200',
        };
      case 'Ideas':
        return {
          icon: <Lightbulb className="w-3.5 h-3.5 text-amber-600" />,
          bg: 'bg-amber-100 border-amber-200',
        };
      case 'Tools':
        return {
          icon: <Wrench className="w-3.5 h-3.5 text-purple-600" />,
          bg: 'bg-purple-100 border-purple-200',
        };
      case 'Debug':
      default:
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
          bg: 'bg-rose-100 border-rose-200',
        };
    }
  };

  const displayList = memories.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-slate-800" />
          <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
            Memory
          </h4>
          <span className="text-[11px] font-semibold text-slate-400">
            {memories.length} items
          </span>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Memory Items List */}
      <div className="space-y-3">
        {displayList.map((mem) => {
          const cat = getCategoryIcon(mem.category);
          return (
            <div
              key={mem.id}
              onClick={() => onSelectMemory(mem)}
              className="flex items-start gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              {/* Category Icon Badge */}
              <div
                className={`w-6 h-6 rounded-lg ${cat.bg} border flex items-center justify-center shrink-0 mt-0.5 shadow-2xs group-hover:scale-105 transition-transform`}
              >
                {cat.icon}
              </div>

              {/* Title & Content */}
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-800 group-hover:text-amber-600 transition-colors truncate">
                  {mem.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {mem.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
