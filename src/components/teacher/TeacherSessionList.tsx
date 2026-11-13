import React from 'react';
import { SearchIcon, ClockIcon, CheckCircleIcon, DownloadIcon } from '../common/Icons';
import { Button } from '../common/Button';

export type SessionStatus = 'Pendiente' | 'Registrada';

export interface TeacherSession {
  id: string;
  materia: string;
  codigo: string;
  grupo: string;
  aula: string;
  horaInicio: string;
  horaFin: string;
  estado: SessionStatus;
  idMateriaPorGrupo?: string;
  fecha?: string;
  fechaRaw?: string;
}

interface TeacherSessionListProps {
  sessions: TeacherSession[];
  loading?: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onPassAttendance: (session: TeacherSession) => void;
  onExportPdf?: (session: TeacherSession) => void;
}

export const TeacherSessionList: React.FC<TeacherSessionListProps> = ({
  sessions,
  loading = false,
  searchTerm,
  onSearchChange,
  onPassAttendance,
  onExportPdf,
}) => {
  return (
    <section className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden text-left shadow-sm">
      <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#0F172A]">
            Mis Sesiones de Clase (Turno Dominical)
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Agenda académica y pase de lista de tus sesiones programadas para el ciclo.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#94A3B8]">
            <SearchIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar materia, grupo o aula..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1D63B8]"
          />
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {loading ? (
          <div className="p-10 text-center text-xs text-[#475569]">
            <div className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#1D63B8] border-t-transparent rounded-full animate-spin" />
              <span>Cargando sesiones programadas...</span>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-10 text-center text-[#94A3B8]">
            <ClockIcon className="w-8 h-8 mx-auto mb-2 text-[#CBD5E1]" />
            <p className="font-semibold text-xs text-[#475569]">
              No tienes sesiones programadas para hoy
            </p>
            <p className="text-[11px] mt-0.5">
              Las clases aparecerán automáticamente según el calendario escolar y el horario asignado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {sessions.map((session) => {
              const isPending = session.estado === 'Pendiente';

              return (
                <div
                  key={session.id}
                  className="p-4 rounded-lg border border-[#E2E8F0] hover:border-[#1D63B8] transition-colors bg-white flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="font-mono text-[11px] font-bold text-[#0F3C6E] bg-[#EBF3FC] px-1.5 py-0.5 rounded border border-[#1D63B8]/20">
                          {session.codigo}
                        </span>
                        <span className="text-[11px] font-semibold text-[#475569] bg-[#F8FAFC] px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                          Grupo {session.grupo}
                        </span>
                        {session.fecha && (
                          <span className="text-[11px] font-medium text-[#1D63B8] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE]">
                            {session.fecha}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#0F172A] leading-snug">
                        {session.materia}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                        isPending
                          ? 'bg-[#FFF4E5] text-[#D97706] border-[#F5D6A8]'
                          : 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                      }`}
                    >
                      {isPending ? (
                        <>
                          <ClockIcon className="w-3 h-3" />
                          <span>Pendiente</span>
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-3 h-3" />
                          <span>Registrada</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span className="font-mono font-medium text-[#0F172A]">
                        {session.horaInicio} - {session.horaFin}
                      </span>
                    </div>

                    <span className="font-semibold text-[#0F3C6E] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {session.aula}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant={isPending ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => onPassAttendance(session)}
                      className="flex-1"
                    >
                      {isPending ? 'Pasar Asistencia' : 'Ver Acta'}
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      icon={<DownloadIcon className="w-3.5 h-3.5" />}
                      onClick={() => onExportPdf?.(session)}
                      title="Exportar Acta Oficial a PDF"
                      className="border-[#CBD5E1] text-[#0F3C6E] hover:bg-[#EBF3FC] px-2.5"
                    >
                      Exportar PDF
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
