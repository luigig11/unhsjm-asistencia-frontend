import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PeriodHeader } from '../components/period/PeriodHeader';
import type { SchoolPeriod } from '../components/period/PeriodHeader';
import { PeriodCalendar } from '../components/period/PeriodCalendar';
import type { SchoolEvent } from '../components/period/PeriodCalendar';
import { PeriodEventList } from '../components/period/PeriodEventList';
import { ModalEventoFeriado, type EventType } from '../components/period/ModalEventoFeriado';
import {
  listarPeriodosEscolares,
  listarFeriados,
  crearFeriado,
} from '../api/calendario';
import { listarTiposEvento } from '../api/catalogos';
import { AlertCircleIcon } from '../components/common/Icons';
import { Button } from '../components/common/Button';

export const AcademicPeriod: React.FC = () => {
  const [periods, setPeriods] = useState<SchoolPeriod[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);

  const [visibleMonth, setVisibleMonth] = useState<Date>(() => new Date(2026, 8, 1));
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-13');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarPeriodosYTipos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [periodosRes, tiposRes] = await Promise.allSettled([
        listarPeriodosEscolares({ activo: true }),
        listarTiposEvento({ activo: true }),
      ]);

      if (periodosRes.status === 'fulfilled' && Array.isArray(periodosRes.value)) {
        const mappedPeriods: SchoolPeriod[] = periodosRes.value.map((p) => ({
          id: p.id,
          nombre_periodo_escolar: p.nombrePeriodoEscolar,
          fecha_inicio: p.fechaInicio,
          fecha_fin: p.fechaFin,
          activo: p.activo,
        }));
        setPeriods(mappedPeriods);
        if (!selectedPeriodId && mappedPeriods.length > 0) {
          setSelectedPeriodId(mappedPeriods[0].id);
        }
      }

      if (tiposRes.status === 'fulfilled' && Array.isArray(tiposRes.value)) {
        setEventTypes(
          tiposRes.value.map((t) => ({
            id: t.id,
            codigo: t.codigo,
            nombre: t.nombre,
            activo: t.activo,
          }))
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar períodos escolares.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriodId]);

  useEffect(() => {
    cargarPeriodosYTipos();
  }, [cargarPeriodosYTipos]);

  const cargarFeriados = useCallback(async () => {
    if (!selectedPeriodId) return;
    try {
      const res = await listarFeriados({ idPeriodoEscolar: selectedPeriodId, activo: true });
      if (Array.isArray(res)) {
        const mappedEvents: SchoolEvent[] = res.map((f) => ({
          id: f.id,
          id_periodo_escolar: f.idPeriodoEscolar,
          id_tipo_evento: f.idTipoEvento,
          nombre: f.nombre,
          fecha_inicio: f.fechaInicio,
          fecha_fin: f.fechaFin,
          activo: f.activo,
        }));
        setEvents(mappedEvents);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar feriados y eventos.';
      setError(msg);
    }
  }, [selectedPeriodId]);

  useEffect(() => {
    cargarFeriados();
  }, [cargarFeriados]);

  const defaultPeriod: SchoolPeriod = {
    id: 'sin-periodo',
    nombre_periodo_escolar: 'Año Lectivo 2026',
    fecha_inicio: '2026-01-01',
    fecha_fin: '2026-12-31',
    activo: true,
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

  const handleSaveEvent = async (data: {
    nombre: string;
    id_tipo_evento: string;
    fecha_inicio: string;
    fecha_fin: string;
  }) => {
    if (!selectedPeriodId) return;
    setSaving(true);
    setError(null);
    try {
      await crearFeriado({
        idPeriodoEscolar: selectedPeriodId,
        idTipoEvento: data.id_tipo_evento,
        nombre: data.nombre,
        fechaInicio: data.fecha_inicio,
        fechaFin: data.fecha_fin,
        activo: true,
      });

      setSelectedDate(data.fecha_inicio.slice(0, 10));
      await cargarFeriados();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar el feriado.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto flex-1 p-4 sm:p-6 space-y-5 text-left">
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5 text-rose-800 text-xs font-medium">
            <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="secondary"
            size="xs"
            onClick={cargarPeriodosYTipos}
            className="text-rose-700 border-rose-300 hover:bg-rose-100"
          >
            Reintentar
          </Button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-[#64748B]">
          Cargando períodos y calendario de feriados...
        </div>
      ) : (
        <>
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
                eventTypes={eventTypes}
              />
            </div>

            <div className="lg:col-span-4">
              <PeriodEventList
                events={periodEvents}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        </>
      )}

      <ModalEventoFeriado
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        eventTypes={eventTypes}
        onSave={handleSaveEvent}
        loading={saving}
      />
    </div>
  );
};

export default AcademicPeriod;
