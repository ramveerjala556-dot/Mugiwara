import React from 'react';
import { Plus, ArrowRight, Folder, CheckSquare } from 'lucide-react';
import type { Project, Task } from '../services/api.ts';

interface WorkspaceViewProps {
  projects: Project[];
  tasks: Task[];
  onSelectProject: (p: Project) => void;
  onSelectTask: (t: Task) => void;
  onOpenNewProject: () => void;
  onOpenNewTask: () => void;
  onToggleTaskStatus: (t: Task) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  projects,
  tasks,
  onSelectProject,
  onSelectTask,
  onOpenNewProject,
  onOpenNewTask,
  onToggleTaskStatus,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Captain's Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Unified command deck for active projects and ongoing crew tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewProject}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Project
          </button>
          <button
            onClick={onOpenNewTask}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects Column */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Folder className="w-4 h-4 text-emerald-600" />
                Active Expeditions ({projects.length})
              </h3>
            </div>

            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-all cursor-pointer border border-slate-100 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                      {p.name}
                    </h4>
                    <span className="text-xs font-bold text-slate-700">{p.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                    <div
                      style={{ width: `${p.progress}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {p.description || 'In progress'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Tasks Column */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                Immediate Tasks ({tasks.length})
              </h3>
            </div>

            <div className="space-y-2.5">
              {tasks.map((t) => {
                const isDone = t.status === 'completed';
                return (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-all border border-slate-100 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => onToggleTaskStatus(t)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-amber-500'
                        }`}
                      >
                        {isDone && <span className="text-xs">✓</span>}
                      </button>

                      <div className="min-w-0 cursor-pointer" onClick={() => onSelectTask(t)}>
                        <h4
                          className={`font-semibold text-xs text-slate-800 truncate ${
                            isDone ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {t.title}
                        </h4>
                        <span className="text-[10px] text-amber-700 font-bold">
                          {t.assignedCrew} • {t.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
