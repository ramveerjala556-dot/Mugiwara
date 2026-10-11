import React from 'react';
import {
  Code,
  Search,
  FileText,
  BarChart3,
  Cog,
  ArrowRight
} from 'lucide-react';
import {
  CodeIllustration,
  ResearchIllustration,
  CreateIllustration,
  AnalyzeIllustration,
  AutomateIllustration
} from './Icons.tsx';

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  iconBg: string;
  iconColor: string;
  cardBg: string;
  borderColor: string;
  icon: React.ReactNode;
  illustration: React.ReactNode;
  promptSuggestion: string;
  crewSpecialist: 'Zoro' | 'Nami' | 'Sanji' | 'Chopper' | 'Luffy';
}

interface QuickActionsProps {
  onSelectAction: (action: QuickActionItem) => void;
  onViewAll?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onSelectAction,
  onViewAll,
}) => {
  const actions: QuickActionItem[] = [
    {
      id: 'build',
      title: 'Build',
      subtitle: 'Website / App',
      cardBg: 'bg-[#eef5fc]',
      borderColor: 'border-[#d4e4f7]',
      iconBg: 'bg-[#2563eb]',
      iconColor: 'text-white',
      icon: <Code className="w-5 h-5" />,
      illustration: <CodeIllustration className="w-12 h-12" />,
      promptSuggestion: 'Design the architecture and starter code for a new high-performance web app.',
      crewSpecialist: 'Zoro',
    },
    {
      id: 'research',
      title: 'Research',
      subtitle: 'Find & Summarize',
      cardBg: 'bg-[#f4f0fd]',
      borderColor: 'border-[#e4d8fb]',
      iconBg: 'bg-[#7c3aed]',
      iconColor: 'text-white',
      icon: <Search className="w-5 h-5" />,
      illustration: <ResearchIllustration className="w-12 h-12" />,
      promptSuggestion: 'Perform deep research on current state-of-the-art vector databases and recall optimization.',
      crewSpecialist: 'Nami',
    },
    {
      id: 'create',
      title: 'Create',
      subtitle: 'Docs / Slides',
      cardBg: 'bg-[#fdf7ee]',
      borderColor: 'border-[#fae8cb]',
      iconBg: 'bg-[#ea580c]',
      iconColor: 'text-white',
      icon: <FileText className="w-5 h-5" />,
      illustration: <CreateIllustration className="w-12 h-12" />,
      promptSuggestion: 'Draft a comprehensive product requirements document (PRD) and slide outline.',
      crewSpecialist: 'Luffy',
    },
    {
      id: 'analyze',
      title: 'Analyze',
      subtitle: 'Data / Insights',
      cardBg: 'bg-[#edf9f2]',
      borderColor: 'border-[#ceefe0]',
      iconBg: 'bg-[#059669]',
      iconColor: 'text-white',
      icon: <BarChart3 className="w-5 h-5" />,
      illustration: <AnalyzeIllustration className="w-12 h-12" />,
      promptSuggestion: 'Analyze operational metrics, funnel conversion rates, and recommend data optimizations.',
      crewSpecialist: 'Sanji',
    },
    {
      id: 'automate',
      title: 'Automate',
      subtitle: 'Tasks / Workflows',
      cardBg: 'bg-[#fdeeed]',
      borderColor: 'border-[#fad0cf]',
      iconBg: 'bg-[#dc2626]',
      iconColor: 'text-white',
      icon: <Cog className="w-5 h-5" />,
      illustration: <AutomateIllustration className="w-12 h-12" />,
      promptSuggestion: 'Construct an automated CI/CD pipeline test suite and failure recovery workflow.',
      crewSpecialist: 'Chopper',
    },
  ];

  return (
    <section className="mt-8 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="text-amber-500 text-lg">⚡</span>
          Quick Actions
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
        >
          See all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of 5 pastel cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {actions.map((act) => (
          <div
            key={act.id}
            onClick={() => onSelectAction(act)}
            className={`group relative rounded-2xl ${act.cardBg} border ${act.borderColor} p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col justify-between h-[132px] overflow-hidden`}
          >
            {/* Top Row: Icon Badge & Title */}
            <div>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl ${act.iconBg} ${act.iconColor} flex items-center justify-center shadow-xs shrink-0`}
                >
                  {act.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                    {act.title}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 leading-tight truncate">
                    {act.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Arrow Button + Illustration Graphic */}
            <div className="flex items-end justify-between mt-2 pt-1">
              <div className="w-7 h-7 rounded-full bg-white/80 group-hover:bg-white text-slate-700 shadow-2xs border border-black/5 flex items-center justify-center transition-transform group-hover:translate-x-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>

              <div className="opacity-90 group-hover:scale-105 transition-transform origin-bottom-right">
                {act.illustration}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
