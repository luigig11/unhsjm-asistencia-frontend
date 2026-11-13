import React from 'react';
import { KanbanIcon, CalendarIcon, CheckCircleIcon, ClockIcon } from '../common/Icons';
import { Button } from '../common/Button';

export interface PlanAcademicoItem {
  id: string;
  codigo: string; // ej. IS-2026
  nombre: string;
  carrera: string;
  direccion: string;
  modalidad: string;
  tipo_periodo: string; // Trimestral, Semestral
  cantidad_ciclo_academico: number; // Ej. 5 Años
  cantidad_periodo_academico: number; // Ej. 15 Trimestres
  activo_desde: string; // Ej. 2026-01-01
  activo_hasta: string; // Ej. 2030-12-31
  activo: boolean;
  total_asignaturas: number;
}

interface PlanCardProps {
  plan: PlanAcademicoItem;
  onDesignMalla: (plan: PlanAcademicoItem) => void;
  onEdit?: (plan: PlanAcademicoItem) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onDesignMalla,
  onEdit,
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] hover:border-[#1D63B8] rounded-lg p-5 flex flex-col justify-between transition-colors shadow-none text-left">
      <div>
        {/* Encabezado de la Tarjeta: Código de Plan + Badge de Estado Activo */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#0F3C6E] bg-[#EBF3FC] px-2 py-0.5 rounded border border-[#1D63B8]/30">
              {plan.codigo}
            </span>
            <span className="text-[11px] font-medium text-[#475569] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
              {plan.modalidad}
            </span>
          </div>

          {/* Badge Activo / Inactivo con estándares semánticos */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
              plan.activo
                ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                : 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]'
            }`}
          >
            <CheckCircleIcon className="w-3 h-3" />
            {plan.activo ? 'Vigente' : 'Inactivo'}
          </span>
        </div>

        {/* Carrera y Dirección Académica */}
        <div className="space-y-1 mb-4">
          <h3 className="text-base font-bold text-[#0F172A] leading-snug">
            {plan.carrera}
          </h3>
          <p className="text-xs text-[#475569] truncate">
            {plan.direccion}
          </p>
        </div>

        {/* Metadatos en Grilla Plana: Ciclos, Períodos y Tipo */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md mb-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#475569] block">
              Estructura
            </span>
            <span className="font-semibold text-[#0F172A]">
              {plan.cantidad_ciclo_academico} Ciclos / Años
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#475569] block">
              Bloques Totales
            </span>
            <span className="font-semibold text-[#0F172A]">
              {plan.cantidad_periodo_academico} {plan.tipo_periodo}s
            </span>
          </div>
          <div className="col-span-2 pt-1 border-t border-[#E2E8F0]/70 flex items-center justify-between">
            <span className="text-[11px] text-[#475569]">
              Asignaturas en malla:
            </span>
            <span className="font-semibold text-[#0F3C6E] text-xs">
              {plan.total_asignaturas} materias
            </span>
          </div>
        </div>

        {/* Rango de Vigencia (activo_desde — activo_hasta) */}
        <div className="flex items-center gap-1.5 text-xs text-[#475569] mb-4">
          <CalendarIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>Vigencia:</span>
          <span className="font-mono text-[11px] text-[#0F172A] font-medium">
            {plan.activo_desde} — {plan.activo_hasta}
          </span>
        </div>
      </div>

      {/* Acciones de Tarjeta: Botón Primario 'Diseñar Malla Curricular' */}
      <div className="pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          icon={<KanbanIcon className="w-3.5 h-3.5" />}
          onClick={() => onDesignMalla(plan)}
          className="flex-1"
        >
          Diseñar Malla Curricular
        </Button>

        {onEdit && (
          <Button
            variant="secondary"
            size="sm"
            icon={<ClockIcon className="w-3.5 h-3.5" />}
            onClick={() => onEdit(plan)}
            title="Editar metadatos del plan"
          />
        )}
      </div>
    </div>
  );
};
