import React from 'react';
import { Compass, Sparkles, Cog, ShieldCheck, ArrowRight } from 'lucide-react';

interface AITaskFlowProps {
  onStepClick?: (step: string) => void;
}

export const AITaskFlow: React.FC<AITaskFlowProps> = ({ onStepClick }) => {
  const steps = [
    {
      id: 'plan',
      label: 'Plan',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      circleBg: 'bg-amber-100 text-amber-600 border-amber-300',
    },
    {
      id: 'execute',
      label: 'Execute',
      icon: <Cog className="w-4 h-4 text-blue-500" />,
      circleBg: 'bg-blue-100 text-blue-600 border-blue-300',
    },
    {
      id: 'verify',
      label: 'Verify',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      circleBg: 'bg-emerald-100 text-emerald-600 border-emerald-300',
    },
    {
      id: 'done',
      label: 'Done',
      icon: <ArrowRight className="w-4 h-4 text-slate-700" />,
      circleBg: 'bg-slate-100 text-slate-800 border-slate-300',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-5 h-5 text-slate-700" />
        <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
          AI Task Flow
        </h4>
      </div>

      {/* Stepper Flow */}
      <div className="relative flex items-center justify-between px-2 sm:px-6 my-4">
        {/* Dotted connecting line */}
        <div className="absolute top-4 left-8 right-8 h-0.5 border-t-2 border-dotted border-slate-300 z-0" />

        {steps.map((step, idx) => (
          <div
            key={step.id}
            onClick={() => onStepClick?.(step.id)}
            className="relative z-10 flex flex-col items-center group cursor-pointer"
          >
            <div
              className={`w-9 h-9 rounded-full ${step.circleBg} border flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 bg-white`}
            >
              {step.icon}
            </div>
            <span className="mt-2 text-xs font-bold text-slate-700 group-hover:text-amber-600 transition-colors">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Quote Banner */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <p className="text-xs italic font-medium text-slate-500">
          "From idea to execution, your crew has your back."
        </p>
      </div>
    </div>
  );
};
