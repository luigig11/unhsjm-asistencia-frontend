import React from 'react';
import { PlusIcon } from '../common/Icons';
import { Button } from '../common/Button';

interface ScheduleHeaderProps {
  onOpenNewSchedule: () => void;
  totalSchedules: number;
  totalGroups: number;
  totalSubjects: number;
  totalDays: number;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  onOpenNewSchedule,
  totalSchedules,
  totalGroups,
  totalSubjects,
  totalDays,
}) => {
  return (
    <div className="space-y-4">
      {/* Título y Botón */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Programador de Horarios
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Configuración del patrón semanal de clases, asignación de aulas físicas y control de traslapes
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<PlusIcon className="w-3.5 h-3.5" />}
          onClick={onOpenNewSchedule}
        >
          Programar Horario
        </Button>
      </div>

      {/* 4 Indicadores Planos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-left">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
          <p className="text-xs text-[#64748B] font-medium">Bloques programados</p>
          <p className="text-xl font-bold text-[#0F172A] mt-1">{totalSchedules}</p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
          <p className="text-xs text-[#64748B] font-medium">Grupos con horario</p>
          <p className="text-xl font-bold text-[#0F172A] mt-1">{totalGroups}</p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
          <p className="text-xs text-[#64748B] font-medium">Materias activas</p>
          <p className="text-xl font-bold text-[#0F3C6E] mt-1">{totalSubjects}</p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
          <p className="text-xs text-[#64748B] font-medium">Días lectivos en uso</p>
          <p className="text-xl font-bold text-[#0F3C6E] mt-1">{totalDays} / 7</p>
        </div>
      </div>
    </div>
  );
};
