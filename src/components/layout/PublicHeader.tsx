import React from 'react';

export const PublicHeader: React.FC = () => {
  return (
    <header className="w-full bg-[#FFFFFF] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[#0F3C6E] text-white font-mono text-xs font-semibold tracking-wider">
            UN
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-left">
            <span className="text-sm font-bold text-[#0F3C6E] tracking-tight">
              UNHSJM
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-xs text-[#475569] font-medium">
              Universidad Nacional Héroes de San José de las Mulas
            </span>
          </div>
        </div>

        <span className="text-xs font-medium text-[#475569]">
          Portal Académico Institucional
        </span>
      </div>
    </header>
  );
};
