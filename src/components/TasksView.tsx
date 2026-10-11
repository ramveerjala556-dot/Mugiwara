import React, { useState } from 'react';
import { Plus, Search, CheckSquare, Clock, CheckCircle2, Trash2, Edit3, UserCheck } from 'lucide-react';
import type { Task, Project } from '../services/api.ts';

interface TasksViewProps {
  tasks: Task[];
  projects: Project[];
  onOpenNewTask: () => void;
  onEditTask: (t: Task) => void;
  onToggleStatus: (t: Task) => void;
  onDeleteTask: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  projects,
  onOpenNewTask,
  onEditTask,
  onToggleStatus,
  onDeleteTask,
}) => {
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [crewFilter, setCrewFilter] = useState('All');

  const filtered = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusTab === 'all' || t.status === statusTab;
    const matchesCrew = crewFilter === 'All' || t.assignedCrew === crewFilter;
    return matchesSearch && matchesStatus && matchesCrew;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'urgent':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Crew Task Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dispatch tasks to Luffy, Zoro, Nami, Sanji, or Chopper and conquer your sprints.
          </p>
        </div>

        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Assign Task
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {/* Status Tabs */}
          {(['all', 'pending', 'in_progress', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                statusTab === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Table / Card List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h4 className="font-extrabold text-base text-slate-700">No tasks found</h4>
            <p className="text-xs text-slate-400 mt-1">Assign a new task to your crew to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((t) => {
              const isDone = t.status === 'completed';
              return (
                <div
                  key={t.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Status Checkbox toggle */}
                    <button
                      onClick={() => onToggleStatus(t)}
                      className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-amber-500 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`font-bold text-sm text-slate-900 ${
                            isDone ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {t.title}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${getPriorityBadge(
                            t.priority
                          )}`}
                        >
                          {t.priority}
                        </span>
                        {t.projectName && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                            {t.projectName}
                          </span>
                        )}
                      </div>

                      {t.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {t.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1 text-amber-700">
                          <UserCheck className="w-3.5 h-3.5" />
                          {t.assignedCrew || 'Luffy'}
                        </span>
                        {t.dueDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Due {new Date(t.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEditTask(t)}
                      className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-600"
                      title="Edit Task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(t.id)}
                      className="p-2 hover:bg-rose-50 rounded-xl text-rose-600"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
