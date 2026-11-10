import React from 'react';
import { SubjectCard } from './SubjectCard';
import type { SubjectMalla } from './SubjectCard';
import { PlusIcon } from '../common/Icons';

export interface BloquePeriodo {
  id: string;
  nombre: string; // ej. Trimestre I, Trimestre II
  duracion_semanas: number; // ej. 14 semanas
  duracion_meses: number; // ej. 3 meses
  bloque_predecesor?: string; // ej. "Trimestre I"
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
      {/* Cabecera del Bloque/Columna */}
      <div className="pb-2.5 mb-2.5 border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">
            {bloque.nombre}
          </h4>
          <span className="text-[11px] font-semibold text-[#0F3C6E] bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
            {bloque.materias.length} mat.
          </span>
        </div>

        {/* Subtítulo del bloque: duracion_semanas, duracion_meses y bloque predecesor */}
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

      {/* Lista de Asignaturas del Bloque */}
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

      {/* Botón '+ Agregar Asignatura' que abre el Modal A */}
      <button
        type="button"
        onClick={() => onAddSubject(bloque.id)}
        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#0F3C6E] hover:text-white bg-white hover:bg-[#0F3C6E] border border-[#CBD5E1] hover:border-[#0F3C6E] rounded-md transition-colors cursor-pointer shadow-none"
      >
        <PlusIcon className="w-3.5 h-3.5" />
        <span>Agregar Asignatura</span>
      </button>
    </div>
  );
};
