import React from 'react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-slate-200 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#475569]">
        <span>
          © Universidad Nacional Héroes de San José de las Mulas (UNHSJM)
        </span>
        <span className="text-[#94A3B8]">
          Sistema de Gestión Académica y Control de Asistencia
        </span>
      </div>
    </footer>
  );
};
