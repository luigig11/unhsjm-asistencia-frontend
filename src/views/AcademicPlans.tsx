import React, { useState, useMemo } from 'react';
import { PlanFilters } from '../components/plans/PlanFilters';
import type { PlanFiltersState } from '../components/plans/PlanFilters';
import { PlanGrid } from '../components/plans/PlanGrid';
import type { PlanAcademicoItem } from '../components/plans/PlanCard';
import { ModalPlanAcademico } from '../components/plans/ModalPlanAcademico';

interface AcademicPlansProps {
  onNavigateToMalla?: (planCodigo: string) => void;
}

export const AcademicPlans: React.FC<AcademicPlansProps> = ({
  onNavigateToMalla,
}) => {
  const [plans, setPlans] = useState<PlanAcademicoItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<PlanFiltersState>({
    searchQuery: '',
    selectedDireccion: 'TODAS',
    selectedCarrera: 'TODAS',
    selectedModalidad: 'TODAS',
    selectedEstado: 'TODOS',
  });

  const filteredPlans = useMemo(() => {
    return plans.filter((item) => {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.codigo.toLowerCase().includes(q) ||
        item.carrera.toLowerCase().includes(q) ||
        item.nombre.toLowerCase().includes(q);

      const matchesDireccion =
        filters.selectedDireccion === 'TODAS' ||
        item.direccion === filters.selectedDireccion;

      const matchesCarrera =
        filters.selectedCarrera === 'TODAS' ||
        item.carrera === filters.selectedCarrera;

      const matchesModalidad =
        filters.selectedModalidad === 'TODAS' ||
        item.modalidad === filters.selectedModalidad;

      const matchesEstado =
        filters.selectedEstado === 'TODOS' ||
        (filters.selectedEstado === 'ACTIVOS' && item.activo) ||
        (filters.selectedEstado === 'INACTIVOS' && !item.activo);

      return (
        matchesQuery &&
        matchesDireccion &&
        matchesCarrera &&
        matchesModalidad &&
        matchesEstado
      );
    });
  }, [plans, filters]);

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      selectedDireccion: 'TODAS',
      selectedCarrera: 'TODAS',
      selectedModalidad: 'TODAS',
      selectedEstado: 'TODOS',
    });
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Planes Académicos
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Gestión y diseño curricular de los programas académicos vigentes e históricos
          </p>
        </div>
        <div className="text-xs text-[#475569] font-medium self-start sm:self-auto">
          Mostrando {filteredPlans.length} de {plans.length} planes
        </div>
      </div>

      <PlanFilters
        filters={filters}
        onChange={setFilters}
        totalPlans={plans.length}
        onNewPlan={() => setIsModalOpen(true)}
      />

      <PlanGrid
        plans={filteredPlans}
        onDesignMalla={(plan) => {
          if (onNavigateToMalla) {
            onNavigateToMalla(plan.codigo);
          }
        }}
        onClearFilters={handleClearFilters}
      />

      <ModalPlanAcademico
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newPlan) => setPlans((prev) => [newPlan, ...prev])}
      />
    </div>
  );
};

export default AcademicPlans;
