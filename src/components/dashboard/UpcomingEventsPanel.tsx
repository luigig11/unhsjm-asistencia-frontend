import React from 'react';
import type { ProximoEventoDashboard } from '../../api/dashboard';
import { CalendarIcon } from '../common/Icons';

interface UpcomingEventsPanelProps {
  eventos?: ProximoEventoDashboard[];
  loading?: boolean;
}

const formatFecha = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    return iso.split('T')[0] || iso;
  }
  return d.toLocaleDateString('es-NI', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const UpcomingEventsPanel: React.FC<UpcomingEventsPanelProps> = ({
  eventos = [],
  loading = false,
}) => {
  return (
    <div className="lg:col-span-4 bg-[#FFFFFF] border border-slate-200 rounded-lg overflow-hidden text-left flex flex-col justify-between shadow-sm">
      <div>
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-[#0F3C6E]">
            Próximos Eventos / Feriados del Período
          </h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Fechas no lectivas y actividades del calendario escolar
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-[#475569]">
            <div className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#1D63B8] border-t-transparent rounded-full animate-spin" />
              <span>Cargando eventos...</span>
            </div>
          </div>
        ) : eventos.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-[#475569]">
              Sin eventos próximos registrados
            </p>
            <p className="text-xs text-[#94A3B8] mt-1.5 max-w-xs mx-auto leading-relaxed">
              Los feriados nacionales, períodos vacacionales y actividades institucionales se listarán aquí en orden cronológico.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
            {eventos.map((ev) => (
              <div
                key={ev.id_feriado}
                className="p-3.5 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-[#0F172A] leading-snug">
                    {ev.nombre}
                  </h3>
                  <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EBF3FC] text-[#0F3C6E] border border-[#93C5FD]">
                    {ev.tipo_evento}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#475569] mt-2 font-mono">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                  <span>{formatFecha(ev.fecha_inicio)}</span>
                  {ev.fecha_fin && ev.fecha_fin !== ev.fecha_inicio && (
                    <>
                      <span className="text-slate-400">→</span>
                      <span>{formatFecha(ev.fecha_fin)}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 bg-[#F8FAFC] border-t border-slate-200 text-right">
        <span className="text-[11px] text-[#475569] font-medium">
          Calendario Oficial UNHSJM
        </span>
      </div>
    </div>
  );
};
