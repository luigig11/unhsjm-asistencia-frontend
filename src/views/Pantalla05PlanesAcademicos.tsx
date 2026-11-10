import React, { useState, useMemo } from 'react';
import { PlanFilters } from '../components/plans/PlanFilters';
import type { PlanFiltersState } from '../components/plans/PlanFilters';
import { PlanGrid } from '../components/plans/PlanGrid';
import type { PlanAcademicoItem } from '../components/plans/PlanCard';

// Datos simulados de planes académicos institucionales
const INITIAL_PLANES: PlanAcademicoItem[] = [
  {
    id: 'plan-1',
    codigo: 'ISI-2026',
    nombre: 'Plan Curricular de Ingeniería en Sistemas de Información 2026',
    carrera: 'Ingeniería en Sistemas de Información',
    direccion: 'Tecnología e Informática',
    modalidad: 'Regular / Diurna',
    tipo_periodo: 'Trimestre',
    cantidad_ciclo_academico: 5,
    cantidad_periodo_academico: 15,
    activo_desde: '2026-01-01',
    activo_hasta: '2030-12-31',
    activo: true,
    total_asignaturas: 48,
  },
];

interface Pantalla05PlanesAcademicosProps {
  onNavigateToMalla?: (planCodigo: string) => void;
}

export const Pantalla05PlanesAcademicos: React.FC<Pantalla05PlanesAcademicosProps> = ({
  onNavigateToMalla,
}) => {
  const [plans] = useState<PlanAcademicoItem[]>(INITIAL_PLANES);
  const [filters, setFilters] = useState<PlanFiltersState>({
    searchQuery: '',
    selectedDireccion: 'TODAS',
    selectedCarrera: 'TODAS',
    selectedModalidad: 'TODAS',
    selectedEstado: 'TODOS',
  });

  // Filtrado de planes reactivo
  const filteredPlans = useMemo(() => {
    return plans.filter((item) => {
      // Búsqueda por texto (código o carrera)
      const q = filters.searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.codigo.toLowerCase().includes(q) ||
        item.carrera.toLowerCase().includes(q) ||
        item.nombre.toLowerCase().includes(q);

      // Filtro dirección
      const matchesDireccion =
        filters.selectedDireccion === 'TODAS' ||
        item.direccion === filters.selectedDireccion;

      // Filtro carrera
      const matchesCarrera =
        filters.selectedCarrera === 'TODAS' ||
        item.carrera === filters.selectedCarrera;

      // Filtro modalidad
      const matchesModalidad =
        filters.selectedModalidad === 'TODAS' ||
        item.modalidad === filters.selectedModalidad;

      // Filtro estado
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
      {/* Cabecera de Página */}
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

      {/* Barra de Filtros (Dirección, Carrera, Modalidad, Estado) */}
      <PlanFilters
        filters={filters}
        onChange={setFilters}
        totalPlans={plans.length}
        onNewPlan={() => alert('Crear nuevo plan académico')}
      />

      {/* Grilla de Tarjetas de Planes */}
      <PlanGrid
        plans={filteredPlans}
        onDesignMalla={(plan) => {
          if (onNavigateToMalla) {
            onNavigateToMalla(plan.codigo);
          } else {
            alert(`Navegar a diseñar malla curricular para ${plan.codigo}`);
          }
        }}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};
