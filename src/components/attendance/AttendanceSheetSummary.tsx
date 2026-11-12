import React from 'react';

interface AttendanceSheetSummaryProps {
  totalPresent: number;
  totalAbsent: number;
  totalJustified: number;
  averageAttendance: number;
  excelenteCount: number;
  advertenciaCount: number;
  riesgoCount: number;
}

export const AttendanceSheetSummary: React.FC<AttendanceSheetSummaryProps> = ({
  totalPresent,
  totalAbsent,
  totalJustified,
  averageAttendance,
  excelenteCount,
  advertenciaCount,
  riesgoCount,
}) => {
  return (
    <div className="space-y-3 text-left">
      {/* 4 KPIs Clave */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
          <p className="text-xs font-semibold text-[#15803D]">
            Registros Presentes
          </p>
          <p className="text-2xl font-bold text-[#15803D] mt-1">
            {totalPresent}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
          <p className="text-xs font-semibold text-[#C81E2B]">
            Registros Ausentes
          </p>
          <p className="text-2xl font-bold text-[#C81E2B] mt-1">
            {totalAbsent}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
          <p className="text-xs font-semibold text-[#D97706]">
            Ausencias Justificadas
          </p>
          <p className="text-2xl font-bold text-[#D97706] mt-1">
            {totalJustified}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
          <p className="text-xs font-semibold text-[#0F3C6E]">
            Promedio de Asistencia
          </p>
          <p className="text-2xl font-bold text-[#0F3C6E] mt-1">
            {averageAttendance}%
          </p>
        </div>
      </section>

      {/* Alertas de Seguimiento */}
      <section className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <h3 className="text-xs font-bold text-[#0F172A]">
            Semáforo de Rendimiento y Riesgo Académico
          </h3>
          <span className="text-[11px] text-[#64748B]">
            Umbral mínimo de aprobación: 75% de asistencia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="flex items-center justify-between p-2.5 rounded border border-[#BBF7D0] bg-[#F0FDF4]">
            <span className="text-xs font-semibold text-[#166534]">
              Excelente (≥90%)
            </span>
            <span className="text-xs font-bold text-[#15803D]">
              {excelenteCount} alumnos
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded border border-[#FDE68A] bg-[#FFFBEB]">
            <span className="text-xs font-semibold text-[#92400E]">
              En Advertencia (75% - 89%)
            </span>
            <span className="text-xs font-bold text-[#D97706]">
              {advertenciaCount} alumnos
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded border border-[#FECACA] bg-[#FEF2F2]">
            <span className="text-xs font-semibold text-[#991B1B]">
              En Riesgo (&lt;75%)
            </span>
            <span className="text-xs font-bold text-[#C81E2B]">
              {riesgoCount} alumnos
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
