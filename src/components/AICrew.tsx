import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import {
  LUFFY_AVATAR,
  ZORO_AVATAR,
  NAMI_AVATAR,
  SANJI_AVATAR,
  CHOPPER_AVATAR,
} from '../assets/assets.ts';

export interface CrewMember {
  id: string;
  name: 'Luffy' | 'Zoro' | 'Nami' | 'Sanji' | 'Chopper';
  role: string;
  focus: string;
  avatar: string;
  status: 'active' | 'busy' | 'resting';
  specialty: string;
}

interface AICrewProps {
  onSelectMember: (member: CrewMember) => void;
  onManageCrew: () => void;
}

export const AICrew: React.FC<AICrewProps> = ({
  onSelectMember,
  onManageCrew,
}) => {
  const crew: CrewMember[] = [
    {
      id: 'luffy',
      name: 'Luffy',
      role: 'Navigator',
      focus: 'Planning',
      avatar: LUFFY_AVATAR,
      status: 'active',
      specialty: 'Grand vision, high-level roadmaps, and motivational drive',
    },
    {
      id: 'zoro',
      name: 'Zoro',
      role: 'Coder',
      focus: 'Development',
      avatar: ZORO_AVATAR,
      status: 'active',
      specialty: 'Santoryu coding, architecture, performance, and bug extermination',
    },
    {
      id: 'nami',
      name: 'Nami',
      role: 'Researcher',
      focus: 'Research',
      avatar: NAMI_AVATAR,
      status: 'active',
      specialty: 'Deep research, competitor analysis, web grounding, and resources',
    },
    {
      id: 'sanji',
      name: 'Sanji',
      role: 'Analyst',
      focus: 'Data',
      avatar: SANJI_AVATAR,
      status: 'active',
      specialty: 'Metric feasts, conversion funnels, pipeline recipes, and data modeling',
    },
    {
      id: 'chopper',
      name: 'Chopper',
      role: 'Guardian',
      focus: 'Testing',
      avatar: CHOPPER_AVATAR,
      status: 'active',
      specialty: 'System diagnostics, health checks, testing, and preventative cures',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-800" />
            <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Your AI Crew
            </h4>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            5 agents active
          </span>
        </div>

        <button
          onClick={onManageCrew}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          Manage Crew <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Crew Members Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {crew.map((member) => (
          <div
            key={member.id}
            onClick={() => onSelectMember(member)}
            className="group flex flex-col items-center text-center p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-200/80 hover:shadow-xs"
          >
            {/* Circular Avatar */}
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-amber-400 group-hover:scale-105 transition-all shadow-sm">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Role with green online status dot */}
            <div className="flex items-center gap-1 mt-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {member.role}
              </span>
            </div>

            {/* Focus Subtitle */}
            <span className="text-[11px] font-medium text-slate-400 leading-tight mt-0.5">
              {member.focus}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
