import React, { useState, useMemo } from 'react';
import { PeriodHeader } from '../components/period/PeriodHeader';
import type { SchoolPeriod } from '../components/period/PeriodHeader';
import { PeriodCalendar } from '../components/period/PeriodCalendar';
import type { SchoolEvent } from '../components/period/PeriodCalendar';
import { PeriodEventList } from '../components/period/PeriodEventList';
import { ModalEventoFeriado, EVENT_TYPES } from '../components/period/ModalEventoFeriado';

export const AcademicPeriod: React.FC = () => {
  const [periods] = useState<SchoolPeriod[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('sin-periodo');
  const [events, setEvents] = useState<SchoolEvent[]>([]);

  const [visibleMonth, setVisibleMonth] = useState<Date>(() => new Date(2026, 10, 1));
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-16');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const defaultPeriod: SchoolPeriod = {
    id: 'sin-periodo',
    nombre_periodo_escolar: 'Sin período activo',
    fecha_inicio: '2026-01-01',
    fecha_fin: '2026-12-31',
    activo: false,
  };

  const selectedPeriod =
    periods.find((period) => period.id === selectedPeriodId) ??
    periods[0] ??
    defaultPeriod;

  const periodEvents = useMemo(
    () =>
      events
        .filter((event) => event.id_periodo_escolar === selectedPeriodId && event.activo)
        .sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio)),
    [events, selectedPeriodId]
  );

  const handleSaveEvent = (data: {
    nombre: string;
    id_tipo_evento: string;
    fecha_inicio: string;
    fecha_fin: string;
  }) => {
    const newEvent: SchoolEvent = {
      id: `evento-${Date.now()}`,
      id_periodo_escolar: selectedPeriodId,
      id_tipo_evento: data.id_tipo_evento,
      nombre: data.nombre,
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin,
      activo: true,
    };
    setEvents((prev) => [...prev, newEvent]);
    setSelectedDate(data.fecha_inicio.slice(0, 10));
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto flex-1 p-4 sm:p-6 space-y-5">
      <PeriodHeader
        periods={periods}
        selectedPeriodId={selectedPeriodId}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriodId}
        onOpenEventModal={() => setModalOpen(true)}
        totalEvents={periodEvents.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8">
          <PeriodCalendar
            visibleMonth={visibleMonth}
            onMoveMonth={(amount) =>
              setVisibleMonth(
                (curr) => new Date(curr.getFullYear(), curr.getMonth() + amount, 1)
              )
            }
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            events={periodEvents}
            eventTypes={EVENT_TYPES}
          />
        </div>

        <div className="lg:col-span-4">
          <PeriodEventList
            events={periodEvents}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      <ModalEventoFeriado
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
      />
    </div>
  );
};

export default AcademicPeriod;
