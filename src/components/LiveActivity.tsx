import React from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import type { Activity } from '../services/api.ts';

interface LiveActivityProps {
  activities: Activity[];
}

export const LiveActivity: React.FC<LiveActivityProps> = ({ activities }) => {
  // Format relative timestamp
  const getRelativeTime = (isoString?: string, fallbackIndex?: number) => {
    if (!isoString) {
      const times = ['2m ago', '3m ago', '5m ago', '8m ago', '12m ago'];
      return times[fallbackIndex ?? 0] || 'Recently';
    }
    const diffMinutes = Math.round((Date.now() - new Date(isoString).getTime()) / (60 * 1000));
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.round(diffMinutes / 60);
    return `${diffHours}h ago`;
  };

  const defaultItems = [
    { id: '1', action: 'Analyzing your request', time: '2m ago' },
    { id: '2', action: 'Searching the web', time: '3m ago' },
    { id: '3', action: 'Generating plan', time: '5m ago' },
    { id: '4', action: 'Executing tasks', time: '8m ago' },
    { id: '5', action: 'Verifying results', time: '12m ago' },
  ];

  const displayList = activities.length > 0
    ? activities.slice(0, 5).map((a, i) => ({
        id: a.id,
        action: a.action,
        time: getRelativeTime(a.createdAt, i),
      }))
    : defaultItems;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ActivityIcon className="w-5 h-5 text-slate-800" />
          <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
            Live Activity
          </h4>
        </div>

        {/* Badge: ● Working */}
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Working
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3">
        {displayList.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-xs py-0.5 group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ring-4 ring-emerald-50 group-hover:bg-emerald-500 transition-colors" />
              <span className="font-medium text-slate-800 truncate">
                {item.action}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 shrink-0">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
