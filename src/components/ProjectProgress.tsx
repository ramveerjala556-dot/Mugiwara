import React from 'react';
import { BarChart2, ArrowRight } from 'lucide-react';
import type { Project } from '../services/api.ts';

interface ProjectProgressProps {
  projects: Project[];
  onViewAll: () => void;
  onSelectProject: (project: Project) => void;
}

export const ProjectProgress: React.FC<ProjectProgressProps> = ({
  projects,
  onViewAll,
  onSelectProject,
}) => {
  // Color styling mapping
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
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-slate-800" />
            <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Project Progress
            </h4>
          </div>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            {projects.length} active {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-3.5 mt-2">
        {displayProjects.map((p) => {
          const colors = getColorClasses(p.color);
          return (
            <div
              key={p.id}
              onClick={() => onSelectProject(p)}
              className="group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-md ${colors.bg} flex items-center justify-center font-bold text-[10px] shadow-2xs`}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                    {p.name}
                  </span>
                </div>
                <span className="font-bold text-slate-700 text-xs">
                  {p.progress}%
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${p.progress}%` }}
                  className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
