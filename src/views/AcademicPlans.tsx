import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { PlanFilters } from '../components/plans/PlanFilters';
import type { PlanFiltersState } from '../components/plans/PlanFilters';
import { PlanGrid } from '../components/plans/PlanGrid';
import type { PlanAcademicoItem } from '../components/plans/PlanCard';
import { ModalPlanAcademico } from '../components/plans/ModalPlanAcademico';
import {
  listarPlanes,
  crearPlanAcademico,
  type CreatePlanAcademicoDto,
  type PlanItemDto,
} from '../api/planAcademico';
import {
  listarCarreras,
  listarCentrosUniversitarios,
  listarModalidades,
  listarTiposPeriodoAcademico,
  listarDirecciones,
  type CarreraDto,
  type CentroUniversitarioDto,
  type ModalidadDto,
  type TipoPeriodoAcademicoDto,
  type DireccionDto,
} from '../api/catalogos';
import { AlertCircleIcon, CheckCircleIcon } from '../components/common/Icons';
import { Button } from '../components/common/Button';

interface AcademicPlansProps {
  onNavigateToMalla?: (planId: string, planCodigo: string) => void;
}

export const AcademicPlans: React.FC<AcademicPlansProps> = ({
  onNavigateToMalla,
}) => {
  const [plans, setPlans] = useState<PlanAcademicoItem[]>([]);
  const [carreras, setCarreras] = useState<CarreraDto[]>([]);
  const [centros, setCentros] = useState<CentroUniversitarioDto[]>([]);
  const [modalidades, setModalidades] = useState<ModalidadDto[]>([]);
  const [tiposPeriodo, setTiposPeriodo] = useState<TipoPeriodoAcademicoDto[]>([]);
  const [direcciones, setDirecciones] = useState<DireccionDto[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<PlanFiltersState>({
    searchQuery: '',
    selectedDireccion: 'TODAS',
    selectedCarrera: 'TODAS',
    selectedModalidad: 'TODAS',
    selectedEstado: 'TODOS',
  });

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        planesData,
        carrerasData,
        centrosData,
        modalidadesData,
        tiposPeriodoData,
        direccionesData,
      ] = await Promise.all([
        listarPlanes().catch(() => [] as PlanItemDto[]),
        listarCarreras({ activo: true }).catch(() => [] as CarreraDto[]),
        listarCentrosUniversitarios({ activo: true }).catch(() => [] as CentroUniversitarioDto[]),
        listarModalidades({ activo: true }).catch(() => [] as ModalidadDto[]),
        listarTiposPeriodoAcademico({ activo: true }).catch(() => [] as TipoPeriodoAcademicoDto[]),
        listarDirecciones({ activo: true }).catch(() => [] as DireccionDto[]),
      ]);

      setCarreras(carrerasData);
      setCentros(centrosData);
      setModalidades(modalidadesData);
      setTiposPeriodo(tiposPeriodoData);
      setDirecciones(direccionesData);

      const mapped: PlanAcademicoItem[] = planesData.map((p) => ({
        id: p.id,
        codigo: p.codigo,
        nombre: p.nombre,
        carrera: p.carreraNombre,
        direccion: p.centroNombre || 'Sede Central',
        modalidad: p.modalidadNombre,
        tipo_periodo: p.tipoPeriodoNombre,
        cantidad_ciclo_academico: p.cantidadCicloAcademico,
        cantidad_periodo_academico: p.cantidadPeriodoAcademico,
        activo_desde: p.activoDesde ? p.activoDesde.slice(0, 10) : '2026-01-01',
        activo_hasta: p.activoHasta ? p.activoHasta.slice(0, 10) : 'Indefinido',
        activo: p.activo,
        total_asignaturas: 0,
      }));

      setPlans(mapped);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los planes académicos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

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
        item.direccion.toLowerCase().includes(filters.selectedDireccion.toLowerCase());

      const matchesCarrera =
        filters.selectedCarrera === 'TODAS' ||
        item.carrera.toLowerCase().includes(filters.selectedCarrera.toLowerCase());

      const matchesModalidad =
        filters.selectedModalidad === 'TODAS' ||
        item.modalidad.toLowerCase().includes(filters.selectedModalidad.toLowerCase());

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

  const handleSavePlan = async (dto: CreatePlanAcademicoDto) => {
    setIsSaving(true);
    try {
      await crearPlanAcademico(dto);
      setSuccessMessage('Plan académico creado exitosamente.');
      await cargarDatos();
      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full text-left">
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

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5 text-rose-800 text-xs font-medium">
            <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="secondary"
            size="xs"
            onClick={cargarDatos}
            className="text-rose-700 border-rose-300 hover:bg-rose-100"
          >
            Reintentar
          </Button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-emerald-800 text-xs font-medium text-left">
          <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-[#64748B]">
          Cargando planes académicos y programas curriculares...
        </div>
      ) : (
        <>
          <PlanFilters
            filters={filters}
            onChange={setFilters}
            totalPlans={plans.length}
            onNewPlan={() => setIsModalOpen(true)}
            direcciones={direcciones}
            carreras={carreras}
            modalidades={modalidades}
          />

          <PlanGrid
            plans={filteredPlans}
            onDesignMalla={(plan) => {
              if (onNavigateToMalla) {
                onNavigateToMalla(plan.id, plan.codigo);
              }
            }}
            onClearFilters={handleClearFilters}
          />

          <ModalPlanAcademico
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSavePlan}
            carreras={carreras}
            centros={centros}
            modalidades={modalidades}
            tiposPeriodo={tiposPeriodo}
            isSaving={isSaving}
          />
        </>
      )}
    </div>
  );
};

export default AcademicPlans;
