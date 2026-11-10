import React from 'react';
import {
  CalendarIcon,
  UsersIcon,
  ChecklistIcon,
  AlertTriangleIcon,
} from '../common/Icons';

export const DashboardKPIs: React.FC = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI 1: Período Escolar Activo */}
      <div className="bg-[#FFFFFF] border border-slate-200 rounded-lg p-4 text-left flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#475569]">
              Período Escolar Activo
            </span>
            <p className="text-xl font-bold text-[#0F172A] mt-1 font-mono">
              —
            </p>
          </div>
          <div className="w-10 h-10 rounded-md bg-[#EBF3FC] border border-[#93C5FD] flex items-center justify-center text-[#0F3C6E] shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[#475569]">Vigencia del período</span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-[#475569] border border-slate-200">
            Sin definir
          </span>
        </div>
      </div>

      {/* KPI 2: Grupos Ofertados */}
      <div className="bg-[#FFFFFF] border border-slate-200 rounded-lg p-4 text-left flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#475569]">
              Grupos Ofertados
            </span>
            <p className="text-2xl font-bold text-[#0F172A] mt-1 font-mono">
              0
            </p>
          </div>
          <div className="w-10 h-10 rounded-md bg-[#EBF3FC] border border-[#93C5FD] flex items-center justify-center text-[#1D63B8] shrink-0">
            <UsersIcon className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[#475569]">Asignaturas programadas</span>
          <span className="font-mono font-semibold text-[#0F3C6E]">
            0
          </span>
        </div>
      </div>

      {/* KPI 3: Sesiones de Hoy */}
      <div className="bg-[#FFFFFF] border border-slate-200 rounded-lg p-4 text-left flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#475569]">
              Sesiones de Hoy
            </span>
            <p className="text-2xl font-bold text-[#0F172A] mt-1 font-mono">
              0
            </p>
          </div>
          <div className="w-10 h-10 rounded-md bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center text-[#15803D] shrink-0">
            <ChecklistIcon className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[#475569]">Actas registradas hoy</span>
          <span className="font-mono font-semibold text-[#15803D]">
            0 / 0
          </span>
        </div>
      </div>

      {/* KPI 4: Alertas de Ausencia Docente */}
      <div className="bg-[#FFFFFF] border border-slate-200 rounded-lg p-4 text-left flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#475569]">
              Alertas de Ausencia Docente
            </span>
            <p className="text-2xl font-bold text-[#C81E2B] mt-1 font-mono">
              0
            </p>
          </div>
          <div className="w-10 h-10 rounded-md bg-[#FEE2E2] border border-[#FCA5A5] flex items-center justify-center text-[#C81E2B] shrink-0">
            <AlertTriangleIcon className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[#475569]">Incidencias o sustituciones</span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-[#475569] border border-slate-200">
            Sin alertas
          </span>
        </div>
      </div>
    </section>
  );
};
