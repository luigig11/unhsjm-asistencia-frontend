import React from 'react';
import type { SchoolEvent } from './PeriodCalendar';
import { CalendarIcon } from '../common/Icons';

interface PeriodEventListProps {
  events: SchoolEvent[];
  selectedDate: string;
}

const EVENT_STYLE: Record<string, { dot: string; chip: string; label: string }> = {
  'tipo-feriado': {
    dot: 'bg-[#C81E2B]',
    chip: 'bg-[#FCEBEC] text-[#A31621] border-[#F5C6C9]',
    label: 'Feriado',
  },
  'tipo-vacaciones': {
    dot: 'bg-[#D97706]',
    chip: 'bg-[#FFF4E5] text-[#9A5800] border-[#F5D6A8]',
    label: 'Vacaciones',
  },
  'tipo-actividad': {
    dot: 'bg-[#1D63B8]',
    chip: 'bg-[#EBF3FC] text-[#0F3C6E] border-[#C8DCF4]',
    label: 'Actividad',
  },
};

const formatTimeRange = (start: string, end: string) => {
  const dStart = new Date(start);
  const dEnd = new Date(end);
  const timeStart = dStart.toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' });
  const timeEnd = dEnd.toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' });
  return `${timeStart} - ${timeEnd}`;
};

export const PeriodEventList: React.FC<PeriodEventListProps> = ({
  events,
  selectedDate,
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 sm:p-5 text-left flex flex-col h-full">
      <div className="border-b border-[#E2E8F0] pb-3 mb-3">
        <h3 className="text-sm font-bold text-[#0F172A]">
          Feriados y Eventos del Período
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          Fecha seleccionada: <span className="font-semibold text-[#0F172A]">{selectedDate}</span>
        </p>
      </div>

      <div className="space-y-2.5 overflow-y-auto flex-1 max-h-[460px]">
        {events.length === 0 ? (
          <div className="text-center py-8 px-4 text-[#94A3B8]">
            <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-[#CBD5E1]" />
            <p className="text-xs font-medium text-[#475569]">No hay feriados ni eventos registrados</p>
            <p className="text-[11px] mt-0.5">Utiliza el botón "+ Registrar Evento" para programar días no lectivos.</p>
          </div>
        ) : (
          events.map((ev) => {
            const style = EVENT_STYLE[ev.id_tipo_evento] || EVENT_STYLE['tipo-feriado'];
            return (
              <div
                key={ev.id}
                className="p-3 rounded-md border border-[#E2E8F0] hover:border-[#1D63B8] transition-colors text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${style.chip}`}>
                    {style.label}
                  </span>
                  <span className="font-mono text-[10px] text-[#64748B]">
                    {ev.fecha_inicio.slice(0, 10)}
                  </span>
                </div>

                <p className="font-bold text-[#0F172A] leading-snug">
                  {ev.nombre}
                </p>

                <p className="text-[11px] text-[#64748B]">
                  Horario: {formatTimeRange(ev.fecha_inicio, ev.fecha_fin)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
