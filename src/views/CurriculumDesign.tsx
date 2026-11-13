import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CurriculumHeader } from '../components/curriculum/CurriculumHeader';
import { CurriculumKanban } from '../components/curriculum/CurriculumKanban';
import { ModalMallaCurricular } from '../components/curriculum/ModalMallaCurricular';
import type { CicloAcademicoGroup } from '../components/curriculum/CurriculumKanban';
import type { SubjectMalla } from '../components/curriculum/SubjectCard';
import {
  obtenerMallaCompleta,
  listarPlanes,
  type MallaCompletaDto,
  type PlanItemDto,
} from '../api/planAcademico';
import { listarMaterias, type MateriaDto } from '../api/catalogos';
import { Button } from '../components/common';
import { AlertCircleIcon, ChecklistIcon } from '../components/common/Icons';

interface CurriculumDesignProps {
  planId?: string;
  planCodigo?: string;
  onBackToPlans?: () => void;
}

const mapMallaDtoToCiclos = (malla: MallaCompletaDto): CicloAcademicoGroup[] => {
  if (!malla.ciclos || !Array.isArray(malla.ciclos)) return [];

  return malla.ciclos.map((ciclo) => ({
    id: ciclo.idCicloAcademico,
    ciclo_nombre: ciclo.cicloNombre,
    orden: ciclo.ordenCiclo,
    bloques: (ciclo.bloques || []).map((bloque) => ({
      id: bloque.idDetallePlanAcademico,
      nombre: bloque.periodoNombre,
      duracion_semanas: bloque.duracionSemanas,
      duracion_meses: bloque.duracionMeses,
      bloque_predecesor: undefined,
      materias: (bloque.materias || []).map((m) => ({
        id: m.idMallaCurricular,
        materia_id: m.idMateria,
        codigo: m.materiaCodigo,
        nombre: m.materiaNombre,
        creditos: m.creditos,
        cantidad_horas_materia: m.cantidadHorasMateria,
        encuentros_totales: m.encuentrosTotales,
        encuentros_por_semana: m.encuentrosPorSemana,
        obligatoria: m.obligatoria,
        prerequisitos: (m.prerequisitos || []).map((p) => p.materiaCodigo),
      })),
    })),
  }));
};

export const CurriculumDesign: React.FC<CurriculumDesignProps> = ({
  planId,
  planCodigo,
  onBackToPlans,
}) => {
  const [planes, setPlanes] = useState<PlanItemDto[]>([]);
  const [activePlanId, setActivePlanId] = useState<string>(planId || '');
  const [mallaData, setMallaData] = useState<MallaCompletaDto | null>(null);
  const [ciclos, setCiclos] = useState<CicloAcademicoGroup[]>([]);
  const [materiasCatalogo, setMateriasCatalogo] = useState<MateriaDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [targetBloqueId, setTargetBloqueId] = useState<string>('');
  const [editingSubject, setEditingSubject] = useState<SubjectMalla | null>(null);

  useEffect(() => {
    if (planId) {
      setActivePlanId(planId);
    }
  }, [planId]);

  const loadInitialData = useCallback(async () => {
    try {
      const [planesRes, materiasRes] = await Promise.all([
        listarPlanes(),
        listarMaterias().catch(() => [] as MateriaDto[]),
      ]);
      setPlanes(planesRes);
      setMateriasCatalogo(materiasRes);

      if (!activePlanId && planesRes.length > 0) {
        setActivePlanId(planesRes[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los planes académicos.');
    }
  }, [activePlanId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const fetchMalla = useCallback(async (id: string) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await obtenerMallaCompleta(id);
      setMallaData(res);
      setCiclos(mapMallaDtoToCiclos(res));
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar la estructura de la malla curricular desde el servidor.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activePlanId) {
      fetchMalla(activePlanId);
    }
  }, [activePlanId, fetchMalla]);

  const handleSelectPlan = (newId: string) => {
    setActivePlanId(newId);
  };

  const handleOpenAddModal = (bloqueId: string) => {
    setTargetBloqueId(bloqueId);
    setEditingSubject(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (subject: SubjectMalla) => {
    setEditingSubject(subject);
    setModalOpen(true);
  };

  const handleSaveSubject = (data: Partial<SubjectMalla>) => {
    if (editingSubject) {
      setCiclos((prev) =>
        prev.map((c) => ({
          ...c,
          bloques: c.bloques.map((b) => ({
            ...b,
            materias: b.materias.map((m) =>
              m.id === editingSubject.id ? ({ ...m, ...data } as SubjectMalla) : m
            ),
          })),
        }))
      );
    } else {
      setCiclos((prev) =>
        prev.map((c) => ({
          ...c,
          bloques: c.bloques.map((b) => {
            if (b.id === targetBloqueId) {
              return {
                ...b,
                materias: [...b.materias, data as SubjectMalla],
              };
            }
            return b;
          }),
        }))
      );
    }
  };

  const prerequisitosDisponibles = useMemo(() => {
    const list: Array<{ codigo: string; nombre: string }> = [];
    ciclos.forEach((c) => {
      c.bloques.forEach((b) => {
        b.materias.forEach((m) => {
          if (!list.some((item) => item.codigo === m.codigo)) {
            list.push({ codigo: m.codigo, nombre: m.nombre });
          }
        });
      });
    });
    return list;
  }, [ciclos]);

  const selectedPlanInfo = planes.find((p) => p.id === activePlanId);
  const currentPlanCodigo =
    mallaData?.plan?.codigo || selectedPlanInfo?.codigo || planCodigo || '';
  const currentCarreraNombre =
    mallaData?.plan?.carreraNombre ||
    selectedPlanInfo?.carreraNombre ||
    selectedPlanInfo?.nombre ||
    'Plan Académico';
  const currentModalidad =
    mallaData?.plan?.modalidadNombre ||
    selectedPlanInfo?.modalidadNombre ||
    '';

  const totalCiclos = ciclos.length;
  const totalTrimestres = ciclos.reduce((acc, c) => acc + c.bloques.length, 0);
  const totalMaterias = ciclos.reduce(
    (acc, c) => acc + c.bloques.reduce((subAcc, b) => subAcc + b.materias.length, 0),
    0
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      <CurriculumHeader
        planCodigo={currentPlanCodigo}
        carreraNombre={currentCarreraNombre}
        modalidad={currentModalidad}
        totalCiclos={totalCiclos}
        totalTrimestres={totalTrimestres}
        totalMaterias={totalMaterias}
        vigencia="2026 — 2030"
        onBackToPlans={onBackToPlans}
        planes={planes}
        selectedPlanId={activePlanId}
        onSelectPlanId={handleSelectPlan}
      />

      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={() => fetchMalla(activePlanId)}
          >
            Reintentar
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center p-12 text-[#64748B]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#0F3C6E] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium">Cargando malla curricular del plan académico...</p>
          </div>
        </div>
      ) : ciclos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-12 text-center text-[#64748B]">
          <div className="flex flex-col items-center gap-2 max-w-md">
            <div className="w-12 h-12 rounded-full bg-[#EBF3FC] flex items-center justify-center text-[#0F3C6E] mb-1">
              <ChecklistIcon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">Malla Curricular en Configuración</h3>
            <p className="text-xs text-[#64748B]">
              El plan académico ({currentPlanCodigo}) aún no cuenta con asignaturas registradas en su pensum curricular.
            </p>
            {onBackToPlans && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToPlans}
                className="mt-3"
              >
                Volver al Listado de Planes
              </Button>
            )}
          </div>
        </div>
      ) : (
        <CurriculumKanban
          ciclos={ciclos}
          onAddSubjectToBloque={handleOpenAddModal}
          onEditSubject={handleOpenEditModal}
        />
      )}

      <ModalMallaCurricular
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSubject}
        initialData={editingSubject}
        bloqueNombre={
          editingSubject
            ? 'Editar Asignatura'
            : targetBloqueId
            ? 'Nuevo Registro'
            : 'Período'
        }
        materiasDisponibles={materiasCatalogo}
        prerequisitosDisponibles={prerequisitosDisponibles}
      />
    </div>
  );
};

export default CurriculumDesign;
