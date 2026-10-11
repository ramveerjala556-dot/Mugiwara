import React from 'react';
import {
  Home,
  Compass,
  FolderGit2,
  CheckSquare,
  Brain,
  BarChart2,
  Users,
  Settings,
  X
} from 'lucide-react';
import { JollyRogerIcon } from './Icons.tsx';

export type TabType = 'home' | 'workspace' | 'projects' | 'tasks' | 'memory' | 'analytics' | 'crews' | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const menuItems: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'workspace', label: 'Workspace', icon: <Compass className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'memory', label: 'Memory', icon: <Brain className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'crews', label: 'Crews', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d1424] text-slate-300 flex flex-col justify-between border-r border-[#1e293b]/70 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="flex items-center justify-between px-6 pt-6 pb-6 border-b border-[#1b263b]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#172238] flex items-center justify-center shadow-inner border border-amber-500/30">
                <JollyRogerIcon size={28} />
              </div>
              <div>
                <h1 className="font-extrabold text-xl text-white tracking-tight flex items-center gap-1">
                  Mugiwara
                </h1>
                <p className="text-[11px] font-medium text-amber-300/80 tracking-wide">
                  Your Crew. Your Goals.
                </p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-6 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-[#c58b3a] text-slate-950 font-semibold shadow-md shadow-amber-900/20'
                      : 'text-slate-300 hover:text-white hover:bg-[#152035]'
                  }`}
                >
                  <span
                    className={`${
                      isActive ? 'text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Decorative Parchment Ribbon: "Dream Plan Build Repeat" */}
        <div className="p-4 mb-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ebd5ad] via-[#f5e6ca] to-[#dfc498] p-4 text-[#4a2e12] shadow-lg border border-[#c7a46c]/60">
            {/* Subtle vintage texture overlay */}
            <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
              <JollyRogerIcon size={90} />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center py-2">
              <span
                style={{ fontFamily: "'Caveat', cursive" }}
                className="text-2xl font-bold tracking-wide text-[#3e240b] leading-tight"
              >
                Dream
              </span>
              <span
                style={{ fontFamily: "'Caveat', cursive" }}
                className="text-2xl font-bold tracking-wide text-[#3e240b] leading-tight"
              >
                Plan
              </span>
              <span
                style={{ fontFamily: "'Caveat', cursive" }}
                className="text-2xl font-bold tracking-wide text-[#3e240b] leading-tight"
              >
                Build
              </span>
              <span
                style={{ fontFamily: "'Caveat', cursive" }}
                className="text-2xl font-bold tracking-wide text-[#b45309] leading-tight drop-shadow-xs"
              >
                Repeat
              </span>
            </div>
            <div className="mt-1 text-center text-[10px] uppercase font-bold tracking-widest text-[#784d1c]/80 border-t border-[#c7a46c]/40 pt-1.5">
              Grand Line Edition
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
