import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface SystemStatusProps {
  status?: string;
  message?: string;
  database?: string;
  geminiConfigured?: boolean;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  status = 'Healthy',
  message = 'No issues detected.',
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-slate-800" />
          <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
            System Status
          </h4>
        </div>

        {/* Badge: ● Healthy */}
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {status}
        </span>
      </div>

      {/* Status Details */}
      <div className="text-xs text-slate-600">
        <p className="font-semibold text-slate-800">{message}</p>
        <p className="text-slate-400 mt-0.5">Your system is running smoothly.</p>
      </div>
    </div>
  );
};
