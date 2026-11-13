import React from 'react';
import { ArrowLeftIcon } from '../common/Icons';

interface CurriculumHeaderProps {
  planCodigo: string;
  carreraNombre: string;
  modalidad: string;
  totalCiclos: number;
  totalTrimestres: number;
  totalMaterias: number;
  vigencia: string;
  onBackToPlans?: () => void;
}

export const CurriculumHeader: React.FC<CurriculumHeaderProps> = ({
  planCodigo,
  carreraNombre,
  modalidad,
  totalCiclos,
  totalTrimestres,
  totalMaterias,
  vigencia,
  onBackToPlans,
}) => {
  return (
    <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-2xs">
      <div className="flex items-center gap-3">
        {onBackToPlans && (
          <button
            type="button"
            onClick={onBackToPlans}
            className="p-1.5 rounded-md text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors cursor-pointer"
            title="Volver al listado de planes"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#0F3C6E] bg-[#EBF3FC] px-2 py-0.5 rounded border border-[#1D63B8]/30">
              {planCodigo}
            </span>
            <span className="text-[11px] font-medium text-[#475569] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
              {modalidad}
            </span>
            <span className="text-[11px] text-[#15803D] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#86EFAC]">
              Vigente ({vigencia})
            </span>
          </div>
          <h1 className="text-lg font-bold text-[#0F172A] mt-1 leading-snug">
            Malla Curricular: {carreraNombre}
          </h1>
        </div>
      </div>

      {/* Métricas rápidas de la malla */}
      <div className="flex items-center gap-4 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-3.5 py-2">
        <div className="text-left">
          <span className="text-[10px] uppercase font-semibold text-[#475569] block">
            Años / Ciclos
          </span>
          <span className="font-bold text-[#0F172A]">{totalCiclos} Ciclos</span>
        </div>
        <div className="h-6 w-px bg-[#E2E8F0]" />
        <div className="text-left">
          <span className="text-[10px] uppercase font-semibold text-[#475569] block">
            Períodos
          </span>
          <span className="font-bold text-[#0F172A]">{totalTrimestres} Bloques</span>
        </div>
        <div className="h-6 w-px bg-[#E2E8F0]" />
        <div className="text-left">
          <span className="text-[10px] uppercase font-semibold text-[#475569] block">
            Asignaturas
          </span>
          <span className="font-bold text-[#0F3C6E]">{totalMaterias} Materias</span>
        </div>
      </div>
    </div>
  );
};
