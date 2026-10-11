import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, Zap } from 'lucide-react';
import type { DashboardSummary } from '../services/api.ts';

interface AnalyticsViewProps {
  summary: DashboardSummary | null;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ summary }) => {
  const weekdays = summary?.productivity?.weekdays || [
    { day: 'Mon', hours: 4.5, heightPct: 40 },
    { day: 'Tue', hours: 6.2, heightPct: 60 },
    { day: 'Wed', hours: 5.8, heightPct: 55 },
    { day: 'Thu', hours: 7.5, heightPct: 75 },
    { day: 'Fri', hours: 8.9, heightPct: 90 },
    { day: 'Sat', hours: 4.0, heightPct: 35 },
    { day: 'Sun', hours: 6.5, heightPct: 65 },
  ];

  const totalHours = weekdays.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Productivity & Grand Line Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Measurable efficiency gains driven by your distributed AI crew.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Weekly Time Saved</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalHours.toFixed(1)} hrs</div>
          <span className="text-xs font-bold text-emerald-600 mt-1 inline-block">
            +42% vs baseline sprint
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Projects</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {summary?.projectsCount || 3}
          </div>
          <span className="text-xs font-medium text-slate-500 mt-1 inline-block">
            {summary?.activeProjectsCount || 3} active expeditions
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tasks Conquered</span>
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {summary?.completedTasksCount || 1} / {summary?.tasksCount || 4}
          </div>
          <span className="text-xs font-medium text-slate-500 mt-1 inline-block">
            {summary?.tasksCount ? Math.round(((summary.completedTasksCount || 1) / summary.tasksCount) * 100) : 75}% completion rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Agents</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">5 Crew Members</div>
          <span className="text-xs font-bold text-amber-600 mt-1 inline-block">
            ● 100% Operational
          </span>
        </div>
      </div>

      {/* Big Chart Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Daily Hours Saved Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Calculated across research synthesis, code writing, and testing
            </p>
          </div>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
            Week 41
          </span>
        </div>

        <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-4">
          {weekdays.map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center group">
              <span className="text-xs font-bold text-slate-700 mb-2 group-hover:text-amber-600">
                {item.hours}h
              </span>
              <div className="w-full max-w-[48px] rounded-t-xl bg-slate-100 h-48 flex flex-col justify-end overflow-hidden">
                <div
                  style={{ height: `${item.heightPct}%` }}
                  className="w-full bg-gradient-to-t from-sky-500 to-cyan-400 group-hover:from-amber-500 group-hover:to-amber-400 rounded-t-xl transition-all duration-300"
                />
              </div>
              <span className="text-xs font-bold text-slate-500 mt-3">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
