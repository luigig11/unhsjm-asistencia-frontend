import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ScheduleHeader } from '../components/scheduling/ScheduleHeader';
import { ScheduleFilters } from '../components/scheduling/ScheduleFilters';
import { ScheduleWeeklyGrid } from '../components/scheduling/ScheduleWeeklyGrid';
import type { Schedule } from '../components/scheduling/ScheduleWeeklyGrid';
import { ModalProgramarHorario } from '../components/scheduling/ModalProgramarHorario';
import type { ScheduleSaveData } from '../components/scheduling/ModalProgramarHorario';
import {
  listarCalendarioSemanal,
  crearCalendarioSemanal,
  actualizarCalendarioSemanal,
  eliminarCalendarioSemanal,
  listarMateriasPorGrupo,
  type CalendarioSemanalDto,
  type MateriaPorGrupoDto,
} from '../api/calendario';
import { listarAulas, type AulaDto } from '../api/catalogos';
import { AlertCircleIcon, CheckCircleIcon } from '../components/common/Icons';
import { Button } from '../components/common/Button';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const DIAS_MAP: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
};

const HORAS = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];

export const SchedulePlanner: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [materiasPorGrupo, setMateriasPorGrupo] = useState<MateriaPorGrupoDto[]>([]);
  const [aulas, setAulas] = useState<AulaDto[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<string>('Todos');
  const [selectedDay, setSelectedDay] = useState<string>('Todos');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [semanalesData, mpgData, aulasData] = await Promise.all([
        listarCalendarioSemanal().catch(() => [] as CalendarioSemanalDto[]),
        listarMateriasPorGrupo({ activo: true }).catch(() => [] as MateriaPorGrupoDto[]),
        listarAulas({ activo: true }).catch(() => [] as AulaDto[]),
      ]);

      setMateriasPorGrupo(mpgData);
      setAulas(aulasData);

      const mpgMap = new Map<string, MateriaPorGrupoDto>();
      for (const item of mpgData) {
        mpgMap.set(item.id, item);
      }

      const mappedSchedules: Schedule[] = semanalesData.map((item) => {
        const mpg = mpgMap.get(item.idMateriaPorGrupo);
        const diaNombre = item.diaNombre || DIAS_MAP[item.idDia] || 'Lunes';

        return {
          id: item.id,
          idMateriaPorGrupo: item.idMateriaPorGrupo,
          idAula: item.idAula,
          grupo: mpg?.grupoCodigo || 'General',
          materia: mpg ? `${mpg.materiaCodigo} — ${mpg.materiaNombre}` : 'Materia',
          docente: mpg?.docenteNombreCompleto || 'Sin docente asignado',
          aula: item.aulaCodigo || item.aulaNombre || 'Aula',
          dia: diaNombre,
          idDia: item.idDia,
          horaInicio: item.horaInicio ? item.horaInicio.slice(0, 5) : '07:00',
          horaFin: item.horaFin ? item.horaFin.slice(0, 5) : '09:00',
        };
      });

      setSchedules(mappedSchedules);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los horarios semanales.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const uniqueGroups = useMemo(() => {
    const set = new Set<string>();
    for (const item of materiasPorGrupo) {
      if (item.grupoCodigo) set.add(item.grupoCodigo);
    }
    for (const s of schedules) {
      if (s.grupo) set.add(s.grupo);
    }
    return Array.from(set).sort();
  }, [materiasPorGrupo, schedules]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const matchesGroup = selectedGroup === 'Todos' || schedule.grupo === selectedGroup;
      const matchesDay = selectedDay === 'Todos' || schedule.dia.toLowerCase() === selectedDay.toLowerCase();
      return matchesGroup && matchesDay;
    });
  }, [schedules, selectedGroup, selectedDay]);

  const handleOpenNew = () => {
    setEditingSchedule(null);
    setShowModal(true);
  };

  const handleOpenEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarCalendarioSemanal(id);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      setSuccessMessage('Bloque horario eliminado exitosamente.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el bloque horario.');
    }
  };

  const handleSave = async (data: ScheduleSaveData) => {
    setIsSaving(true);
    try {
      if (editingSchedule) {
        await actualizarCalendarioSemanal(editingSchedule.id, {
          idMateriaPorGrupo: data.idMateriaPorGrupo,
          idAula: data.idAula,
          idDia: data.idDia,
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
          activo: true,
        });
        setSuccessMessage('Bloque horario actualizado exitosamente.');
      } else {
        await crearCalendarioSemanal({
          idMateriaPorGrupo: data.idMateriaPorGrupo,
          idAula: data.idAula,
          idDia: data.idDia,
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
          activo: true,
        });
        setSuccessMessage('Bloque horario registrado exitosamente.');
      }

      await cargarDatos();
      setShowModal(false);
      setEditingSchedule(null);
      setTimeout(() => setSuccessMessage(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const totalGroups = useMemo(() => new Set(schedules.map((s) => s.grupo)).size, [schedules]);
  const totalSubjects = useMemo(() => new Set(schedules.map((s) => s.materia)).size, [schedules]);
  const totalDays = useMemo(() => new Set(schedules.map((s) => s.dia)).size, [schedules]);

  return (
    <div className="w-full max-w-[1600px] mx-auto flex-1 p-4 sm:p-6 space-y-5">
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5 text-rose-800 text-xs font-medium">
            <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="secondary"
            size="xs"
            onClick={cargarDatos}
            className="text-rose-700 border-rose-300 hover:bg-rose-100"
          >
            Reintentar
          </Button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-emerald-800 text-xs font-medium text-left">
          <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-[#64748B]">
          Cargando matriz semanal de horarios y asignaciones...
        </div>
      ) : (
        <>
          <ScheduleHeader
            onOpenNewSchedule={handleOpenNew}
            totalSchedules={schedules.length}
            totalGroups={totalGroups}
            totalSubjects={totalSubjects}
            totalDays={totalDays}
          />

          <ScheduleFilters
            groups={uniqueGroups}
            selectedGroup={selectedGroup}
            onSelectGroup={setSelectedGroup}
            days={DIAS}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />

          <ScheduleWeeklyGrid
            days={DIAS}
            hours={HORAS}
            selectedDay={selectedDay}
            getSchedules={(day, hour) =>
              filteredSchedules.filter((s) => s.dia.toLowerCase() === day.toLowerCase() && s.horaInicio === hour)
            }
            onEditSchedule={handleOpenEdit}
            onDeleteSchedule={handleDelete}
          />

          <ModalProgramarHorario
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            scheduleToEdit={editingSchedule}
            materiasPorGrupo={materiasPorGrupo}
            aulas={aulas}
            isSaving={isSaving}
          />
        </>
      )}
    </div>
  );
};

export default SchedulePlanner;
