import React from 'react';
import { MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  LUFFY_AVATAR,
  ZORO_AVATAR,
  NAMI_AVATAR,
  SANJI_AVATAR,
  CHOPPER_AVATAR,
} from '../assets/assets.ts';

interface CrewsViewProps {
  onChatWithCrew: (name: 'Luffy' | 'Zoro' | 'Nami' | 'Sanji' | 'Chopper') => void;
}

export const CrewsView: React.FC<CrewsViewProps> = ({ onChatWithCrew }) => {
  const crewMembers = [
    {
      name: 'Luffy' as const,
      role: 'Navigator & Captain',
      tagline: 'Planning & Vision',
      avatar: LUFFY_AVATAR,
      desc: 'Sets the overarching roadmap, rallies the team, inspires breakthrough solutions, and ensures nothing stands between you and your One Piece.',
      color: 'from-amber-500/20 to-orange-500/10',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      name: 'Zoro' as const,
      role: 'Lead Coder',
      tagline: 'Development & Architecture',
      avatar: ZORO_AVATAR,
      desc: 'Three-sword style programming. Cuts through spaghetti code, builds resilient backends, solves distributed algorithms, and maintains zero-downtime discipline.',
      color: 'from-emerald-500/20 to-teal-500/10',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    {
      name: 'Nami' as const,
      role: 'Chief Researcher',
      tagline: 'Research & Grounding',
      avatar: NAMI_AVATAR,
      desc: 'Charts the unpredictable currents of data. Expert in real-time web retrieval, documentation synthesis, competitor benchmarks, and resource optimization.',
      color: 'from-orange-500/20 to-amber-500/10',
      badge: 'bg-orange-100 text-orange-900 border-orange-300',
    },
    {
      name: 'Sanji' as const,
      role: 'Senior Data Analyst',
      tagline: 'Data Insights & Funnels',
      avatar: SANJI_AVATAR,
      desc: 'Cooks raw data into Michelin-star actionable insights. Optimizes conversion funnels, pipeline recipes, user engagement, and system analytics.',
      color: 'from-blue-500/20 to-indigo-500/10',
      badge: 'bg-blue-100 text-blue-900 border-blue-300',
    },
    {
      name: 'Chopper' as const,
      role: 'System Guardian',
      tagline: 'Testing & QA Diagnostics',
      avatar: CHOPPER_AVATAR,
      desc: 'The ship doctor for your software stack. Diagnoses fatal errors, performs automated health checks, conducts stress tests, and guards uptime.',
      color: 'from-pink-500/20 to-rose-500/10',
      badge: 'bg-pink-100 text-pink-900 border-pink-300',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          The Mugiwara Fleet AI Crew
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Each crew member possesses distinct system instructions, analytical personas, and domain specialties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {crewMembers.map((member) => (
          <div
            key={member.name}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-md shrink-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{member.name}</h3>
                  <p className="text-xs font-bold text-amber-600">{member.role}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${member.badge}`}
                  >
                    {member.tagline}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {member.desc}
              </p>
            </div>

            <button
              onClick={() => onChatWithCrew(member.name)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat with {member.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
