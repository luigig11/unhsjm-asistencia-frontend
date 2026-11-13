import React from 'react';
import { UsersIcon } from '../common/Icons';
import { Button } from '../common/Button';

export interface EnrolledStudentItem {
  id: string;
  estudianteId: string;
  codigo_unico: string;
  carnet?: string;
  nombre: string;
  carrera?: string;
  fechaInscripcion: string;
  activo: boolean;
}

interface EnrolledStudentsTableProps {
  enrollments: EnrolledStudentItem[];
  loading?: boolean;
  onRemoveEnrollment: (enrollmentId: string) => void;
}

const formatDate = (value: string) => {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    const parts = value.split('T');
    return parts[0] || value;
  }
  return d.toLocaleDateString('es-NI', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const EnrolledStudentsTable: React.FC<EnrolledStudentsTableProps> = ({
  enrollments,
  loading = false,
  onRemoveEnrollment,
}) => {
  return (
    <section className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden text-left shadow-sm">
      <div className="p-4 border-b border-[#E2E8F0]">
        <h3 className="text-sm font-bold text-[#0F172A]">
          Nómina Oficial de Estudiantes Inscritos
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          Listado de estudiantes con matrícula confirmada en esta asignatura ({enrollments.length} inscritos)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] text-[#475569] border-b border-[#E2E8F0] uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-3">Código Único</th>
              <th className="px-4 py-3">Carnet</th>
              <th className="px-4 py-3">Nombre Completo</th>
              <th className="px-4 py-3">Fecha Inscripción</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[#475569]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#1D63B8] border-t-transparent rounded-full animate-spin" />
                    <span>Cargando nómina de inscritos...</span>
                  </div>
                </td>
              </tr>
            ) : enrollments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[#94A3B8]">
                  <UsersIcon className="w-8 h-8 mx-auto mb-2 text-[#CBD5E1]" />
                  <p className="font-semibold text-xs text-[#475569]">No hay estudiantes inscritos en este grupo</p>
                  <p className="text-[11px] mt-0.5">Utiliza el buscador superior para inscribir estudiantes.</p>
                </td>
              </tr>
            ) : (
              enrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#0F3C6E]">
                    {enr.codigo_unico || '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#64748B]">
                    {enr.carnet || '—'}
                  </td>
                  <td className="px-4 py-3 font-bold text-[#0F172A]">
                    {enr.nombre}
                  </td>
                  <td className="px-4 py-3 text-[#64748B] font-mono text-[11px]">
                    {formatDate(enr.fechaInscripcion)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onRemoveEnrollment(enr.id)}
                      className="text-[#C81E2B] hover:text-[#991B1B] hover:bg-rose-50"
                    >
                      Desinscribir
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
