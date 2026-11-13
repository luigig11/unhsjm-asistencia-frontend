import React from 'react';
import { PlanCard } from './PlanCard';
import type { PlanAcademicoItem } from './PlanCard';
import { DocumentTextIcon } from '../common/Icons';
import { Button } from '../common/Button';

interface PlanGridProps {
  plans: PlanAcademicoItem[];
  onDesignMalla: (plan: PlanAcademicoItem) => void;
  onEditPlan?: (plan: PlanAcademicoItem) => void;
  onClearFilters?: () => void;
}

export const PlanGrid: React.FC<PlanGridProps> = ({
  plans,
  onDesignMalla,
  onEditPlan,
  onClearFilters,
}) => {
  // Estado vacío cuando ningún plan coincide con los filtros
  if (plans.length === 0) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mx-auto mb-3 text-[#94A3B8]">
          <DocumentTextIcon className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-[#0F172A] mb-1">
          No se encontraron planes académicos
        </h4>
        <p className="text-xs text-[#475569] max-w-sm mx-auto mb-4">
          No hay planes académicos que coincidan con los criterios de búsqueda o filtros seleccionados.
        </p>
        {onClearFilters && (
          <Button
            variant="ghost"
            size="xs"
            onClick={onClearFilters}
            className="text-[#1D63B8] hover:underline"
          >
            Restablecer todos los filtros
          </Button>
        )}
      </div>
    );
  }

  // Grilla responsiva de tarjetas planas
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onDesignMalla={onDesignMalla}
          onEdit={onEditPlan}
        />
      ))}
    </div>
  );
};
