import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Paperclip,
  Globe,
  BookOpen,
  Atom,
  Minimize2,
  Maximize2,
  Trash2,
  Plus,
  Square,
  RefreshCw,
  History,
  Bot
} from 'lucide-react';
import {
  LUFFY_AVATAR,
  ZORO_AVATAR,
  NAMI_AVATAR,
  SANJI_AVATAR,
  CHOPPER_AVATAR,
} from '../assets/assets.ts';
import { JollyRogerIcon } from './Icons.tsx';
import { MarkdownRenderer } from './MarkdownRenderer.tsx';
import { api, type ChatMessage, type Conversation } from '../services/api.ts';

interface MugiwaraChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
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
  activeCrewMember: string;
  onChangeCrewMember: (crew: string) => void;
  initialPrompt?: string;
}

export const MugiwaraChatbot: React.FC<MugiwaraChatbotProps> = ({
  isOpen,
  onToggle,
  activeConversation,
  onSendMessage,
  onNewConversation,
  onDeleteConversation,
  activeCrewMember,
  onChangeCrewMember,
  initialPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [webActive, setWebActive] = useState(false);
  const [memoryActive, setMemoryActive] = useState(true);
  const [deepResearchActive, setDeepResearchActive] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [attachments, setAttachments] = useState<Array<{ name: string; type: string; data?: string }>>([]);
  const stopStreamRef = useRef<(() => void) | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen, activeConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, streamingText, isStreaming, isOpen]);

  const fetchConversations = async () => {
    try {
      const res = await api.getConversations();
      setAllConversations(res.conversations || []);
    } catch (e) {
      console.error(e);
    }
  };

  const crewDetails: Record<
    string,
    { avatar: string; icon: string; title: string; greeting: string; chips: string[] }
  > = {
    ChatGPT: {
      avatar: LUFFY_AVATAR,
      icon: '🤖',
      title: 'ChatGPT Assistant (Python, Java, All Tech)',
      greeting: 'Hello! I am your AI assistant in ChatGPT mode, powered by Gemini 3.8 Flash. I can write code in Python, Java, C++, TypeScript, design databases, explain algorithms, or draft plans. What would you like to work on?',
      chips: ['Write a Python program', 'Write a Java program', 'Explain an algorithm', 'Debug my code'],
    },
    Luffy: {
      avatar: LUFFY_AVATAR,
      icon: '🧭',
      title: 'Captain & Universal AI',
      greeting: 'SHISHISHI! Ahoy Captain! I operate with the full power of ChatGPT and the spirit of a pirate king. Ask me for Python, Java, project roadmaps, or technical architecture!',
      chips: ['Write a Python script', 'Write a Java program', 'Plan MVP roadmap', 'Brainstorm product ideas'],
    },
    Zoro: {
      avatar: ZORO_AVATAR,
      icon: '⚔️',
      title: 'Lead Software Architect',
      greeting: 'Oi, Captain. Zoro here. Hand me the specs, and I will slice through the bugs and write clean, resilient code in Python, Java, C++, TypeScript, Go, or any language you choose.',
      chips: ['Python factorial program', 'Java factorial program', 'TypeScript architecture', 'Optimize runtime'],
    },
    Nami: {
      avatar: NAMI_AVATAR,
      icon: '🗺️',
      title: 'Master Researcher',
      greeting: 'Leave the charts to me! I can conduct grounded web research, summarize tech docs, or analyze competitor strategies.',
      chips: ['Research best practices for Vector DBs', 'Synthesize latest tech trends', 'Compare cloud architectures'],
    },
    Sanji: {
      avatar: SANJI_AVATAR,
      icon: '🍳',
      title: 'Senior Data Analyst',
      greeting: 'A gourmet analysis prepared just for you, Captain. How can I season your data funnels and schemas today?',
      chips: ['Design database schema', 'Write optimized SQL query', 'Analyze user retention funnel'],
    },
    Chopper: {
      avatar: CHOPPER_AVATAR,
      icon: '🩺',
      title: 'QA Guardian & Doctor',
      greeting: 'Doctor Chopper here! Your system uptime and code health are safe with me. Need a diagnosis or test suite?',
      chips: ['Diagnose error logs', 'Write end-to-end test cases', 'Check system resilience'],
    },
  };

  const currentCrew = crewDetails[activeCrewMember] || crewDetails.ChatGPT || crewDetails.Luffy;

  // Handle Send with live token streaming (ChatGPT style)
  const handleSend = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || prompt;
    if (!textToSend.trim() && attachments.length === 0) return;
    if (isStreaming) return;

    const currentAttachments = [...attachments];
    setPrompt('');
    setAttachments([]);
    setStreamingText('');
    setIsStreaming(true);

    try {
      // Use streaming API
      const abort = await api.chatWithAIStream(
        {
          prompt: textToSend.trim(),
          conversationId: activeConversation?.id,
          crewMember: activeCrewMember,
          controls: {
            attach: currentAttachments.length > 0,
            web: webActive,
            memory: memoryActive,
            deepResearch: deepResearchActive,
          },
          attachments: currentAttachments,
        },
        (chunk) => {
          setStreamingText((prev) => prev + chunk);
        },
        (doneData) => {
          setStreamingText('');
          setIsStreaming(false);
          stopStreamRef.current = null;
          fetchConversations();
          // Notify parent of updated message
          onSendMessage({
            prompt: textToSend.trim(),
            conversationId: doneData.conversationId,
            crewMember: activeCrewMember,
            controls: {
              attach: currentAttachments.length > 0,
              web: webActive,
              memory: memoryActive,
              deepResearch: deepResearchActive,
            },
            attachments: currentAttachments,
          });
        },
        (err) => {
          console.error('Streaming error, falling back to standard chat:', err);
          setIsStreaming(false);
          stopStreamRef.current = null;
          // Fallback to standard request
          onSendMessage({
            prompt: textToSend.trim(),
            conversationId: activeConversation?.id,
            crewMember: activeCrewMember,
            controls: {
              attach: currentAttachments.length > 0,
              web: webActive,
              memory: memoryActive,
              deepResearch: deepResearchActive,
            },
            attachments: currentAttachments,
          });
        }
      );

      stopStreamRef.current = abort;
    } catch (err) {
      console.error(err);
      setIsStreaming(false);
    }
  };

  const handleStopGenerating = () => {
    if (stopStreamRef.current) {
      stopStreamRef.current();
      stopStreamRef.current = null;
    }
    setIsStreaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 p-3.5 rounded-full bg-[#0d1424] text-white shadow-2xl border-2 border-amber-400 hover:scale-105 hover:shadow-amber-500/20 transition-all duration-200"
          aria-label="Open ChatGPT Mode AI Chatbot"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#141d33] flex items-center justify-center">
              <JollyRogerIcon size={26} />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#0d1424] animate-pulse" />
          </div>

          <div className="hidden sm:flex flex-col text-left pr-2">
            <span className="font-black text-xs text-white leading-tight flex items-center gap-1.5">
              Mugiwara AI
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-md">
                GPT Mode
              </span>
            </span>
            <span className="text-[10px] text-amber-300 font-semibold leading-tight">
              {activeCrewMember} Online
            </span>
          </div>
        </button>
      )}

      {/* Main Floating Chatbot Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-200 ${
            isExpanded
              ? 'w-[96vw] sm:w-[750px] lg:w-[820px] h-[90vh] max-h-[850px]'
              : 'w-[95vw] sm:w-[480px] h-[640px] max-h-[88vh]'
          }`}
        >
          {/* Top Header */}
          <div className="bg-[#0d1424] text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                className={`p-1.5 rounded-xl transition-colors ${
                  showHistorySidebar
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Chat History"
              >
                <History className="w-4 h-4" />
              </button>

              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0 shadow-sm">
                <img
                  src={currentCrew.avatar}
                  alt={activeCrewMember}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    {activeCrewMember}
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.2 rounded-md font-bold">
                      Gemini 3.8 Flash
                    </span>
                  </h3>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {currentCrew.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onNewConversation}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white transition-colors text-xs font-bold"
                title="New Chat"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Chat</span>
              </button>

              {activeConversation && (
                <button
                  onClick={() => onDeleteConversation(activeConversation.id)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-white/10 transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Collapsible Chat History Drawer (ChatGPT style) */}
          {showHistorySidebar && (
            <div className="bg-[#111827] text-white p-3 border-b border-white/10 max-h-48 overflow-y-auto shrink-0 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                <span>Recent Conversations</span>
                <button
                  onClick={() => setShowHistorySidebar(false)}
                  className="hover:text-white"
                >
                  ✕
                </button>
              </div>
              {allConversations.length === 0 ? (
                <p className="text-xs text-slate-500 py-2 text-center">No saved chats yet.</p>
              ) : (
                allConversations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onNewConversation();
                      setShowHistorySidebar(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      activeConversation?.id === c.id
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="truncate max-w-[280px]">
                      {c.title || 'Conversation'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(c.id);
                      }}
                      className="p-1 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Crew Switcher Tabs */}
          <div className="px-3 py-2 bg-[#141d33] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {(['ChatGPT', 'Luffy', 'Zoro', 'Nami', 'Sanji', 'Chopper'] as const).map((name) => {
              const isActive = activeCrewMember === name;
              const details = crewDetails[name];
              return (
                <button
                  key={name}
                  onClick={() => onChangeCrewMember(name)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold scale-102'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>{details.icon}</span>
                  <span>{name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Suggestions:
            </span>
            {currentCrew.chips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-0.5 rounded-full bg-white text-slate-600 hover:text-amber-800 hover:bg-amber-50 border border-slate-200 text-[11px] font-medium whitespace-nowrap transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#f8fafc]">
            {/* Welcome Greeting */}
            {(!activeConversation || activeConversation.messages.length === 0) && (
              <div className="flex gap-3 items-start animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0 mt-0.5 shadow-2xs">
                  <img
                    src={currentCrew.avatar}
                    alt={activeCrewMember}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-3xl rounded-tl-xs p-4 border border-slate-200/90 shadow-xs max-w-[90%] text-xs sm:text-sm leading-relaxed text-slate-800">
                  <div className="font-extrabold text-xs text-amber-700 mb-1 flex items-center gap-1.5">
                    <span>{activeCrewMember}</span>
                    <span className="text-slate-400 font-normal">• {currentCrew.title}</span>
                  </div>
                  <p>{currentCrew.greeting}</p>
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {activeConversation?.messages.map((msg: ChatMessage) => {
              const isUser = msg.role === 'user';
              const speakerCrew = crewDetails[msg.crewMember || activeCrewMember] || currentCrew;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0 mt-0.5 shadow-2xs">
                      <img
                        src={speakerCrew.avatar}
                        alt="AI Crew"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-[#0d1424] text-white rounded-tr-xs'
                        : 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1.5 text-[10px] font-bold opacity-60">
                      <span>{isUser ? 'Captain' : msg.crewMember || activeCrewMember}</span>
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {isUser ? (
                      <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                    ) : (
                      <MarkdownRenderer content={msg.content} />
                    )}

                    {/* Sources grounding */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                        <span className="font-bold text-slate-700 block mb-1">
                          🌐 Verified Sources:
                        </span>
                        {msg.sources.map((s, i) => (
                          <div key={i} className="truncate text-blue-600 hover:underline">
                            • {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Live Streaming Response with Blinking Cursor */}
            {isStreaming && (
              <div className="flex gap-3 items-start animate-in fade-in duration-150">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0 mt-0.5 shadow-2xs animate-pulse">
                  <img
                    src={currentCrew.avatar}
                    alt={activeCrewMember}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-3xl rounded-tl-xs p-4 border border-slate-200/90 shadow-xs max-w-[90%] text-xs sm:text-sm text-slate-900">
                  <div className="font-extrabold text-xs text-amber-700 mb-1 flex items-center gap-1.5">
                    <span>{activeCrewMember}</span>
                    <span className="text-slate-400 font-normal">typing...</span>
                  </div>
                  {streamingText ? (
                    <div>
                      <MarkdownRenderer content={streamingText} />
                      <span className="inline-block w-2 h-4 ml-1 bg-amber-500 animate-pulse align-middle" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 py-1">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      <span>Consulting the Grand Line logs...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form (ChatGPT Multiline Style) */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
            {/* Attachment preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {attachments.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[140px]">{file.name}</span>
                    <button
                      onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-amber-700 hover:text-amber-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative rounded-2xl bg-slate-100 border border-slate-200 focus-within:border-amber-500 focus-within:bg-white transition-all p-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />

              <textarea
                ref={textareaRef}
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${activeCrewMember}... (Enter to send, Shift+Enter for new line)`}
                className="w-full bg-transparent border-none text-slate-900 text-xs sm:text-sm placeholder-slate-400 resize-none focus:outline-hidden"
              />

              {/* Action Buttons inside Textarea Footer */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                    title="Attach file / image"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setWebActive(!webActive)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                      webActive
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'hover:bg-slate-200 text-slate-600'
                    }`}
                    title="Google Search Grounding"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden sm:inline">Web</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMemoryActive(!memoryActive)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                      memoryActive
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : 'hover:bg-slate-200 text-slate-600'
                    }`}
                    title="User Memories Grounding"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    <span className="hidden sm:inline">Memory</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeepResearchActive(!deepResearchActive)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                      deepResearchActive
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'hover:bg-slate-200 text-slate-600'
                    }`}
                    title="Deep Research Mode"
                  >
                    <Atom className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Research</span>
                  </button>
                </div>

                {/* Stop generating OR Send button */}
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={handleStopGenerating}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <Square className="w-3 h-3 fill-white" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!prompt.trim() && attachments.length === 0}
                    className="p-2 rounded-xl bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors disabled:opacity-30 disabled:hover:bg-slate-900 disabled:hover:text-white shrink-0"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 px-1">
              <span>Shift + Enter for new line • Markdown enabled</span>
              <span className="text-amber-700 font-bold">Mugiwara AI ChatGPT Mode</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
