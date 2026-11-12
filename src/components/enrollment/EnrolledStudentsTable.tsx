import React from 'react';
import type { Student } from './StudentSearchSection';
import { UsersIcon } from '../common/Icons';

export interface Enrollment {
  id: number;
  estudianteId: number;
  grupoId: number;
  fechaInscripcion: string;
  activo: boolean;
}

interface EnrolledStudentsTableProps {
  enrollments: Enrollment[];
  students: Student[];
  onRemoveEnrollment: (enrollmentId: number) => void;
}

const formatDate = (value: string) => {
  if (!value) return '—';
  return new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString('es-NI', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const EnrolledStudentsTable: React.FC<EnrolledStudentsTableProps> = ({
  enrollments,
  students,
  onRemoveEnrollment,
}) => {
  return (
    <section className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden text-left">
      <div className="p-4 border-b border-[#E2E8F0]">
        <h3 className="text-sm font-bold text-[#0F172A]">
          Nómina Oficial de Estudiantes Inscritos
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          Listado de estudiantes con matrícula confirmada en esta asignatura
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] text-[#475569] border-b border-[#E2E8F0] uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-3">Código Único</th>
              <th className="px-4 py-3">Nombre Completo</th>
              <th className="px-4 py-3">Carrera</th>
              <th className="px-4 py-3">Fecha Inscripción</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[#94A3B8]">
                  <UsersIcon className="w-8 h-8 mx-auto mb-2 text-[#CBD5E1]" />
                  <p className="font-semibold text-xs text-[#475569]">No hay estudiantes inscritos en este grupo</p>
                  <p className="text-[11px] mt-0.5">Utiliza el buscador superior para inscribir estudiantes.</p>
                </td>
              </tr>
            ) : (
              enrollments.map((enr) => {
                const student = students.find((s) => s.id === enr.estudianteId);

                return (
                  <tr key={enr.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#0F3C6E]">
                      {student?.codigo_unico || '—'}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#0F172A]">
                      {student?.nombre || 'Estudiante no encontrado'}
                    </td>
                    <td className="px-4 py-3 text-[#475569]">
                      {student?.carrera || '—'}
                    </td>
                    <td className="px-4 py-3 text-[#64748B] font-mono text-[11px]">
                      {formatDate(enr.fechaInscripcion)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onRemoveEnrollment(enr.id)}
                        className="text-[11px] font-semibold text-[#C81E2B] hover:underline cursor-pointer"
                      >
                        Desinscribir
                      </button>
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
