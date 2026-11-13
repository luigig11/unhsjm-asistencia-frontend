import React, { useState } from 'react';
import { CloseIcon } from '../common/Icons';
import { Button } from '../common/Button';

export interface SubjectOption {
  idMallaCurricular: string;
  codigo: string;
  nombre: string;
}

export interface TeacherOption {
  id: string;
  nombre: string;
  codigo: string;
}

interface ModalAsignarMateriaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    idMallaCurricular: string;
    idDocente: string;
    cupo_limite: number;
    materiaNombre?: string;
    materiaCodigo?: string;
    docenteNombre?: string;
  }) => Promise<void> | void;
  defaultCapacity?: number;
  availableSubjects?: SubjectOption[];
  availableTeachers?: TeacherOption[];
  isSaving?: boolean;
}

export const ModalAsignarMateria: React.FC<ModalAsignarMateriaProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultCapacity = 35,
  availableSubjects = [],
  availableTeachers = [],
  isSaving = false,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [manualCodigo, setManualCodigo] = useState<string>('');
  const [manualMateria, setManualMateria] = useState<string>('');
  const [manualDocente, setManualDocente] = useState<string>('');
  const [cupo, setCupo] = useState<string>(String(defaultCapacity));
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cupoNum = Number(cupo) || defaultCapacity;

    if (availableSubjects.length > 0) {
      if (!selectedSubjectId) {
        setError('Por favor seleccione una asignatura.');
        return;
      }
      if (!selectedTeacherId) {
        setError('Por favor seleccione un docente titular.');
        return;
      }

      const foundSubject = availableSubjects.find((s) => s.idMallaCurricular === selectedSubjectId);
      const foundTeacher = availableTeachers.find((t) => t.id === selectedTeacherId);

      try {
        await onSave({
          idMallaCurricular: selectedSubjectId,
          idDocente: selectedTeacherId,
          cupo_limite: cupoNum,
          materiaNombre: foundSubject?.nombre,
          materiaCodigo: foundSubject?.codigo,
          docenteNombre: foundTeacher?.nombre,
        });
        setSelectedSubjectId('');
        setSelectedTeacherId('');
        onClose();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al asignar la materia');
      }
    } else {
      if (!manualCodigo.trim() || !manualMateria.trim()) {
        setError('Por favor complete los datos de la asignatura.');
        return;
      }

      try {
        await onSave({
          idMallaCurricular: selectedSubjectId || '00000000-0000-0000-0000-000000000000',
          idDocente: selectedTeacherId || '00000000-0000-0000-0000-000000000000',
          cupo_limite: cupoNum,
          materiaNombre: manualMateria.trim(),
          materiaCodigo: manualCodigo.trim(),
          docenteNombre: manualDocente.trim() || undefined,
        });
        setManualCodigo('');
        setManualMateria('');
        setManualDocente('');
        onClose();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al asignar la materia');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-md w-full text-left shadow-none overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A]">Asignar Asignatura y Docente</h3>
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

        {error && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {availableSubjects.length > 0 ? (
            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Asignatura de la Malla <span className="text-[#C81E2B]">*</span>
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                required
              >
                <option value="">-- Seleccionar asignatura --</option>
                {availableSubjects.map((sub) => (
                  <option key={sub.idMallaCurricular} value={sub.idMallaCurricular}>
                    {sub.codigo} — {sub.nombre}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <label className="font-semibold text-[#475569] block">
                  Código de la Asignatura <span className="text-[#C81E2B]">*</span>
                </label>
                <input
                  type="text"
                  value={manualCodigo}
                  onChange={(e) => setManualCodigo(e.target.value)}
                  placeholder="Ej. PROG-101"
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#475569] block">
                  Nombre de la Asignatura <span className="text-[#C81E2B]">*</span>
                </label>
                <input
                  type="text"
                  value={manualMateria}
                  onChange={(e) => setManualMateria(e.target.value)}
                  placeholder="Ej. Fundamentos de Programación"
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                  required
                />
              </div>
            </>
          )}

          {availableTeachers.length > 0 ? (
            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Docente Titular Asignado <span className="text-[#C81E2B]">*</span>
              </label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                required
              >
                <option value="">-- Seleccionar docente --</option>
                {availableTeachers.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.nombre} ({doc.codigo})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Docente Titular Asignado
              </label>
              <input
                type="text"
                value={manualDocente}
                onChange={(e) => setManualDocente(e.target.value)}
                placeholder="Nombre del docente (opcional)"
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">
              Cupo de la Asignatura
            </label>
            <input
              type="number"
              min={1}
              max={150}
              value={cupo}
              onChange={(e) => setCupo(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
            />
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
              Asignar Materia
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
