import React, { useState } from 'react';
import { Search, Bell, Menu, ChevronDown, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { LUFFY_AVATAR } from '../assets/assets.ts';
import type { User } from '../services/api.ts';

interface HeaderProps {
  user: User | null;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenAuth,
  onLogout,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Zoro finished task', desc: 'Message bus latency benchmark passed', time: '10m ago' },
    { id: 2, title: 'Deep Research completed', desc: 'Vector memory indexing report generated', time: '25m ago' },
    { id: 3, title: 'NEXORA progress update', desc: 'Milestone reached 87%', time: '2h ago' },
  ];

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#0d1424]/90 backdrop-blur-md border-b border-[#1e293b]/60 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Mobile Menu Button + Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search Bar */}
        <div
          onClick={onOpenSearch}
          className="relative w-full cursor-pointer group"
        >
          <div className="flex items-center w-full h-11 px-4 rounded-2xl bg-[#f5f6f9] text-slate-700 shadow-inner border border-slate-200/80 group-hover:border-amber-400/80 transition-all">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors mr-3 shrink-0" />
            <span className="text-xs sm:text-sm text-slate-400 font-normal truncate flex-1">
              Search projects, tasks, or ask Mugiwara AI...
            </span>
            <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-white rounded-lg border border-slate-200 shadow-2xs">
              ⌘ K
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Notifications & Captain Profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileDropdownOpen(false);
            }}
            className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-amber-200" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0d1424] animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Crew Alerts</h4>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/60 transition-colors text-left text-xs">
                    <div className="font-semibold text-slate-900">{n.title}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{n.desc}</div>
                    <div className="text-amber-700 font-medium text-[10px] mt-1">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 pr-2.5 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            {/* Luffy Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shadow-md">
              <img
                src={user?.avatar || LUFFY_AVATAR}
                alt="Captain Luffy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Title text */}
            <div className="hidden md:flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-white leading-tight">
                  {user?.name || 'Captain'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 leading-tight">
                {user?.title || 'Student • Builder • Dreamer'}
              </span>
            </div>
          </button>

          {/* User Menu Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-200 p-3 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-bold text-sm text-slate-900">{user?.name || 'Captain Luffy'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'captain@mugiwara.com'}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  Straw Hat Fleet Commander
                </span>
              </div>

              <div className="py-2 space-y-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  Quick Command Search
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  Switch Pirate Account / Login
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
