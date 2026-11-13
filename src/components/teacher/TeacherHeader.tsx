import React from 'react';
import { CalendarIcon, ClockIcon, CheckCircleIcon } from '../common/Icons';

interface TeacherHeaderProps {
  teacherName?: string;
  formattedDate: string;
  totalSessions: number;
  pendingCount: number;
  registeredCount: number;
}

export const TeacherHeader: React.FC<TeacherHeaderProps> = ({
  teacherName = 'Docente Titular',
  formattedDate,
  totalSessions,
  pendingCount,
  registeredCount,
}) => {
  return (
    <div className="space-y-4 text-left">
      {/* Saludo Institucional con Fecha */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center gap-1.5 text-xs text-[#1D63B8] font-semibold mb-1">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span className="capitalize">{formattedDate}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
          Portal del Docente
        </h1>
        <p className="text-xs text-[#475569] mt-0.5">
          Bienvenido(a), <span className="font-semibold text-[#0F3C6E]">{teacherName}</span>. Agenda académica y pase de lista de tus sesiones del cuatrimestre.
        </p>
      </div>

      {/* 3 Tarjetas KPI planas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64748B] font-medium">Sesiones Programadas</p>
            <p className="text-2xl font-bold text-[#0F172A] mt-1">{totalSessions}</p>
          </div>
          <div className="w-9 h-9 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F3C6E]">
            <CalendarIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64748B] font-medium">Asistencia Pendiente</p>
            <p className="text-2xl font-bold text-[#D97706] mt-1">{pendingCount}</p>
          </div>
          <div className="w-9 h-9 rounded-md bg-[#FFF4E5] border border-[#F5D6A8] flex items-center justify-center text-[#D97706]">
            <ClockIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64748B] font-medium">Actas Registradas</p>
            <p className="text-2xl font-bold text-[#15803D] mt-1">{registeredCount}</p>
          </div>
          <div className="w-9 h-9 rounded-md bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center text-[#15803D]">
            <CheckCircleIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
