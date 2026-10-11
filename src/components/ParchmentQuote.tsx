import React from 'react';
import { JollyRogerIcon } from './Icons.tsx';

export const ParchmentQuote: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f6e6cd] via-[#ebd5ad] to-[#e1c597] p-5 text-[#42250d] shadow-md border border-[#cba770]/60">
      {/* Background vintage Jolly Roger watermark */}
      <div className="absolute -right-3 -bottom-4 opacity-15 pointer-events-none">
        <JollyRogerIcon size={110} />
      </div>

      <div className="relative z-10">
        <p
          style={{ fontFamily: "'Caveat', cursive" }}
          className="text-2xl sm:text-[26px] font-bold leading-snug text-[#3c220c] drop-shadow-2xs pr-10"
        >
          "Every task is a step closer to your own One Piece."
        </p>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#cba770]/40">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7e4f1f]">
            — Straw Hat Decree
          </span>
          <div className="w-7 h-7 rounded-lg bg-[#3c220c] flex items-center justify-center shadow-xs">
            <JollyRogerIcon size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
