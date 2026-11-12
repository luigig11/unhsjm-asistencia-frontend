import React from 'react';
import { PlusIcon } from '../common/Icons';

export interface GroupSubject {
  id: string;
  grupoId: string;
  materia: string;
  codigoMateria: string;
  docente: string;
  inscritos: number;
  cupo_limite: number;
}

interface GroupSubjectTableProps {
  selectedGroupName?: string;
  selectedGroupCode?: string;
  subjects: GroupSubject[];
  onOpenAddSubject: () => void;
  onNavigateSchedule?: () => void;
  onNavigateEnrollment?: () => void;
}

export const GroupSubjectTable: React.FC<GroupSubjectTableProps> = ({
  selectedGroupName,
  selectedGroupCode,
  subjects,
  onOpenAddSubject,
  onNavigateSchedule,
  onNavigateEnrollment,
}) => {
  return (
    <section className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white text-left">
      {/* Cabecera de la tabla */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2E8F0] p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#0F3C6E] bg-[#EBF3FC] px-2 py-0.5 rounded border border-[#1D63B8]/30">
              {selectedGroupCode || 'Sin grupo'}
            </span>
            <h2 className="text-sm font-bold text-[#0F172A]">
              {selectedGroupName || 'Selecciona un grupo'}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-[#64748B]">
            Asignaturas de la malla ofertadas con sus docentes y estado de ocupación
          </p>
        </div>

        {selectedGroupCode && (
          <button
            type="button"
            onClick={onOpenAddSubject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F3C6E] bg-[#F8FAFC] hover:bg-[#0F3C6E] hover:text-white border border-[#CBD5E1] rounded-md transition-colors cursor-pointer shadow-none self-start sm:self-auto"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Asignar Materia</span>
          </button>
        )}
      </div>

      {/* Tabla de asignaturas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] text-[#475569] border-b border-[#E2E8F0] uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Asignatura</th>
              <th className="px-4 py-3">Docente Titular</th>
              <th className="px-4 py-3">Ocupación / Cupo</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {subjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#94A3B8]">
                  No hay materias asignadas a este grupo.
                </td>
              </tr>
            ) : (
              subjects.map((sub) => {
                const ratio = sub.cupo_limite > 0 ? (sub.inscritos / sub.cupo_limite) * 100 : 0;
                const isFull = ratio >= 100;

                return (
                  <tr key={sub.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#0F3C6E]">
                      {sub.codigoMateria}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#0F172A]">
                      {sub.materia}
                    </td>
                    <td className="px-4 py-3 text-[#475569]">
                      {sub.docente || <span className="text-[#94A3B8] italic">Sin asignar</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#0F172A]">
                          {sub.inscritos}/{sub.cupo_limite}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                            isFull
                              ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]'
                              : 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                          }`}
                        >
                          {ratio.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {onNavigateSchedule && (
                          <button
                            type="button"
                            onClick={onNavigateSchedule}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#1D63B8] hover:bg-[#EBF3FC] rounded border border-[#1D63B8]/30 transition-colors cursor-pointer"
                          >
                            Horario
                          </button>
                        )}
                        {onNavigateEnrollment && (
                          <button
                            type="button"
                            onClick={onNavigateEnrollment}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#0F3C6E] hover:bg-[#F1F5F9] rounded border border-[#CBD5E1] transition-colors cursor-pointer"
                          >
                            Inscribir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
