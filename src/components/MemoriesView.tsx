import React, { useState } from 'react';
import { Plus, Search, Brain, Layers, Lightbulb, Wrench, AlertTriangle, Trash2, Edit3 } from 'lucide-react';
import type { Memory } from '../services/api.ts';

interface MemoriesViewProps {
  memories: Memory[];
  onOpenNewMemory: () => void;
  onEditMemory: (m: Memory) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({
  memories,
  onOpenNewMemory,
  onEditMemory,
  onDeleteMemory,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = memories.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.content.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getCategoryDetails = (category: string) => {
    switch (category) {
      case 'Tech':
        return {
          icon: <Layers className="w-4 h-4 text-sky-600" />,
          badge: 'bg-sky-100 text-sky-800 border-sky-200',
        };
      case 'Ideas':
        return {
          icon: <Lightbulb className="w-4 h-4 text-amber-600" />,
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'Tools':
        return {
          icon: <Wrench className="w-4 h-4 text-purple-600" />,
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
        };
      case 'Debug':
      default:
        return {
          icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Persistent Memory & Lore
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Store stack preferences, ideas, and directives that the AI crew automatically remembers.
          </p>
        </div>

        <button
          onClick={onOpenNewMemory}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Remember New
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memories..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Tech', 'Ideas', 'Tools', 'Debug'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
          <Brain className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h4 className="font-extrabold text-base text-slate-700">No memories found</h4>
          <p className="text-xs text-slate-400 mt-1">Record a preference or guideline for your AI crew.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filtered.map((mem) => {
            const cat = getCategoryDetails(mem.category);
            return (
              <div
                key={mem.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                        {cat.icon}
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900">
                        {mem.title}
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${cat.badge}`}
                    >
                      {mem.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {mem.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Added {new Date(mem.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditMemory(mem)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                      title="Edit Memory"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteMemory(mem.id)}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600"
                      title="Delete Memory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
