import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Paperclip,
  Globe,
  BookOpen,
  Atom,
  ArrowRight,
  X,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { MUGIWARA_HERO_BG } from '../assets/assets.ts';

interface HeroBannerProps {
  userName?: string;
  onSendPrompt: (payload: {
    prompt: string;
    controls: {
      attach: boolean;
      web: boolean;
      memory: boolean;
      deepResearch: boolean;
    };
    attachments: Array<{ name: string; type: string; data?: string }>;
  }) => void;
  isSubmitting?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  userName = 'Captain',
  onSendPrompt,
  isSubmitting = false,
}) => {
  const [prompt, setPrompt] = useState('');
  const [webActive, setWebActive] = useState(false);
  const [memoryActive, setMemoryActive] = useState(true); // default active for seamless memory injection
  const [deepResearchActive, setDeepResearchActive] = useState(false);
  const [attachments, setAttachments] = useState<Array<{ name: string; type: string; data?: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type || 'text/plain',
            data: event.target?.result as string,
          },
        ]);
      };
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() && attachments.length === 0) return;

    onSendPrompt({
      prompt: prompt.trim() || 'Analyze attached files and recommend next actions.',
      controls: {
        attach: attachments.length > 0,
        web: webActive,
        memory: memoryActive,
        deepResearch: deepResearchActive,
      },
      attachments,
    });

    setPrompt('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative mb-14">
      {/* Hidden file input for Attach control */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*,.txt,.md,.json,.js,.ts,.tsx,.py,.html,.css"
      />

      {/* Hero Visual Card */}
      <div className="relative w-full h-[280px] sm:h-[320px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Background Image */}
        <img
          src={MUGIWARA_HERO_BG}
          alt="Thousand Sunny Sailing the Grand Line"
          className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
        />

        {/* Cinematic gradient tint to ensure text clarity */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-900/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 h-full p-6 sm:p-10 flex flex-col justify-between">
          {/* Left Title and Greeting */}
          <div className="max-w-xl">
            <h2 className="text-xl sm:text-2xl font-medium text-white/90 tracking-wide drop-shadow-md">
              {getGreeting()},
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
                {userName}
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl inline-block -rotate-6 animate-bounce">
                👒
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm font-medium text-amber-200/90 tracking-wide drop-shadow-md">
              Turn your ideas into reality with your AI crew.
            </p>
          </div>
        </div>
      </div>

      {/* Floating AI Prompt Panel (Overlapping bottom edge) */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 w-[94%] max-w-4xl z-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 sm:p-4 transition-all">
          {/* Attachment Chips if any */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-2 mb-2 border-b border-slate-100">
              {attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium"
                >
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                  )}
                  <span className="truncate max-w-[140px]">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(idx)}
                    className="p-0.5 hover:bg-amber-200 rounded text-amber-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Top Prompt Input Row */}
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 ml-1" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to accomplish today?"
              className="flex-1 bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm sm:text-base font-normal focus:outline-hidden focus:ring-0"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || (!prompt.trim() && attachments.length === 0)}
              className="w-10 h-10 rounded-full bg-[#111827] hover:bg-[#1f2937] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-[#111827] shadow-md group shrink-0"
              aria-label="Send prompt"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </form>

          {/* Bottom Prompt Controls Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 pt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
            {/* Attach */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                attachments.length > 0
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attach</span>
              {attachments.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {attachments.length}
                </span>
              )}
            </button>

            {/* Web Grounding */}
            <button
              type="button"
              onClick={() => setWebActive(!webActive)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                webActive
                  ? 'bg-blue-100 text-blue-900 border border-blue-300 font-semibold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Web</span>
            </button>

            {/* Memory Grounding */}
            <button
              type="button"
              onClick={() => setMemoryActive(!memoryActive)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                memoryActive
                  ? 'bg-purple-100 text-purple-900 border border-purple-300 font-semibold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-600" />
              <span>Memory</span>
            </button>

            {/* Deep Research */}
            <button
              type="button"
              onClick={() => setDeepResearchActive(!deepResearchActive)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                deepResearchActive
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Atom className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deep Research</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
