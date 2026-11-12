import React, { useState, useMemo } from 'react';
import { ScheduleHeader } from '../components/scheduling/ScheduleHeader';
import { ScheduleFilters } from '../components/scheduling/ScheduleFilters';
import { ScheduleWeeklyGrid } from '../components/scheduling/ScheduleWeeklyGrid';
import type { Schedule } from '../components/scheduling/ScheduleWeeklyGrid';
import { ModalProgramarHorario } from '../components/scheduling/ModalProgramarHorario';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const GRUPOS: string[] = [];
const MATERIAS: string[] = [];
const DOCENTES: string[] = [];
const AULAS: string[] = [];
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
];

export const SchedulePlanner: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('Todos');
  const [selectedDay, setSelectedDay] = useState<string>('Todos');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [error, setError] = useState<string>('');

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const matchesGroup = selectedGroup === 'Todos' || schedule.grupo === selectedGroup;
      const matchesDay = selectedDay === 'Todos' || schedule.dia === selectedDay;
      return matchesGroup && matchesDay;
    });
  }, [schedules, selectedGroup, selectedDay]);

  const handleOpenNew = () => {
    setEditingSchedule(null);
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setError('');
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = (data: Omit<Schedule, 'id'>) => {
    if (data.horaInicio >= data.horaFin) {
      setError('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }

    const overlaps = schedules.some((s) => {
      if (editingSchedule && s.id === editingSchedule.id) return false;
      if (s.dia !== data.dia) return false;

      const sameGroup = s.grupo === data.grupo;
      const sameTeacher = s.docente === data.docente;
      const sameRoom = s.aula === data.aula;
      const timeOverlap = data.horaInicio < s.horaFin && data.horaFin > s.horaInicio;

      return timeOverlap && (sameGroup || sameTeacher || sameRoom);
    });

    if (overlaps) {
      setError('Existe un traslape de horario con el grupo, docente o aula física.');
      return;
    }

    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === editingSchedule.id ? { ...data, id: s.id } : s))
      );
    } else {
      setSchedules((prev) => [...prev, { ...data, id: Date.now() }]);
    }

    setShowModal(false);
    setEditingSchedule(null);
  };

  const totalGroups = new Set(schedules.map((s) => s.grupo)).size;
  const totalSubjects = new Set(schedules.map((s) => s.materia)).size;
  const totalDays = new Set(schedules.map((s) => s.dia)).size;

  return (
    <div className="w-full max-w-[1600px] mx-auto flex-1 p-4 sm:p-6 space-y-5">
      <ScheduleHeader
        onOpenNewSchedule={handleOpenNew}
        totalSchedules={schedules.length}
        totalGroups={totalGroups}
        totalSubjects={totalSubjects}
        totalDays={totalDays}
      />

      <ScheduleFilters
        groups={GRUPOS}
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
          filteredSchedules.filter((s) => s.dia === day && s.horaInicio === hour)
        }
        onEditSchedule={handleOpenEdit}
        onDeleteSchedule={handleDelete}
      />

      <ModalProgramarHorario
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        scheduleToEdit={editingSchedule}
        dias={DIAS}
        horas={HORAS}
        grupos={GRUPOS}
        materias={MATERIAS}
        docentes={DOCENTES}
        aulas={AULAS}
        error={error}
      />
    </div>
  );
};

export default SchedulePlanner;
