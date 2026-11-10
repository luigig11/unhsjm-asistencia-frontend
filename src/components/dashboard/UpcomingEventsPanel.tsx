import React from 'react';

export const UpcomingEventsPanel: React.FC = () => {
  return (
    <div className="lg:col-span-4 bg-[#FFFFFF] border border-slate-200 rounded-lg overflow-hidden text-left flex flex-col justify-between">
      <div>
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-[#0F3C6E]">
            Próximos Eventos / Feriados del Período
          </h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Fechas no lectivas y actividades del calendario escolar
          </p>
        </div>

        {/* Estado Vacío Limpio (Plantilla) */}
        <div className="p-10 text-center">
          <p className="text-sm font-semibold text-[#475569]">
            Sin eventos próximos registrados
          </p>
          <p className="text-xs text-[#94A3B8] mt-1.5 max-w-xs mx-auto leading-relaxed">
            Los feriados nacionales, períodos vacacionales y actividades institucionales se listarán aquí en orden cronológico.
          </p>
        </div>
      </div>

      <div className="p-3 bg-[#F8FAFC] border-t border-slate-200 text-right">
        <span className="text-[11px] text-[#475569]">
          Calendario Oficial UNHSJM
        </span>
      </div>
    </div>
  );
};
