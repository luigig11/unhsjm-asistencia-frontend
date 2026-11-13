import React from 'react';

export type AttendanceStatus = 'P' | 'A' | 'J' | '-';

export interface Session {
  id: number;
  number: number;
  date: string;
  label: string;
}

export interface SheetStudent {
  id: number;
  codigo_unico: string;
  nombre: string;
  attendance: AttendanceStatus[];
  reasons: string[];
}

export const getPercentage = (attendance: AttendanceStatus[]): number => {
  const evaluated = attendance.filter((s) => s === 'P' || s === 'A' || s === 'J');
  if (evaluated.length === 0) return 100;
  const present = evaluated.filter((s) => s === 'P').length;
  return Math.round((present / evaluated.length) * 100);
};

export const getStatusColor = (status: AttendanceStatus): string => {
  switch (status) {
    case 'P':
      return 'bg-[#15803D] text-white border-[#15803D]';
    case 'A':
      return 'bg-[#C81E2B] text-white border-[#C81E2B]';
    case 'J':
      return 'bg-[#D97706] text-white border-[#D97706]';
    case '-':
    default:
      return 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]';
  }
};

export const getPercentageBadge = (percentage: number) => {
  if (percentage >= 90) {
    return {
      textColor: 'text-[#15803D]',
      bgColor: 'bg-[#DCFCE7]',
      label: 'Excelente',
    };
  }
  if (percentage >= 75) {
    return {
      textColor: 'text-[#D97706]',
      bgColor: 'bg-[#FEF3C7]',
      label: 'Advertencia',
    };
  }
  return {
    textColor: 'text-[#C81E2B]',
    bgColor: 'bg-[#FEE2E2]',
    label: 'Riesgo',
  };
};

interface AttendanceMatrixTableProps {
  students: SheetStudent[];
  sessions: Session[];
  group: string;
  period: string;
}

export const AttendanceMatrixTable: React.FC<AttendanceMatrixTableProps> = ({
  students,
  sessions,
  group,
  period,
}) => {
  return (
    <div className="space-y-3 text-left">
      {/* Barra de Leyenda de Estados */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-[#0F172A]">
            Matriz Consolidada de Asistencia
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Grupo {group} · Período {period} · {students.length} estudiantes listados
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-[#0F172A]">
            <span className="w-5 h-5 rounded bg-[#15803D] text-white flex items-center justify-center font-bold text-[10px]">P</span>
            Presente
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[#0F172A]">
            <span className="w-5 h-5 rounded bg-[#C81E2B] text-white flex items-center justify-center font-bold text-[10px]">A</span>
            Ausente
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[#0F172A]">
            <span className="w-5 h-5 rounded bg-[#D97706] text-white flex items-center justify-center font-bold text-[10px]">J</span>
            Justificada
          </span>
        </div>
      </div>

      {/* Tabla Matriz con Encabezados Fijos */}
      <section className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="bg-[#0F3C6E] text-white">
                <th className="sticky left-0 z-20 bg-[#0F3C6E] px-3 py-3 text-xs font-bold w-12 text-center">
                  #
                </th>
                <th className="sticky left-12 z-20 bg-[#0F3C6E] px-3 py-3 text-xs font-bold min-w-[220px]">
                  Estudiante
                </th>

                {sessions.map((session) => (
                  <th
                    key={session.id}
                    className="px-2 py-2.5 text-center min-w-[70px] border-l border-white/10"
                  >
                    <div className="text-[10px] text-[#DCEBFA] font-medium">
                      Sesión {session.number}
                    </div>
                    <div className="text-[11px] font-bold mt-0.5">
                      {session.label}
                    </div>
                  </th>
                ))}

                <th className="sticky right-0 z-20 bg-[#0F3C6E] px-3 py-3 text-center min-w-[110px] border-l border-white/15">
                  Asistencia %
                </th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={sessions.length + 3}
                    className="py-12 text-center text-xs text-[#64748B]"
                  >
                    No se encontraron registros de estudiantes para los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                students.map((student, index) => {
                  const percentage = getPercentage(student.attendance);
                  const badge = getPercentageBadge(percentage);

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="sticky left-0 z-10 bg-white px-3 py-2.5 text-xs text-[#64748B] font-medium text-center">
                        {index + 1}
                      </td>

                      <td className="sticky left-12 z-10 bg-white px-3 py-2.5">
                        <p className="text-xs font-bold text-[#0F172A]">
                          {student.nombre}
                        </p>
                        <p className="font-mono text-[11px] text-[#64748B] mt-0.5">
                          {student.codigo_unico}
                        </p>
                      </td>

                      {student.attendance.map((status, sessionIndex) => {
                        const reason = student.reasons[sessionIndex];
                        const sessionInfo = sessions[sessionIndex];

                        const tooltip = status === '-'
                          ? `${sessionInfo ? `Sesión ${sessionInfo.number} (${sessionInfo.date})` : ''} | Estado: Pendiente (No impartida aún)`
                          : [
                              sessionInfo ? `Sesión ${sessionInfo.number} (${sessionInfo.date})` : '',
                              `Estado: ${
                                status === 'P'
                                  ? 'Presente'
                                  : status === 'A'
                                    ? 'Ausente'
                                    : 'Justificada'
                              }`,
                              reason ? `Motivo: ${reason}` : '',
                            ]
                              .filter(Boolean)
                              .join(' | ');

                        return (
                          <td
                            key={`${student.id}-${sessionIndex}`}
                            className="px-2 py-2.5 text-center border-l border-[#F1F5F9]"
                            title={tooltip}
                          >
                            <span
                              className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold border ${getStatusColor(status)}`}
                            >
                              {status === '-' ? '—' : status}
                            </span>
                          </td>
                        );
                      })}

                      <td className="sticky right-0 z-10 bg-white px-3 py-2.5 text-center border-l border-[#E2E8F0]">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={`text-xs font-bold ${badge.textColor}`}>
                            {percentage}%
                          </span>
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${badge.bgColor} ${badge.textColor}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0]">
          <p className="text-[11px] text-[#64748B]">
            Los porcentajes se calculan con base en las sesiones impartidas. Las inasistencias justificadas se señalan de manera explícita para fines de evaluación.
          </p>
        </div>
      </section>

      {/* Reglas de impresión landscape para PDF */}
      <style>
        {`
          @media print {
            @page {
              size: landscape;
              margin: 10mm;
            }
            body {
              background: white !important;
            }
            body * {
              visibility: hidden;
            }
            main, main * {
              visibility: visible;
            }
            main {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-width: none !important;
              padding: 0 !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            table {
              font-size: 9px !important;
            }
            tr {
              break-inside: avoid;
            }
            .overflow-x-auto {
              overflow: visible !important;
            }
            th, td {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `}
      </style>
    </div>
  );
};
