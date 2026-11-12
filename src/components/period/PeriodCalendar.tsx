import React from 'react';
import type { EventType } from './ModalEventoFeriado';

export interface SchoolEvent {
  id: string;
  id_periodo_escolar: string;
  id_tipo_evento: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

interface PeriodCalendarProps {
  visibleMonth: Date;
  onMoveMonth: (amount: number) => void;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  events: SchoolEvent[];
  eventTypes: EventType[];
}

const pad = (value: number) => String(value).padStart(2, '0');
const dateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

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

export const PeriodCalendar: React.FC<PeriodCalendarProps> = ({
  visibleMonth,
  onMoveMonth,
  selectedDate,
  onSelectDate,
  events,
}) => {
  const monthTitle = new Intl.DateTimeFormat('es-NI', {
    month: 'long',
    year: 'numeric',
  }).format(visibleMonth);

  const calendarDays = React.useMemo(() => {
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - mondayOffset);
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [visibleMonth]);

  const eventsForDay = (day: Date) =>
    events.filter((event) => {
      const key = dateKey(day);
      return (
        key >= event.fecha_inicio.slice(0, 10) &&
        key <= event.fecha_fin.slice(0, 10)
      );
    });

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 sm:p-5 text-left">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-bold text-[#0F172A] capitalize">
            {monthTitle}
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Selecciona un día para consultar o registrar feriados
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onMoveMonth(-1)}
            className="w-8 h-8 rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-[#475569] cursor-pointer"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => onMoveMonth(1)}
            className="w-8 h-8 rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-[#475569] cursor-pointer"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#64748B] border-b border-[#E2E8F0] pb-2 mb-2">
        <span>Lun</span>
        <span>Mar</span>
        <span>Mié</span>
        <span>Jue</span>
        <span>Vie</span>
        <span>Sáb</span>
        <span>Dom</span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const key = dateKey(day);
          const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
          const isSelected = key === selectedDate;
          const dayEvents = eventsForDay(day);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(key)}
              className={`min-h-[64px] p-1.5 rounded-md border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                isSelected
                  ? 'border-[#1D63B8] ring-1 ring-[#1D63B8] bg-[#EBF3FC]/40'
                  : 'border-[#F1F5F9] hover:border-[#CBD5E1]'
              } ${isCurrentMonth ? 'bg-white text-[#0F172A]' : 'bg-[#F8FAFC]/80 text-[#94A3B8]'}`}
            >
              <span className="text-xs font-semibold">{day.getDate()}</span>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 2).map((ev) => {
                  const style = EVENT_STYLE[ev.id_tipo_evento] || EVENT_STYLE['tipo-feriado'];
                  return (
                    <span
                      key={ev.id}
                      className={`block truncate text-[9px] font-semibold px-1 py-0.2 rounded border ${style.chip}`}
                    >
                      {ev.nombre}
                    </span>
                  );
                })}
                {dayEvents.length > 2 && (
                  <span className="text-[9px] font-medium text-[#64748B]">
                    +{dayEvents.length - 2} más
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
