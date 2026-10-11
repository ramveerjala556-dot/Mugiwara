import React from 'react';
import { Folder, ArrowRight } from 'lucide-react';
import type { Project } from '../services/api.ts';

interface RecentProjectsProps {
  projects: Project[];
  onViewAll: () => void;
  onSelectProject: (project: Project) => void;
}

export const RecentProjects: React.FC<RecentProjectsProps> = ({
  projects,
  onViewAll,
  onSelectProject,
}) => {
  // Format relative timestamp
  const getRelativeTime = (isoString?: string, fallbackIndex?: number) => {
    if (!isoString) {
      if (fallbackIndex === 0) return 'Updated 2h ago';
      if (fallbackIndex === 1) return 'Updated 5h ago';
      return 'Updated 1d ago';
    }
    const diffHours = Math.round((Date.now() - new Date(isoString).getTime()) / (3600 * 1000));
    if (diffHours < 1) return 'Updated just now';
    if (diffHours < 24) return `Updated ${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    return `Updated ${diffDays}d ago`;
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'purple':
        return {
          bg: 'bg-purple-100 text-purple-700',
          bar: 'bg-purple-500',
        };
      case 'blue':
        return {
          bg: 'bg-blue-100 text-blue-700',
          bar: 'bg-blue-500',
        };
      case 'teal':
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-700',
          bar: 'bg-emerald-500',
        };
    }
  };

  const displayProjects = projects.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-slate-800" />
          <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
            Recent Projects
          </h4>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3.5 mt-1">
        {displayProjects.map((p, idx) => {
          const colors = getColorClasses(p.color);
          return (
            <div
              key={p.id}
              onClick={() => onSelectProject(p)}
              className="flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/80 p-1.5 rounded-xl transition-all"
            >
              {/* Icon & Name & Time */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
                >
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate group-hover:text-amber-600 transition-colors">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {getRelativeTime(p.updatedAt, idx)}
                  </div>
                </div>
              </div>

              {/* Progress Bar & Percentage */}
              <div className="flex items-center gap-2 shrink-0 w-28">
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${p.progress}%` }}
                    className={`h-full ${colors.bar} rounded-full transition-all duration-300`}
                  />
                </div>
                <span className="font-bold text-[11px] text-slate-700 w-7 text-right">
                  {p.progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
