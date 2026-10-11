import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ProductivityChartProps {
  percentage?: number;
  weekdays?: Array<{ day: string; hours: number; heightPct: number }>;
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({
  percentage = 42,
  weekdays = [
    { day: 'Mon', hours: 4.5, heightPct: 40 },
    { day: 'Tue', hours: 6.2, heightPct: 60 },
    { day: 'Wed', hours: 5.8, heightPct: 55 },
    { day: 'Thu', hours: 7.5, heightPct: 75 },
    { day: 'Fri', hours: 8.9, heightPct: 90 },
    { day: 'Sat', hours: 4.0, heightPct: 35 },
    { day: 'Sun', hours: 6.5, heightPct: 65 },
  ],
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-800" />
            <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Productivity
            </h4>
          </div>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            Time saved this week
          </p>
        </div>

        {/* Badge: +42% ↗ */}
        <span className="flex items-center gap-1 font-extrabold text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
          +{percentage}% <span className="text-xs">↗</span>
        </span>
      </div>

      {/* Bar Chart Visualization */}
      <div className="mt-4 pt-2">
        <div className="h-28 flex items-end justify-between gap-1.5 sm:gap-2 px-1">
          {weekdays.map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-20">
                {item.hours}h saved
              </div>

              {/* Bar */}
              <div className="w-full max-w-[20px] rounded-t-md bg-slate-100 overflow-hidden flex flex-col justify-end h-24">
                <div
                  style={{ height: `${item.heightPct}%` }}
                  className="w-full bg-gradient-to-t from-sky-500 to-cyan-400 rounded-t-md group-hover:brightness-110 transition-all duration-300"
                />
              </div>

              {/* Day Label */}
              <span className="text-[10px] font-semibold text-slate-400 mt-1.5">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
