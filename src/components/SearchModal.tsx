import React, { useState, useEffect } from 'react';
import { Search, X, Folder, CheckSquare, Brain, Sparkles, ArrowRight } from 'lucide-react';
import type { Project, Task, Memory } from '../services/api.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  tasks: Task[];
  memories: Memory[];
  onSelectProject: (p: Project) => void;
  onSelectTask: (t: Task) => void;
  onSelectMemory: (m: Memory) => void;
  onAskAI: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  tasks,
  memories,
  onSelectProject,
  onSelectTask,
  onSelectMemory,
  onAskAI,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredProjects = q
    ? projects.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    : projects.slice(0, 3);

  const filteredTasks = q
    ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    : tasks.slice(0, 3);

  const filteredMemories = q
    ? memories.filter((m) => m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q))
    : memories.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-slate-100 bg-[#f8fafc]">
          <Search className="w-5 h-5 text-amber-500 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tasks, memories, or ask Mugiwara AI..."
            className="flex-1 bg-transparent border-none text-slate-800 text-base placeholder-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Ask AI prompt option */}
          {query.trim() && (
            <div
              onClick={() => {
                onAskAI(query);
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-900">
                    Ask Mugiwara AI crew:
                  </span>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-amber-700">
                    "{query}"
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Projects
              </h5>
              <div className="space-y-1">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs text-slate-800">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {p.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Tasks
              </h5>
              <div className="space-y-1">
                {filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectTask(t);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-xs text-slate-800 truncate">
                        {t.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md uppercase shrink-0">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Memories */}
          {filteredMemories.length > 0 && (
            <div>
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Memories
              </h5>
              <div className="space-y-1">
                {filteredMemories.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onSelectMemory(m);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Brain className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="font-semibold text-xs text-slate-800 truncate">
                        {m.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md shrink-0">
                      {m.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Search across your entire Grand Line platform</span>
          <span className="font-medium text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-md">
            ESC to close
          </span>
        </div>
      </div>
    </div>
  );
};
