import React, { useState, useEffect } from 'react';
import { CloseIcon, ChevronDownIcon } from '../common/Icons';
import type { Schedule } from './ScheduleWeeklyGrid';

interface ModalProgramarHorarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Schedule, 'id'>) => void;
  scheduleToEdit?: Schedule | null;
  dias: string[];
  horas: string[];
  grupos: string[];
  materias: string[];
  docentes: string[];
  aulas: string[];
  error?: string;
}

export const ModalProgramarHorario: React.FC<ModalProgramarHorarioProps> = ({
  isOpen,
  onClose,
  onSave,
  scheduleToEdit,
  dias,
  horas,
  grupos,
  materias,
  docentes,
  aulas,
  error,
}) => {
  const [grupo, setGrupo] = useState(grupos[0] || 'IS-01');
  const [materia, setMateria] = useState(materias[0] || '');
  const [docente, setDocente] = useState(docentes[0] || '');
  const [aula, setAula] = useState(aulas[0] || '');
  const [dia, setDia] = useState(dias[0] || 'Lunes');
  const [horaInicio, setHoraInicio] = useState(horas[0] || '07:00');
  const [horaFin, setHoraFin] = useState(horas[2] || '09:00');

  useEffect(() => {
    if (scheduleToEdit) {
      setGrupo(scheduleToEdit.grupo);
      setMateria(scheduleToEdit.materia);
      setDocente(scheduleToEdit.docente);
      setAula(scheduleToEdit.aula);
      setDia(scheduleToEdit.dia);
      setHoraInicio(scheduleToEdit.horaInicio);
      setHoraFin(scheduleToEdit.horaFin);
    } else {
      setGrupo(grupos[0] || 'ISI-IIIB');
      setMateria(materias[0] || '');
      setDocente(docentes[0] || '');
      setAula(aulas[0] || '');
      setDia(dias[0] || 'Lunes');
      setHoraInicio(horas[0] || '07:00');
      setHoraFin(horas[2] || '09:00');
    }
  }, [scheduleToEdit, isOpen, grupos, materias, docentes, aulas, dias, horas]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      grupo,
      materia,
      docente,
      aula,
      dia,
      horaInicio,
      horaFin,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-lg w-full text-left shadow-none overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A]">
            {scheduleToEdit ? 'Editar Bloque Horario' : 'Programar Nuevo Horario'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {error && (
            <div className="p-2.5 rounded-md bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">Grupo / Sección</label>
              <div className="relative">
                <select
                  value={grupo}
                  onChange={(e) => setGrupo(e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
                >
                  {grupos.length === 0 ? (
                    <option value="">Sin grupos registrados</option>
                  ) : (
                    grupos.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#475569]">
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">Aula Física</label>
              <div className="relative">
                <select
                  value={aula}
                  onChange={(e) => setAula(e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
                >
                  {aulas.length === 0 ? (
                    <option value="">Sin aulas registradas</option>
                  ) : (
                    aulas.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#475569]">
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">Asignatura</label>
            <div className="relative">
              <select
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
              >
                {materias.length === 0 ? (
                  <option value="">Sin asignaturas registradas</option>
                ) : (
                  materias.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#475569]">
                <ChevronDownIcon className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">Docente Asignado</label>
            <div className="relative">
              <select
                value={docente}
                onChange={(e) => setDocente(e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
              >
                {docentes.length === 0 ? (
                  <option value="">Sin docentes registrados</option>
                ) : (
                  docentes.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#475569]">
                <ChevronDownIcon className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">Día</label>
              <div className="relative">
                <select
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
                >
                  {dias.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#475569]">
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">Hora Inicio</label>
              <div className="relative">
                <select
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
                >
                  {horas.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#475569]">
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">Hora Fin</label>
              <div className="relative">
                <select
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
                >
                  {horas.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#475569]">
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-md text-[#475569] font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#0F3C6E] hover:bg-[#0A294D] text-white rounded-md font-semibold transition-colors cursor-pointer shadow-xs"
            >
              {scheduleToEdit ? 'Actualizar' : 'Guardar Horario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
