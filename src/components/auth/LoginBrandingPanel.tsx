import React from 'react';
import { ShieldCheckIcon, CalendarIcon } from '../common/Icons';

export const LoginBrandingPanel: React.FC = () => {
  return (
    <section className="lg:col-span-5 bg-[#0F3C6E] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#0A294D] text-left">
      <div>
        {/* Cabecera con logo y nombre institucional */}
        <div className="flex items-center gap-3.5 mb-8">
          {/* Contenedor del isotipo */}
          <div className="w-14 h-14 rounded-lg bg-white p-1.5 border border-white/20 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src="/Logos/Logo_Color_Sin_Letras.png"
              alt="Emblema Oficial UNHSJM"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            {/* Píldora de categoría */}
            <span className="inline-block text-[11px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#0A294D] text-[#EBF3FC] border border-[#1D63B8] font-medium">
              Gestión Universitaria
            </span>
            {/* Siglas institucionales */}
            <h2 className="text-base font-bold text-white mt-1 leading-snug">
              UNHSJM
            </h2>
          </div>
        </div>

        {/* Título principal del sistema */}
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
          Sistema de Gestión Académica y Control de Asistencia
        </h1>

        {/* Párrafo descriptivo */}
        <p className="text-sm text-[#EBF3FC]/90 leading-relaxed mb-6">
          Plataforma institucional para la planificación curricular, programación de oferta académica y control de asistencia docente y estudiantil.
        </p>

        {/* Lista de características informativas */}
        <div className="space-y-3 pt-4 border-t border-[#1D63B8]/40">
          {/* Viñeta 1: Acceso exclusivo */}
          <div className="flex items-start gap-2.5">
            {/* Ícono de seguridad */}
            <ShieldCheckIcon className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-xs text-[#EBF3FC] leading-relaxed">
              Acceso exclusivo para personal administrativo, directores de área y cuerpo docente.
            </p>
          </div>

          {/* Viñeta 2: Sincronización de calendario */}
          <div className="flex items-start gap-2.5">
            {/* Ícono de calendario */}
            <CalendarIcon className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-xs text-[#EBF3FC] leading-relaxed">
              Control sincronizado de calendario lectivo, horarios y registro de asistencia en aula.
            </p>
          </div>
        </div>
      </div>

      {/* Pie del panel con colores de identidad */}
      <div className="mt-8 pt-4 border-t border-[#1D63B8]/40">
        {/* Barra tricolor institucional */}
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
