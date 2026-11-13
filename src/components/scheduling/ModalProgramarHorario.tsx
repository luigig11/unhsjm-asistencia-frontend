import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../common/Icons';
import { Button, Select } from '../common';
import type { Schedule } from './ScheduleWeeklyGrid';
import type { MateriaPorGrupoDto } from '../../api/calendario';
import type { AulaDto } from '../../api/catalogos';

export interface ScheduleSaveData {
  idMateriaPorGrupo: string;
  idAula: string;
  idDia: number;
  dia: string;
  horaInicio: string;
  horaFin: string;
  grupo: string;
  materia: string;
  docente: string;
  aula: string;
}

export const DIAS_SEMANA = [
  { idDia: 1, nombre: 'Lunes' },
  { idDia: 2, nombre: 'Martes' },
  { idDia: 3, nombre: 'Miércoles' },
  { idDia: 4, nombre: 'Jueves' },
  { idDia: 5, nombre: 'Viernes' },
  { idDia: 6, nombre: 'Sábado' },
  { idDia: 7, nombre: 'Domingo' },
];

export const HORAS_CATALOGO = [
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

interface ModalProgramarHorarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ScheduleSaveData) => Promise<void> | void;
  scheduleToEdit?: Schedule | null;
  materiasPorGrupo: MateriaPorGrupoDto[];
  aulas: AulaDto[];
  isSaving?: boolean;
  error?: string;
}

export const ModalProgramarHorario: React.FC<ModalProgramarHorarioProps> = ({
  isOpen,
  onClose,
  onSave,
  scheduleToEdit,
  materiasPorGrupo,
  aulas,
  isSaving = false,
  error: externalError,
}) => {
  const [selectedMpgId, setSelectedMpgId] = useState<string>('');
  const [selectedAulaId, setSelectedAulaId] = useState<string>('');
  const [selectedDiaId, setSelectedDiaId] = useState<number>(1);
  const [horaInicio, setHoraInicio] = useState<string>('07:00');
  const [horaFin, setHoraFin] = useState<string>('09:00');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLocalError(null);

    if (scheduleToEdit) {
      if (scheduleToEdit.idMateriaPorGrupo) {
        setSelectedMpgId(scheduleToEdit.idMateriaPorGrupo);
      } else {
        const foundMpg = materiasPorGrupo.find(
          (m) => m.grupoCodigo === scheduleToEdit.grupo || m.materiaNombre === scheduleToEdit.materia
        );
        setSelectedMpgId(foundMpg?.id || '');
      }

      if (scheduleToEdit.idAula) {
        setSelectedAulaId(scheduleToEdit.idAula);
      } else {
        const foundAula = aulas.find((a) => a.codigo === scheduleToEdit.aula || a.nombre === scheduleToEdit.aula);
        setSelectedAulaId(foundAula?.id || '');
      }

      const diaObj = DIAS_SEMANA.find((d) => d.nombre.toLowerCase() === scheduleToEdit.dia.toLowerCase());
      setSelectedDiaId(diaObj?.idDia || scheduleToEdit.idDia || 1);
      setHoraInicio(scheduleToEdit.horaInicio.slice(0, 5));
      setHoraFin(scheduleToEdit.horaFin.slice(0, 5));
    } else {
      setSelectedMpgId(materiasPorGrupo[0]?.id || '');
      setSelectedAulaId(aulas[0]?.id || '');
      setSelectedDiaId(1);
      setHoraInicio('07:00');
      setHoraFin('09:00');
    }
  }, [isOpen, scheduleToEdit, materiasPorGrupo, aulas]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!selectedMpgId) {
      setLocalError('Por favor seleccione una materia ofertada con su grupo.');
      return;
    }
    if (!selectedAulaId) {
      setLocalError('Por favor seleccione un aula física.');
      return;
    }
    if (horaInicio >= horaFin) {
      setLocalError('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }

    const mpg = materiasPorGrupo.find((m) => m.id === selectedMpgId);
    const aulaObj = aulas.find((a) => a.id === selectedAulaId);
    const diaObj = DIAS_SEMANA.find((d) => d.idDia === selectedDiaId);

    const horaInicioFormatted = horaInicio.length === 5 ? `${horaInicio}:00` : horaInicio;
    const horaFinFormatted = horaFin.length === 5 ? `${horaFin}:00` : horaFin;

    try {
      await onSave({
        idMateriaPorGrupo: selectedMpgId,
        idAula: selectedAulaId,
        idDia: selectedDiaId,
        dia: diaObj?.nombre || 'Lunes',
        horaInicio: horaInicioFormatted,
        horaFin: horaFinFormatted,
        grupo: mpg?.grupoCodigo || '',
        materia: mpg?.materiaNombre || '',
        docente: mpg?.docenteNombreCompleto || '',
        aula: aulaObj?.codigo || aulaObj?.nombre || '',
      });
      onClose();
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Error al guardar el bloque horario.');
    }
  };

  const activeError = localError || externalError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-lg w-full text-left shadow-none overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              {scheduleToEdit ? 'Editar Bloque Horario' : 'Programar Nuevo Horario'}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Patrón recurrente semanal de clases y asignación física de espacio
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            icon={<CloseIcon className="w-4 h-4" />}
            onClick={onClose}
            disabled={isSaving}
            className="text-[#94A3B8] hover:text-[#0F172A]"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {activeError && (
            <div className="p-2.5 rounded-md bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]">
              {activeError}
            </div>
          )}

          <Select
            label="Grupo y Asignatura Ofertada"
            required
            value={selectedMpgId}
            onChange={(e) => setSelectedMpgId(e.target.value)}
          >
            {materiasPorGrupo.length === 0 ? (
              <option value="">Sin asignaturas ofertadas en los grupos</option>
            ) : (
              materiasPorGrupo.map((mpg) => (
                <option key={mpg.id} value={mpg.id}>
                  [{mpg.grupoCodigo}] {mpg.materiaCodigo} — {mpg.materiaNombre} ({mpg.docenteNombreCompleto})
                </option>
              ))
            )}
          </Select>

          <Select
            label="Aula Física Asignada"
            required
            value={selectedAulaId}
            onChange={(e) => setSelectedAulaId(e.target.value)}
          >
            {aulas.length === 0 ? (
              <option value="">Sin aulas registradas</option>
            ) : (
              aulas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.codigo} — {a.nombre} (Cap: {a.capacidad} estudiantes)
                </option>
              ))
            )}
          </Select>

          <div className="grid grid-cols-3 gap-3">
            <Select
              label="Día de la Semana"
              required
              value={selectedDiaId}
              onChange={(e) => setSelectedDiaId(Number(e.target.value))}
            >
              {DIAS_SEMANA.map((d) => (
                <option key={d.idDia} value={d.idDia}>
                  {d.nombre}
                </option>
              ))}
            </Select>

            <Select
              label="Hora Inicio"
              required
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
            >
              {HORAS_CATALOGO.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </Select>

            <Select
              label="Hora Fin"
              required
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
            >
              {HORAS_CATALOGO.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </Select>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
            >
              {scheduleToEdit ? 'Actualizar Horario' : 'Guardar Horario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
