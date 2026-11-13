import React from 'react';
import { SearchIcon } from '../common/Icons';
import { Button } from '../common/Button';

export type AttendanceStatus = 'Presente' | 'Ausente';

export interface StudentAttendance {
  id: string;
  codigo_unico: string;
  carnet?: string;
  nombre: string;
  asistio: AttendanceStatus;
  motivoId?: string;
  motivo: string;
}

export interface MotivoOpcion {
  id: string;
  codigo: string;
  nombre: string;
}

interface StudentAttendanceListProps {
  students: StudentAttendance[];
  motivos?: MotivoOpcion[];
  loading?: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onUpdateStatus: (id: string, status: AttendanceStatus) => void;
  onUpdateMotivo: (id: string, motivoId: string, motivoNombre: string) => void;
  onMarkAllPresent: () => void;
  presentCount: number;
  absentCount: number;
}

export const StudentAttendanceList: React.FC<StudentAttendanceListProps> = ({
  students,
  motivos = [],
  loading = false,
  searchTerm,
  onSearchChange,
  onUpdateStatus,
  onUpdateMotivo,
  onMarkAllPresent,
  presentCount,
  absentCount,
}) => {
  return (
    <section className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden text-left shadow-sm">
      <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">
              Nómina de Estudiantes
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Marca la presencia y justifica las inasistencias de cada alumno
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#86EFAC]">
              {presentCount} Presentes
            </span>
            <span className="font-semibold text-[#C81E2B] bg-[#FEE2E2] px-2 py-0.5 rounded border border-[#FCA5A5]">
              {absentCount} Ausentes
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-60">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#94A3B8]">
              <SearchIcon className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre o carnet..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1D63B8]"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllPresent}
            className="shrink-0"
          >
            Marcar Todos Presentes
          </Button>
        </div>
      </div>

      <div className="divide-y divide-[#E2E8F0]">
        {loading ? (
          <div className="p-10 text-center text-[#475569] text-xs">
            <div className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#1D63B8] border-t-transparent rounded-full animate-spin" />
              <span>Cargando nómina oficial de alumnos...</span>
            </div>
          </div>
        ) : students.length === 0 ? (
          <div className="p-10 text-center text-[#94A3B8] text-xs">
            No se encontraron estudiantes registrados en este curso.
          </div>
        ) : (
          students.map((student, idx) => {
            const isPresent = student.asistio === 'Presente';

            return (
              <div
                key={student.id}
                className="p-3.5 hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[#94A3B8] w-5 text-right font-medium text-[11px]">
                    {idx + 1}.
                  </span>
                  <div>
                    <p className="font-bold text-[#0F172A]">{student.nombre}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[11px] text-[#0F3C6E] bg-[#EBF3FC] px-1.5 py-0.2 rounded border border-[#93C5FD]">
                        Código: {student.codigo_unico}
                      </span>
                      {student.carnet && (
                        <span className="font-mono text-[11px] text-[#64748B]">
                          Carnet: {student.carnet}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                  {!isPresent && (
                    <select
                      value={student.motivoId || ''}
                      onChange={(e) => {
                        const sel = motivos.find((m) => m.id === e.target.value);
                        onUpdateMotivo(
                          student.id,
                          e.target.value,
                          sel ? sel.nombre : e.target.value
                        );
                      }}
                      className="px-2.5 py-1 text-xs bg-[#FFF4E5] border border-[#F5D6A8] text-[#9A5800] rounded-md outline-none focus:border-[#D97706] cursor-pointer"
                    >
                      <option value="">Selecciona motivo de ausencia...</option>
                      {motivos.map((mot) => (
                        <option key={mot.id} value={mot.id}>
                          {mot.nombre}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="inline-flex rounded-md border border-[#CBD5E1] p-0.5 bg-[#F1F5F9] gap-0.5">
                    <Button
                      type="button"
                      variant={isPresent ? 'success' : 'ghost'}
                      size="xs"
                      onClick={() => onUpdateStatus(student.id, 'Presente')}
                    >
                      Presente
                    </Button>
                    <Button
                      type="button"
                      variant={!isPresent ? 'danger' : 'ghost'}
                      size="xs"
                      onClick={() => onUpdateStatus(student.id, 'Ausente')}
                    >
                      Ausente
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
