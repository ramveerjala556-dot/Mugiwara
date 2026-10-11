import React, { useState, useEffect } from 'react';
import { Settings, Shield, Database, Cpu, RefreshCw, LogOut, CheckCircle2 } from 'lucide-react';
import { api, type User } from '../services/api.ts';

interface SettingsViewProps {
  user: User | null;
  onLogout: () => void;
  onRefreshData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onLogout,
  onRefreshData,
}) => {
  const [healthInfo, setHealthInfo] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await api.getHealth();
      setHealthInfo(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHealth(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Ship Settings & Bridge Diagnostics
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          System health, server diagnostics, database persistence status, and account configuration.
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          Captain Profile & Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Captain Name
            </span>
            <span className="text-sm font-bold text-slate-900">{user?.name || 'Captain Luffy'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Pirate Email
            </span>
            <span className="text-sm font-bold text-slate-900">{user?.email || 'captain@mugiwara.com'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Fleet Rank
            </span>
            <span className="text-sm font-bold text-amber-700">Straw Hat Fleet Commander</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Title
            </span>
            <span className="text-sm font-bold text-slate-700">{user?.title || 'Student • Builder • Dreamer'}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Authenticated via Secure Session / HTTP Cookie</span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Backend & Database Health */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-500" />
            Backend & Persistence Diagnostics
          </h3>

          <button
            onClick={fetchHealth}
            disabled={loadingHealth}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin' : ''}`} />
            Run Ping
          </button>
        </div>

        {healthInfo ? (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">System Status: {healthInfo.status.toUpperCase()}</span>
              </div>
              <span className="text-[11px] font-semibold">{healthInfo.system}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Database Engine
                </span>
                <span className="font-bold text-slate-800">{healthInfo.database?.storageEngine}</span>
                <span className="block text-slate-500 text-[11px] mt-1">
                  Status: {healthInfo.database?.status}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  AI Integration
                </span>
                <span className="font-bold text-slate-800">
                  Google Gemini ({healthInfo.gemini?.model})
                </span>
                <span className="block text-slate-500 text-[11px] mt-1">
                  Key Configured: {healthInfo.gemini?.configured ? 'Yes (Server Environment)' : 'Pending Secret Injection'}
                </span>
              </div>
            </div>

            {healthInfo.database?.records && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-2 uppercase tracking-wider text-[10px]">
                  Persistent Records in Local Store
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <div className="text-base font-black text-slate-800">{healthInfo.database.records.userCount}</div>
                    <div className="text-[10px] text-slate-400">Users</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <div className="text-base font-black text-slate-800">{healthInfo.database.records.projectCount}</div>
                    <div className="text-[10px] text-slate-400">Projects</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <div className="text-base font-black text-slate-800">{healthInfo.database.records.taskCount}</div>
                    <div className="text-[10px] text-slate-400">Tasks</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <div className="text-base font-black text-slate-800">{healthInfo.database.records.memoryCount}</div>
                    <div className="text-[10px] text-slate-400">Memories</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <div className="text-base font-black text-slate-800">{healthInfo.database.records.conversationCount}</div>
                    <div className="text-[10px] text-slate-400">Chats</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <div className="text-base font-black text-slate-800">{healthInfo.database.records.activityCount}</div>
                    <div className="text-[10px] text-slate-400">Logs</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs">
            Diagnostics initializing...
          </div>
        )}
      </div>
    </div>
  );
};
