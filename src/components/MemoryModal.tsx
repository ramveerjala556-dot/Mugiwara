import React, { useState, useEffect } from 'react';
import { X, Trash2, Brain, Save } from 'lucide-react';
import type { Memory } from '../services/api.ts';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory?: Memory | null;
  onSave: (data: Partial<Memory>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  isOpen,
  onClose,
  memory,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Tech' | 'Ideas' | 'Tools' | 'Debug' | 'General'>('Tech');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setContent(memory.content);
      setCategory(memory.category);
    } else {
      setTitle('');
      setContent('');
      setCategory('Tech');
    }
  }, [memory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        category,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!memory || !onDelete) return;
    setIsSubmitting(true);
    try {
      await onDelete(memory.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-5 bg-[#0d1424] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base">
              {memory ? 'Edit Saved Memory' : 'Remember New Context'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Memory Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tech stack preference, target market..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:outline-hidden bg-white"
            >
              <option value="Tech">Tech (Frameworks, libraries)</option>
              <option value="Ideas">Ideas (Features, vision)</option>
              <option value="Tools">Tools (Deployments, CLI)</option>
              <option value="Debug">Debug (Past issues, quirks)</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Context / Preferences
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What should the Mugiwara AI crew always remember when answering prompts?"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {memory && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Forget Memory
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {memory ? 'Save Changes' : 'Store in Memory'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
