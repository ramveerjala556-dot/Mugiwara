import React from 'react';
import { X, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import type { CrewMember } from './AICrew.tsx';

interface CrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: CrewMember | null;
  onStartChat: (member: CrewMember) => void;
}

export const CrewModal: React.FC<CrewModalProps> = ({
  isOpen,
  onClose,
  member,
  onStartChat,
}) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Artwork */}
        <div className="relative h-32 bg-[#0d1424] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-blue-500/20" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar Overlap */}
        <div className="relative px-6 pb-6 text-center">
          <div className="relative -mt-16 mb-3 inline-block">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <h3 className="text-xl font-black text-slate-900">{member.name}</h3>
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mt-0.5">
            {member.role} • {member.focus}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed px-2">
            {member.specialty}
          </p>

          <div className="mt-5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available for direct task execution</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Contextually specialized with Gemini 3.8</span>
            </div>
          </div>

          <button
            onClick={() => {
              onStartChat(member);
              onClose();
            }}
            className="w-full mt-5 py-3 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Converse with {member.name}
          </button>
        </div>
      </div>
    </div>
  );
};
