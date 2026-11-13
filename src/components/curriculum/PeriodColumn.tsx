import React from 'react';
import { SubjectCard } from './SubjectCard';
import type { SubjectMalla } from './SubjectCard';
import { PlusIcon } from '../common/Icons';
import { Button } from '../common/Button';

export interface BloquePeriodo {
  id: string;
  nombre: string;
  duracion_semanas: number;
  duracion_meses: number;
  bloque_predecesor?: string;
  materias: SubjectMalla[];
}

interface PeriodColumnProps {
  bloque: BloquePeriodo;
  onAddSubject: (bloqueId: string) => void;
  onEditSubject?: (subject: SubjectMalla) => void;
}

export const PeriodColumn: React.FC<PeriodColumnProps> = ({
  bloque,
  onAddSubject,
  onEditSubject,
}) => {
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 flex flex-col min-w-[280px] max-w-[320px] shrink-0 text-left">
      <div className="pb-2.5 mb-2.5 border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">
            {bloque.nombre}
          </h4>
          <span className="text-[11px] font-semibold text-[#0F3C6E] bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
            {bloque.materias.length} mat.
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-[#475569]">
          <span>{bloque.duracion_semanas} sem.</span>
          <span>•</span>
          <span>{bloque.duracion_meses} meses</span>
          {bloque.bloque_predecesor && (
            <>
              <span>•</span>
              <span className="text-[#1D63B8] font-medium truncate">
                Pre: {bloque.bloque_predecesor}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2.5 flex-1 min-h-[120px]">
        {bloque.materias.map((materia) => (
          <SubjectCard
            key={materia.id}
            subject={materia}
            onEdit={onEditSubject}
          />
        ))}

        {bloque.materias.length === 0 && (
          <div className="border border-dashed border-[#CBD5E1] rounded-md p-4 text-center text-xs text-[#94A3B8]">
            Sin asignaturas asignadas
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        icon={<PlusIcon className="w-3.5 h-3.5" />}
        onClick={() => onAddSubject(bloque.id)}
        className="mt-3 w-full"
      >
        Agregar Asignatura
      </Button>
    </div>
  );
};
