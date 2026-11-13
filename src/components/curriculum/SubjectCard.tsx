import React from 'react';

export interface SubjectMalla {
  id: string;
  materia_id: string;
  codigo: string;
  nombre: string;
  creditos: number;
  cantidad_horas_materia: number;
  encuentros_totales: number;
  encuentros_por_semana: number;
  obligatoria: boolean;
  prerequisitos: string[];
}

interface SubjectCardProps {
  subject: SubjectMalla;
  onEdit?: (subject: SubjectMalla) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onEdit,
}) => {
  return (
    <div
      onClick={() => onEdit?.(subject)}
      className="bg-white border border-[#E2E8F0] hover:border-[#1D63B8] rounded-md p-3 space-y-2.5 transition-all text-left cursor-pointer group shadow-none"
    >
      <div className="flex items-center justify-between gap-1.5">
        <span className="font-mono text-[11px] font-bold text-[#0F3C6E] bg-[#EBF3FC] px-1.5 py-0.5 rounded border border-[#1D63B8]/20 group-hover:border-[#1D63B8]">
          {subject.codigo}
        </span>
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
            subject.obligatoria
              ? 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]'
              : 'bg-[#FEF3C7] text-[#B45309] border-[#FCD34D]'
          }`}
        >
          {subject.obligatoria ? 'Obligatoria' : 'Optativa'}
        </span>
      </div>

      <p className="text-xs font-bold text-[#0F172A] leading-snug line-clamp-2">
        {subject.nombre}
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <span className="text-[10px] font-semibold bg-[#F8FAFC] text-[#0F3C6E] px-1.5 py-0.5 rounded border border-[#E2E8F0]">
          {subject.creditos} CR
        </span>
        <span className="text-[10px] font-medium bg-[#F8FAFC] text-[#475569] px-1.5 py-0.5 rounded border border-[#E2E8F0]">
          {subject.cantidad_horas_materia}h
        </span>
        <span className="text-[10px] font-medium bg-[#F8FAFC] text-[#475569] px-1.5 py-0.5 rounded border border-[#E2E8F0]">
          {subject.encuentros_totales} enc.
        </span>
        <span className="text-[10px] font-medium bg-[#F8FAFC] text-[#475569] px-1.5 py-0.5 rounded border border-[#E2E8F0]">
          {subject.encuentros_por_semana}/sem
        </span>
      </div>

      <div className="pt-2 border-t border-[#E2E8F0]/70 flex flex-wrap items-center gap-1">
        <span className="text-[9px] uppercase tracking-wider text-[#94A3B8] font-semibold mr-0.5">
          Prerreq:
        </span>
        {subject.prerequisitos.length > 0 ? (
          subject.prerequisitos.map((prereq) => (
            <span
              key={prereq}
              className="font-mono text-[9px] font-medium bg-[#F8FAFC] text-[#1D63B8] px-1.5 py-0.5 rounded border border-[#1D63B8]/30 hover:bg-[#EBF3FC]"
            >
              {prereq}
            </span>
          ))
        ) : (
          <span className="text-[10px] text-[#94A3B8] italic">Ninguno</span>
        )}
      </div>
    </div>
  );
};
