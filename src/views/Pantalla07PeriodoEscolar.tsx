import React, { useMemo, useState } from 'react';

type EventType = {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
};

type SchoolPeriod = {
  id: string;
  nombre_periodo_escolar: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
};

type SchoolEvent = {
  id: string;
  id_periodo_escolar: string;
  id_tipo_evento: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
};

const EVENT_TYPES: EventType[] = [
  { id: 'tipo-feriado', codigo: 'FER-NAC', nombre: 'Feriado Nacional', activo: true },
  { id: 'tipo-vacaciones', codigo: 'VAC-FIN', nombre: 'Vacaciones', activo: true },
  { id: 'tipo-actividad', codigo: 'ACT-EXTRA', nombre: 'Actividad Extracurricular', activo: true },
];

// Datos de demostración. Se reemplazarán por respuestas de la API cuando Luis integre el backend.
const INITIAL_PERIODS: SchoolPeriod[] = [
  {
    id: 'periodo-2026',
    nombre_periodo_escolar: 'Año Lectivo 2026',
    fecha_inicio: '2026-01-12',
    fecha_fin: '2026-12-18',
    activo: true,
  },
  {
    id: 'periodo-2025',
    nombre_periodo_escolar: 'Año Lectivo 2025',
    fecha_inicio: '2025-01-13',
    fecha_fin: '2025-12-19',
    activo: false,
  },
];

const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'evento-demo-1',
    id_periodo_escolar: 'periodo-2026',
    id_tipo_evento: 'tipo-feriado',
    nombre: 'Feriado institucional de demostración',
    fecha_inicio: '2026-11-16T00:00',
    fecha_fin: '2026-11-16T23:59',
    activo: true,
  },
  {
    id: 'evento-demo-2',
    id_periodo_escolar: 'periodo-2026',
    id_tipo_evento: 'tipo-vacaciones',
    nombre: 'Receso académico de demostración',
    fecha_inicio: '2026-11-23T00:00',
    fecha_fin: '2026-11-25T23:59',
    activo: true,
  },
  {
    id: 'evento-demo-3',
    id_periodo_escolar: 'periodo-2026',
    id_tipo_evento: 'tipo-actividad',
    nombre: 'Jornada académica institucional',
    fecha_inicio: '2026-11-30T08:00',
    fecha_fin: '2026-11-30T16:00',
    activo: true,
  },
];

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

const pad = (value: number) => String(value).padStart(2, '0');
const dateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const parseLocalDate = (value: string) => new Date(`${value.slice(0, 10)}T12:00:00`);
const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-NI', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
const formatTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('es-NI', { hour: '2-digit', minute: '2-digit' }).format(date);
};

interface Pantalla07PeriodoEscolarProps {
  userRole?: 'ADMIN' | 'DIRECTOR';
}

export const Pantalla07PeriodoEscolar: React.FC<Pantalla07PeriodoEscolarProps> = ({ userRole = 'DIRECTOR' }) => {
  const [periods] = useState<SchoolPeriod[]>(INITIAL_PERIODS);
  const [selectedPeriodId, setSelectedPeriodId] = useState('periodo-2026');
  const [events, setEvents] = useState<SchoolEvent[]>(INITIAL_EVENTS);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2026, 10, 1));
  const [selectedDate, setSelectedDate] = useState('2026-11-16');
  const [modalOpen, setModalOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventTypeId, setEventTypeId] = useState(EVENT_TYPES[0].id);
  const [startDate, setStartDate] = useState('2026-11-16T08:00');
  const [endDate, setEndDate] = useState('2026-11-16T17:00');
  const [formError, setFormError] = useState('');

  const selectedPeriod = periods.find((period) => period.id === selectedPeriodId) ?? periods[0];
  const periodEvents = useMemo(
    () => events
      .filter((event) => event.id_periodo_escolar === selectedPeriodId && event.activo)
      .sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio)),
    [events, selectedPeriodId],
  );

  const monthTitle = new Intl.DateTimeFormat('es-NI', { month: 'long', year: 'numeric' }).format(visibleMonth);
  const calendarDays = useMemo(() => {
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

  const eventsForDay = (day: Date) => periodEvents.filter((event) => {
    const key = dateKey(day);
    return key >= event.fecha_inicio.slice(0, 10) && key <= event.fecha_fin.slice(0, 10);
  });

  const selectedDateEvents = periodEvents.filter((event) =>
    selectedDate >= event.fecha_inicio.slice(0, 10) && selectedDate <= event.fecha_fin.slice(0, 10),
  );

  const openEventModal = () => {
    setEventName('');
    setEventTypeId(EVENT_TYPES[0].id);
    setStartDate(`${selectedDate}T08:00`);
    setEndDate(`${selectedDate}T17:00`);
    setFormError('');
    setModalOpen(true);
  };

  const saveEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!eventName.trim()) {
      setFormError('Ingresá el nombre o descripción del evento.');
      return;
    }
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setFormError('La fecha y hora de finalización no puede ser anterior al inicio.');
      return;
    }
    const startDay = startDate.slice(0, 10);
    const endDay = endDate.slice(0, 10);
    if (startDay < selectedPeriod.fecha_inicio || endDay > selectedPeriod.fecha_fin) {
      setFormError('El rango del evento debe estar dentro del período escolar seleccionado.');
      return;
    }
    setEvents((current) => [...current, {
      id: `evento-local-${Date.now()}`,
      id_periodo_escolar: selectedPeriodId,
      id_tipo_evento: eventTypeId,
      nombre: eventName.trim(),
      fecha_inicio: startDate,
      fecha_fin: endDate,
      activo: true,
    }].sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio)));
    setSelectedDate(startDay);
    setVisibleMonth(new Date(`${startDay}T12:00:00`));
    setModalOpen(false);
  };

  const moveMonth = (amount: number) => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));

  return (
    <div className="w-full max-w-[1500px] mx-auto flex-1 p-4 sm:p-6 space-y-5">
      <header className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1D63B8]" /> Gestión académica <span className="text-[#CBD5E1]">/</span> Calendario escolar
          </div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#0F172A]">Período Escolar y Feriados</h1>
          <p className="text-sm text-[#64748B] mt-1">Administrá el año lectivo y los días que bloquean la programación de clases.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <label className="flex flex-col gap-1.5 min-w-[230px]">
            <span className="text-xs font-semibold text-[#475569]">Período escolar</span>
            <select
              value={selectedPeriodId}
              onChange={(event) => {
                const nextPeriod = periods.find((period) => period.id === event.target.value);
                setSelectedPeriodId(event.target.value);
                if (nextPeriod) {
                  setVisibleMonth(parseLocalDate(nextPeriod.fecha_inicio));
                  setSelectedDate(nextPeriod.fecha_inicio);
                }
              }}
              className="h-10 rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#1D63B8] focus:ring-2 focus:ring-[#1D63B8]/10"
            >
              {periods.map((period) => <option key={period.id} value={period.id}>{period.nombre_periodo_escolar}</option>)}
            </select>
          </label>
          <button type="button" onClick={openEventModal} className="h-10 px-4 rounded-md bg-[#0F3C6E] hover:bg-[#0A294D] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
            <span className="text-lg leading-none">+</span> Registrar evento
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
          <p className="text-xs font-medium text-[#64748B]">Inicio del período</p>
          <p className="text-lg font-bold text-[#0F172A] mt-1">{formatDate(selectedPeriod.fecha_inicio)}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
          <p className="text-xs font-medium text-[#64748B]">Fin del período</p>
          <p className="text-lg font-bold text-[#0F172A] mt-1">{formatDate(selectedPeriod.fecha_fin)}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
          <p className="text-xs font-medium text-[#64748B]">Eventos no lectivos registrados</p>
          <p className="text-lg font-bold text-[#0F3C6E] mt-1">{periodEvents.length} <span className="text-xs font-medium text-[#64748B]">activos</span></p>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.65fr)_minmax(330px,0.9fr)] gap-5 items-start">
        <section className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0F172A] capitalize">{monthTitle}</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Seleccioná un día para consultar sus eventos.</p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button type="button" onClick={() => moveMonth(-1)} aria-label="Mes anterior" className="w-9 h-9 border border-[#E2E8F0] rounded-md text-[#475569] hover:bg-[#F8FAFC]">‹</button>
              <button type="button" onClick={() => setVisibleMonth(new Date(2026, 10, 1))} className="h-9 px-3 border border-[#E2E8F0] rounded-md text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC]">Hoy / demo</button>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Mes siguiente" className="w-9 h-9 border border-[#E2E8F0] rounded-md text-[#475569] hover:bg-[#F8FAFC]">›</button>
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => <div key={day} className="py-3 text-center text-[11px] font-bold uppercase tracking-wide text-[#64748B]">{day}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const key = dateKey(day);
              const inMonth = day.getMonth() === visibleMonth.getMonth();
              const inPeriod = key >= selectedPeriod.fecha_inicio && key <= selectedPeriod.fecha_fin;
              const dayEvents = eventsForDay(day);
              const isSelected = key === selectedDate;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setSelectedDate(key)}
                  disabled={!inPeriod}
                  className={`min-h-[76px] sm:min-h-[102px] p-1.5 sm:p-2 border-r border-b border-[#E2E8F0] text-left transition-colors ${!inMonth ? 'bg-[#FBFCFE]' : 'bg-white'} ${!inPeriod ? 'opacity-35 cursor-not-allowed' : 'hover:bg-[#F8FAFC]'} ${isSelected ? 'ring-2 ring-inset ring-[#1D63B8] bg-[#EBF3FC]/50' : ''}`}
                >
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ${isSelected ? 'bg-[#0F3C6E] text-white' : inMonth ? 'text-[#334155]' : 'text-[#94A3B8]'}`}>{day.getDate()}</span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((item) => {
                      const style = EVENT_STYLE[item.id_tipo_evento] ?? EVENT_STYLE['tipo-actividad'];
                      return <div key={item.id} className={`hidden sm:flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold truncate ${style.chip}`}><span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} /><span className="truncate">{item.nombre}</span></div>;
                    })}
                    {dayEvents.length > 0 && <div className="flex sm:hidden gap-1 pt-0.5">{dayEvents.slice(0, 3).map((item) => <span key={item.id} className={`w-1.5 h-1.5 rounded-full ${EVENT_STYLE[item.id_tipo_evento]?.dot ?? 'bg-[#1D63B8]'}`} />)}</div>}
                    {dayEvents.length > 2 && <p className="hidden sm:block text-[9px] text-[#64748B] pl-1">+{dayEvents.length - 2} más</p>}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="p-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#E2E8F0]">
            {EVENT_TYPES.map((type) => {
              const style = EVENT_STYLE[type.id];
              return <div key={type.id} className="flex items-center gap-2 text-[11px] text-[#64748B]"><span className={`w-2 h-2 rounded-full ${style.dot}`} />{type.nombre}</div>;
            })}
          </div>
        </section>

        <aside className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Feriados y eventos</h2>
                <p className="text-xs text-[#64748B] mt-1">Registros del período escolar seleccionado.</p>
              </div>
              <span className="px-2 py-1 rounded-full bg-[#EBF3FC] text-[#0F3C6E] text-[10px] font-bold">{periodEvents.length} registros</span>
            </div>
            <div className="mt-4 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] p-3">
              <p className="text-[10px] uppercase tracking-wide font-bold text-[#64748B]">Día seleccionado</p>
              <p className="text-sm font-bold text-[#0F172A] mt-1">{new Intl.DateTimeFormat('es-NI', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(parseLocalDate(selectedDate))}</p>
              <p className="text-xs text-[#64748B] mt-1">{selectedDateEvents.length ? `${selectedDateEvents.length} evento(s) en esta fecha` : 'No hay eventos registrados para esta fecha.'}</p>
            </div>
          </div>
          <div className="p-4 sm:p-5 space-y-3 max-h-[610px] overflow-y-auto">
            {periodEvents.length === 0 ? (
              <div className="py-10 text-center"><div className="text-3xl text-[#CBD5E1]">▦</div><p className="text-sm font-semibold text-[#475569] mt-2">Sin eventos registrados</p><p className="text-xs text-[#94A3B8] mt-1">Los eventos del período aparecerán aquí.</p></div>
            ) : periodEvents.map((item) => {
              const style = EVENT_STYLE[item.id_tipo_evento] ?? EVENT_STYLE['tipo-actividad'];
              const type = EVENT_TYPES.find((option) => option.id === item.id_tipo_evento);
              return (
                <article key={item.id} className={`rounded-lg border p-3 ${selectedDate >= item.fecha_inicio.slice(0, 10) && selectedDate <= item.fecha_fin.slice(0, 10) ? 'border-[#1D63B8] bg-[#F8FBFF]' : 'border-[#E2E8F0] bg-white'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><span className={`inline-flex px-2 py-1 rounded border text-[10px] font-bold ${style.chip}`}>{type?.nombre ?? 'Evento'}</span><h3 className="text-sm font-bold text-[#0F172A] mt-2">{item.nombre}</h3></div>
                    <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${style.dot}`} />
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#E2E8F0] grid grid-cols-2 gap-2 text-[11px]">
                    <div><p className="text-[#94A3B8]">Desde</p><p className="font-semibold text-[#475569] mt-0.5">{formatDate(item.fecha_inicio)}</p><p className="text-[#64748B]">{formatTime(item.fecha_inicio)}</p></div>
                    <div><p className="text-[#94A3B8]">Hasta</p><p className="font-semibold text-[#475569] mt-0.5">{formatDate(item.fecha_fin)}</p><p className="text-[#64748B]">{formatTime(item.fecha_fin)}</p></div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="border-t border-[#E2E8F0] p-4 bg-[#F8FAFC]">
            <p className="text-[11px] leading-relaxed text-[#64748B]">Los eventos activos registrados en este calendario se consideran al generar las sesiones académicas.</p>
          </div>
        </aside>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 p-4 flex items-center justify-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="modal-event-title" className="w-full max-w-lg bg-white rounded-lg border border-[#E2E8F0] shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-3">
              <div><p className="text-[10px] uppercase tracking-wider font-bold text-[#1D63B8]">Modal C · Calendario escolar</p><h2 id="modal-event-title" className="text-lg font-bold text-[#0F172A] mt-1">Registrar feriado o evento</h2><p className="text-xs text-[#64748B] mt-1">El evento quedará asociado al período escolar seleccionado.</p></div>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Cerrar modal" className="w-8 h-8 rounded-md text-[#64748B] hover:bg-[#F1F5F9] text-xl">×</button>
            </div>
            <form onSubmit={saveEvent} className="p-5 space-y-4">
              <label className="block"><span className="block text-xs font-semibold text-[#475569] mb-1.5">Nombre del evento</span><input value={eventName} onChange={(event) => setEventName(event.target.value)} maxLength={150} required placeholder="Ej. Feriado nacional" className="w-full h-10 rounded-md border border-[#CBD5E1] px-3 text-sm outline-none focus:border-[#1D63B8] focus:ring-2 focus:ring-[#1D63B8]/10" /></label>
              <label className="block"><span className="block text-xs font-semibold text-[#475569] mb-1.5">Tipo de evento</span><select value={eventTypeId} onChange={(event) => setEventTypeId(event.target.value)} className="w-full h-10 rounded-md border border-[#CBD5E1] bg-white px-3 text-sm outline-none focus:border-[#1D63B8]">{EVENT_TYPES.filter((type) => type.activo).map((type) => <option key={type.id} value={type.id}>{type.nombre}</option>)}</select></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block"><span className="block text-xs font-semibold text-[#475569] mb-1.5">Fecha y hora de inicio</span><input type="datetime-local" value={startDate} onChange={(event) => setStartDate(event.target.value)} required className="w-full h-10 rounded-md border border-[#CBD5E1] px-2 text-xs outline-none focus:border-[#1D63B8]" /></label>
                <label className="block"><span className="block text-xs font-semibold text-[#475569] mb-1.5">Fecha y hora de fin</span><input type="datetime-local" value={endDate} onChange={(event) => setEndDate(event.target.value)} required className="w-full h-10 rounded-md border border-[#CBD5E1] px-2 text-xs outline-none focus:border-[#1D63B8]" /></label>
              </div>
              {formError && <p role="alert" className="text-xs font-medium text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-md p-2.5">{formError}</p>}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button type="button" onClick={() => setModalOpen(false)} className="h-10 px-4 rounded-md border border-[#CBD5E1] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC]">Cancelar</button>
                <button type="submit" className="h-10 px-4 rounded-md bg-[#0F3C6E] hover:bg-[#0A294D] text-white text-sm font-semibold">Guardar evento</button>
              </div>
            </form>
          </section>
        </div>
      )}
      <p className="text-[10px] text-[#94A3B8]">Vista de demostración · {userRole === 'ADMIN' ? 'Administrador' : 'Director'} · Datos locales de ejemplo, sin persistencia en base de datos.</p>
    </div>
  );
};
