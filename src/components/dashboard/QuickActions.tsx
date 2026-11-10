import React from 'react';

interface QuickActionsProps {
  onNavigate?: (screenKey: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  return (
    <section className="bg-[#FFFFFF] border border-slate-200 rounded-lg p-4">
      <div className="mb-3 text-left">
        <h2 className="text-sm font-bold text-[#0F3C6E] uppercase tracking-wider">
          Accesos Rápidos
        </h2>
        <p className="text-xs text-[#475569]">
          Módulos principales de administración académica y configuración curricular
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
        <button
          type="button"
          onClick={() => onNavigate?.('P03')}
          className="p-3.5 rounded-md border border-slate-200 bg-[#F8FAFC] hover:bg-[#EBF3FC] hover:border-[#1D63B8] transition-colors flex items-start justify-between gap-2 group"
        >
          <div>
            <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#0F3C6E]">
              Usuarios y Expediente Docente
            </p>
            <p className="text-xs text-[#475569] mt-0.5">
              Administración de cuentas, roles y personal docente
            </p>
          </div>
          <span className="text-[#0F3C6E] font-mono text-sm">→</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate?.('P04')}
          className="p-3.5 rounded-md border border-slate-200 bg-[#F8FAFC] hover:bg-[#EBF3FC] hover:border-[#1D63B8] transition-colors flex items-start justify-between gap-2 group"
        >
          <div>
            <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#0F3C6E]">
              Catálogos Institucionales
            </p>
            <p className="text-xs text-[#475569] mt-0.5">
              Direcciones, carreras, asignaturas, aulas y estudiantes
            </p>
          </div>
          <span className="text-[#0F3C6E] font-mono text-sm">→</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate?.('P05')}
          className="p-3.5 rounded-md border border-slate-200 bg-[#F8FAFC] hover:bg-[#EBF3FC] hover:border-[#1D63B8] transition-colors flex items-start justify-between gap-2 group"
        >
          <div>
            <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#0F3C6E]">
              Planes Académicos
            </p>
            <p className="text-xs text-[#475569] mt-0.5">
              Listado y vigencia de planes de estudio por carrera
            </p>
          </div>
          <span className="text-[#0F3C6E] font-mono text-sm">→</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate?.('P06')}
          className="p-3.5 rounded-md border border-slate-200 bg-[#F8FAFC] hover:bg-[#EBF3FC] hover:border-[#1D63B8] transition-colors flex items-start justify-between gap-2 group"
        >
          <div>
            <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#0F3C6E]">
              Constructor de Pensum
            </p>
            <p className="text-xs text-[#475569] mt-0.5">
              Diseño de bloques por ciclo, asignaturas y prerrequisitos
            </p>
          </div>
          <span className="text-[#0F3C6E] font-mono text-sm">→</span>
        </button>
      </div>
    </section>
  );
};
