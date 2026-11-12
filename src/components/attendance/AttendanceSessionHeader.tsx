import React from 'react';
import { AlertTriangleIcon } from '../common/Icons';

interface AttendanceSessionHeaderProps {
  sessionId?: string;
  subjectName: string;
  groupCode: string;
  roomName: string;
  dateStr: string;
  timeRange: string;
  teacherAttended: boolean;
  onSetTeacherAttended: (attended: boolean) => void;
  substituteTeacher?: string;
  substituteReason?: string;
  onOpenSubstituteModal: () => void;
}

export const AttendanceSessionHeader: React.FC<AttendanceSessionHeaderProps> = ({
  sessionId,
  subjectName,
  groupCode,
  roomName,
  dateStr,
  timeRange,
  teacherAttended,
  onSetTeacherAttended,
  substituteTeacher,
  substituteReason,
  onOpenSubstituteModal,
}) => {
  return (
    <div className="space-y-4 text-left">
      <section className="bg-white border border-[#E2E8F0] rounded-lg p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#0F3C6E] bg-[#EBF3FC] px-2 py-0.5 rounded border border-[#1D63B8]/20">
              {sessionId ? `Sesión: ${sessionId.substring(0, 8)}...` : 'Sesión —'}
            </span>
            <h1 className="text-xl font-bold text-[#0F172A] mt-1.5 leading-snug">
              {subjectName || '—'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#64748B]">
              <p>Grupo: <span className="font-bold text-[#0F172A]">{groupCode || '—'}</span></p>
              <p>Aula: <span className="font-bold text-[#0F172A]">{roomName || '—'}</span></p>
              <p>Fecha: <span className="font-bold text-[#0F172A]">{dateStr || '—'}</span></p>
            </div>
          </div>

          <span className="self-start font-mono text-xs font-semibold bg-[#F8FAFC] text-[#0F3C6E] px-3 py-1.5 rounded-md border border-[#E2E8F0]">
            {timeRange || '—'}
          </span>
        </div>
      </section>

      <section className="bg-white border border-[#E2E8F0] rounded-lg p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">
              Asistencia del Docente Titular
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Confirma si el profesor asignado impartió la clase o si fue cubierto por sustituto
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSetTeacherAttended(true)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
                teacherAttended
                  ? 'bg-[#15803D] text-white border-[#15803D]'
                  : 'bg-white text-[#64748B] border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              Docente Titular Asistió
            </button>

            <button
              type="button"
              onClick={onOpenSubstituteModal}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
                !teacherAttended
                  ? 'bg-[#D97706] text-white border-[#D97706]'
                  : 'bg-white text-[#64748B] border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              ¿Ausente / Sustituto?
            </button>
          </div>
        </div>

        {!teacherAttended && (
          <div className="mt-3 p-3 rounded-md bg-[#FFF4E5] border border-[#F5D6A8] text-xs text-[#9A5800] flex items-start gap-2">
            <AlertTriangleIcon className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Docente titular ausente justificado</p>
              <p className="text-[11px] mt-0.5">
                Motivo: <span className="font-semibold">{substituteReason || 'Reportado en acta'}</span>
                {substituteTeacher && (
                  <> · Cubierto por: <span className="font-semibold">{substituteTeacher}</span></>
                )}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
