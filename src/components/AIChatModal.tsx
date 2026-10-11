import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Paperclip,
  Globe,
  BookOpen,
  Atom,
  Trash2,
  Plus,
  ExternalLink,
  Bot
} from 'lucide-react';
import {
  LUFFY_AVATAR,
  ZORO_AVATAR,
  NAMI_AVATAR,
  SANJI_AVATAR,
  CHOPPER_AVATAR,
} from '../assets/assets.ts';
import { MarkdownRenderer } from './MarkdownRenderer.tsx';
import type { ChatMessage, Conversation } from '../services/api.ts';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeConversation: Conversation | null;
  onSendMessage: (payload: {
    prompt: string;
    conversationId?: string;
    crewMember: string;
    controls: {
      attach: boolean;
      web: boolean;
      memory: boolean;
      deepResearch: boolean;
    };
    attachments: Array<{ name: string; type: string; data?: string }>;
  }) => Promise<void>;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  selectedCrew?: string;
  initialPrompt?: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  activeConversation,
  onSendMessage,
  onNewConversation,
  onDeleteConversation,
  selectedCrew = 'Luffy',
  initialPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [crewMember, setCrewMember] = useState(selectedCrew);
  const [webActive, setWebActive] = useState(false);
  const [memoryActive, setMemoryActive] = useState(true);
  const [deepResearchActive, setDeepResearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Array<{ name: string; type: string; data?: string }>>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedCrew) {
      setCrewMember(selectedCrew);
    }
  }, [selectedCrew]);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isLoading]);

  if (!isOpen) return null;

  const crewAvatars: Record<string, string> = {
    ChatGPT: LUFFY_AVATAR,
    Luffy: LUFFY_AVATAR,
    Zoro: ZORO_AVATAR,
    Nami: NAMI_AVATAR,
    Sanji: SANJI_AVATAR,
    Chopper: CHOPPER_AVATAR,
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() && attachments.length === 0) return;
    if (isLoading) return;

    const userPrompt = prompt.trim();
    const currentAttachments = [...attachments];
    setPrompt('');
    setAttachments([]);
    setIsLoading(true);

    try {
      await onSendMessage({
        prompt: userPrompt || 'Please analyze this information.',
        conversationId: activeConversation?.id,
        crewMember,
        controls: {
          attach: currentAttachments.length > 0,
          web: webActive,
          memory: memoryActive,
          deepResearch: deepResearchActive,
        },
        attachments: currentAttachments,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-full bg-[#f8fafc] text-slate-800 shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#0d1424] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 shadow-md">
              <img
                src={crewAvatars[crewMember] || LUFFY_AVATAR}
                alt={crewMember}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Mugiwara AI • {crewMember}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-amber-200/80 font-medium">
                {activeConversation?.title || 'Grand Line Co-Pilot'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNewConversation}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-semibold flex items-center gap-1"
              title="New Conversation"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New</span>
            </button>

            {activeConversation && (
              <button
                onClick={() => onDeleteConversation(activeConversation.id)}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/30 text-rose-300 hover:text-white transition-colors"
                title="Delete Conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Crew Selector Pill Bar */}
        <div className="px-4 py-2.5 bg-[#141d33] border-b border-white/5 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[11px] font-bold text-amber-300/80 uppercase tracking-wider shrink-0 mr-1">
            Crew:
          </span>
          {(['Luffy', 'Zoro', 'Nami', 'Sanji', 'Chopper'] as const).map((name) => (
            <button
              key={name}
              onClick={() => setCrewMember(name)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                crewMember === name
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold scale-105'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15'
              }`}
            >
              <img
                src={crewAvatars[name]}
                alt={name}
                className="w-4 h-4 rounded-full object-cover"
              />
              {name}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {(!activeConversation || activeConversation.messages.length === 0) && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-base text-slate-800">
                Ahoy! {crewMember} reporting for duty!
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1">
                Ask about building websites, conducting research, optimizing data funnels, or orchestrating your Grand Line project!
              </p>
            </div>
          )}

          {activeConversation?.messages.map((msg: ChatMessage) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0 mt-1 shadow-xs">
                    <img
                      src={crewAvatars[msg.crewMember || crewMember] || LUFFY_AVATAR}
                      alt="AI Crew"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#111827] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  {/* Speaker name */}
                  <div className="flex items-center justify-between gap-2 mb-1 text-[10px] font-bold opacity-60">
                    <span>{isUser ? 'Captain' : msg.crewMember || crewMember}</span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Message Content */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap font-normal break-words">
                      {msg.content}
                    </div>
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}

                  {/* Sources Grounding if any */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="font-bold flex items-center gap-1 text-slate-700 mb-1">
                        <Globe className="w-3 h-3 text-blue-500" />
                        Web Sources:
                      </span>
                      <div className="space-y-1">
                        {msg.sources.map((src, i) => (
                          <div key={i} className="truncate text-blue-600 hover:underline">
                            • {src}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0 mt-1 animate-pulse">
                <img
                  src={crewAvatars[crewMember] || LUFFY_AVATAR}
                  alt={crewMember}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-xs p-4 border border-slate-200 shadow-xs flex items-center gap-2 text-slate-500 text-xs">
                <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                <span>{crewMember} is navigating the solution...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs"
                >
                  <Paperclip className="w-3 h-3" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button
                    onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                    className="p-0.5 hover:bg-amber-200 rounded text-amber-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Ask ${crewMember}... (e.g. build a feature, plan sprint)`}
              className="w-full py-3 pl-4 pr-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-amber-500 focus:bg-white transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || (!prompt.trim() && attachments.length === 0)}
              className="absolute right-2 p-2 rounded-lg bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Prompt controls */}
          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 flex items-center gap-1"
                title="Attach file"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Attach</span>
              </button>

              <button
                type="button"
                onClick={() => setWebActive(!webActive)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  webActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Web</span>
              </button>

              <button
                type="button"
                onClick={() => setMemoryActive(!memoryActive)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  memoryActive ? 'bg-purple-100 text-purple-800' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>Memory</span>
              </button>

              <button
                type="button"
                onClick={() => setDeepResearchActive(!deepResearchActive)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  deepResearchActive ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Atom className="w-3.5 h-3.5 text-emerald-600" />
                <span>Deep Research</span>
              </button>
            </div>

            <span className="text-[10px] text-slate-400 hidden sm:inline">
              Powered by Gemini 3.8
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
