import React from 'react';
import { PeriodColumn } from './PeriodColumn';
import type { BloquePeriodo } from './PeriodColumn';
import type { SubjectMalla } from './SubjectCard';

export interface CicloAcademicoGroup {
  id: string;
  ciclo_nombre: string;
  orden: number;
  bloques: BloquePeriodo[];
}

interface CurriculumKanbanProps {
  ciclos: CicloAcademicoGroup[];
  onAddSubjectToBloque: (bloqueId: string) => void;
  onEditSubject?: (subject: SubjectMalla) => void;
}

export const CurriculumKanban: React.FC<CurriculumKanbanProps> = ({
  ciclos,
  onAddSubjectToBloque,
  onEditSubject,
}) => {
  return (
    <div className="p-6 space-y-8 overflow-x-auto">
      {ciclos.map((ciclo) => (
        <section key={ciclo.id} className="space-y-3 text-left">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#E2E8F0]">
            <div className="w-2 h-4 bg-[#0F3C6E] rounded-xs" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
              {ciclo.ciclo_nombre}
            </h2>
            <span className="text-xs text-[#475569] font-medium">
              ({ciclo.bloques.length} Períodos)
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {ciclo.bloques.map((bloque) => (
              <PeriodColumn
                key={bloque.id}
                bloque={bloque}
                onAddSubject={onAddSubjectToBloque}
                onEditSubject={onEditSubject}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
