import React from 'react';
import { AcademicCapIcon, ShieldCheckIcon, CalendarIcon } from '../common/Icons';

export const LoginBrandingPanel: React.FC = () => {
  return (
    <section className="lg:col-span-5 bg-[#0F3C6E] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#0A294D] text-left">
      <div>
        {/* Emblema Institucional */}
        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-12 h-12 rounded-lg bg-[#0A294D] border border-[#1D63B8] flex items-center justify-center shrink-0">
            <AcademicCapIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="inline-block text-[11px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#0A294D] text-[#EBF3FC] border border-[#1D63B8] font-medium">
              Gestión Universitaria
            </span>
            <h2 className="text-base font-bold text-white mt-1 leading-snug">
              UNHSJM
            </h2>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
          Sistema de Gestión Académica y Control de Asistencia
        </h1>

        <p className="text-sm text-[#EBF3FC]/90 leading-relaxed mb-6">
          Plataforma institucional para la planificación curricular, programación de oferta académica y control de asistencia docente y estudiantil.
        </p>

        <div className="space-y-3 pt-4 border-t border-[#1D63B8]/40">
          <div className="flex items-start gap-2.5">
            <ShieldCheckIcon className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-xs text-[#EBF3FC] leading-relaxed">
              Acceso exclusivo para personal administrativo, directores de área y cuerpo docente.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <CalendarIcon className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-xs text-[#EBF3FC] leading-relaxed">
              Control sincronizado de calendario lectivo, horarios y registro de asistencia en aula.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-[#1D63B8]/40">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="h-1 w-8 rounded-full bg-[#1D63B8]" />
          <span className="h-1 w-4 rounded-full bg-[#D97706]" />
          <span className="h-1 w-4 rounded-full bg-[#C81E2B]" />
        </div>
        <p className="text-xs text-[#EBF3FC]/80">
          Universidad Nacional Héroes de San José de las Mulas
        </p>
      </div>
    </section>
  );
};
