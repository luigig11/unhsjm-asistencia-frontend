import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { OfferingHeader } from '../components/offering/OfferingHeader';
import type { AcademicInstance } from '../components/offering/OfferingHeader';
import { GroupSidebar } from '../components/offering/GroupSidebar';
import type { AcademicGroup } from '../components/offering/GroupSidebar';
import { GroupSubjectTable } from '../components/offering/GroupSubjectTable';
import type { GroupSubject } from '../components/offering/GroupSubjectTable';
import { ModalCrearGrupo } from '../components/offering/ModalCrearGrupo';
import { ModalAsignarMateria } from '../components/offering/ModalAsignarMateria';
import type { SubjectOption, TeacherOption } from '../components/offering/ModalAsignarMateria';
import { Button } from '../components/common/Button';
import {
  listarInstanciasAcademicas,
  listarGrupos,
  crearGrupo,
  listarMateriasPorGrupo,
  crearMateriaPorGrupo,
} from '../api/calendario';
import { listarDocentes } from '../api/docente';
import { listarPlanes, obtenerMallaCompleta } from '../api/planAcademico';

interface AcademicOfferingProps {
  onNavigateToSchedule?: () => void;
  onNavigateToEnrollment?: () => void;
}

export const AcademicOffering: React.FC<AcademicOfferingProps> = ({
  onNavigateToSchedule,
  onNavigateToEnrollment,
}) => {
  const [instances, setInstances] = useState<AcademicInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>('');
  const [groups, setGroups] = useState<AcademicGroup[]>([]);
  const [subjects, setSubjects] = useState<GroupSubject[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [groupSearch, setGroupSearch] = useState<string>('');

  const [availableTeachers, setAvailableTeachers] = useState<TeacherOption[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<SubjectOption[]>([]);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState<boolean>(false);
  const [isSavingGroup, setIsSavingGroup] = useState<boolean>(false);
  const [isSavingSubject, setIsSavingSubject] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [instanciasData, docentesData, planesData] = await Promise.all([
        listarInstanciasAcademicas({ activo: true }).catch(() => []),
        listarDocentes({ activo: true }).catch(() => []),
        listarPlanes({ activo: true }).catch(() => []),
      ]);

      const mappedInstances: AcademicInstance[] = instanciasData.map((inst) => ({
        id: inst.id,
        nombre: inst.nombre,
        periodoEscolar: inst.nombrePeriodoEscolar,
        bloque: `${inst.cicloNombre ?? ''} ${inst.periodoNombre ? `— ${inst.periodoNombre}` : ''}`.trim(),
        fecha_inicio: inst.fechaInicio,
        fecha_fin: inst.fechaFin,
        activo: inst.activo,
      }));
      setInstances(mappedInstances);

      if (mappedInstances.length > 0) {
        setSelectedInstanceId((prev) => prev || mappedInstances[0].id);
      }

      setAvailableTeachers(
        docentesData.map((d) => ({
          id: d.id,
          nombre: d.nombre_completo,
          codigo: d.codigo_empleado,
        }))
      );

      const subjectsMap = new Map<string, SubjectOption>();
      for (const plan of planesData.slice(0, 5)) {
        try {
          const malla = await obtenerMallaCompleta(plan.id);
          for (const ciclo of malla.ciclos ?? []) {
            for (const bloque of ciclo.bloques ?? []) {
              for (const mat of bloque.materias ?? []) {
                if (!subjectsMap.has(mat.idMallaCurricular)) {
                  subjectsMap.set(mat.idMallaCurricular, {
                    idMallaCurricular: mat.idMallaCurricular,
                    codigo: mat.materiaCodigo,
                    nombre: mat.materiaNombre,
                  });
                }
              }
            }
          }
        } catch {
          // fallback continue
        }
      }
      setAvailableSubjects(Array.from(subjectsMap.values()));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos de oferta académica');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadGroups = useCallback(async (instanceId: string) => {
    if (!instanceId) {
      setGroups([]);
      setSelectedGroupId('');
      return;
    }
    try {
      const data = await listarGrupos({ idInstanciaAcademica: instanceId, activo: true });
      const mapped: AcademicGroup[] = data.map((g) => ({
        id: g.id,
        codigo: g.codigo,
        nombre: g.nombre,
        cupo: g.cupo,
        instanciaId: g.idInstanciaAcademica,
      }));
      setGroups(mapped);
      if (mapped.length > 0) {
        setSelectedGroupId((prev) => (mapped.some((item) => item.id === prev) ? prev : mapped[0].id));
      } else {
        setSelectedGroupId('');
      }
    } catch {
      setGroups([]);
      setSelectedGroupId('');
    }
  }, []);

  useEffect(() => {
    if (selectedInstanceId) {
      loadGroups(selectedInstanceId);
    }
  }, [selectedInstanceId, loadGroups]);

  const loadSubjects = useCallback(async (groupId: string) => {
    if (!groupId) {
      setSubjects([]);
      return;
    }
    try {
      const data = await listarMateriasPorGrupo({ idGrupo: groupId, activo: true });
      const mapped: GroupSubject[] = data.map((m) => ({
        id: m.id,
        grupoId: m.idGrupo,
        materia: m.materiaNombre,
        codigoMateria: m.materiaCodigo,
        docente: m.docenteNombreCompleto,
        inscritos: m.totalInscritos ?? 0,
        cupo_limite: m.cupoLimite,
      }));
      setSubjects(mapped);
    } catch {
      setSubjects([]);
    }
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      loadSubjects(selectedGroupId);
    } else {
      setSubjects([]);
    }
  }, [selectedGroupId, loadSubjects]);

  const selectedInstance = useMemo(
    () => instances.find((inst) => inst.id === selectedInstanceId),
    [instances, selectedInstanceId]
  );

  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const matchesInstance = !selectedInstanceId || g.instanciaId === selectedInstanceId;
      const q = groupSearch.toLowerCase().trim();
      const matchesSearch = !q || g.codigo.toLowerCase().includes(q) || g.nombre.toLowerCase().includes(q);
      return matchesInstance && matchesSearch;
    });
  }, [groups, selectedInstanceId, groupSearch]);

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId),
    [groups, selectedGroupId]
  );

  const currentSubjects = useMemo(() => {
    return subjects.filter((s) => s.grupoId === selectedGroupId);
  }, [subjects, selectedGroupId]);

  const totalCapacity = useMemo(
    () => currentSubjects.reduce((acc, s) => acc + s.cupo_limite, 0),
    [currentSubjects]
  );

  const totalEnrolled = useMemo(
    () => currentSubjects.reduce((acc, s) => acc + s.inscritos, 0),
    [currentSubjects]
  );

  const handleCreateGroup = async (data: { codigo: string; nombre: string; cupo: number }) => {
    if (!selectedInstanceId) return;
    setIsSavingGroup(true);
    try {
      const created = await crearGrupo({
        idInstanciaAcademica: selectedInstanceId,
        codigo: data.codigo,
        nombre: data.nombre,
        cupo: data.cupo,
        activo: true,
      });

      const updated = await listarGrupos({ idInstanciaAcademica: selectedInstanceId, activo: true });
      const mapped: AcademicGroup[] = updated.map((g) => ({
        id: g.id,
        codigo: g.codigo,
        nombre: g.nombre,
        cupo: g.cupo,
        instanciaId: g.idInstanciaAcademica,
      }));
      setGroups(mapped);
      setSelectedGroupId(created.id);
      setIsGroupModalOpen(false);
    } finally {
      setIsSavingGroup(false);
    }
  };

  const handleAddSubject = async (data: {
    idMallaCurricular: string;
    idDocente: string;
    cupo_limite: number;
    materiaNombre?: string;
    materiaCodigo?: string;
    docenteNombre?: string;
  }) => {
    if (!selectedGroupId) return;
    setIsSavingSubject(true);
    try {
      await crearMateriaPorGrupo({
        idGrupo: selectedGroupId,
        idMallaCurricular: data.idMallaCurricular,
        idDocente: data.idDocente,
        cupoLimite: data.cupo_limite,
        activo: true,
      });

      await loadSubjects(selectedGroupId);
      setIsSubjectModalOpen(false);
    } finally {
      setIsSavingSubject(false);
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto flex-1 p-4 sm:p-6 space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="secondary"
            size="xs"
            onClick={loadInitialData}
            className="text-red-800 bg-red-100 hover:bg-red-200 border-red-200"
          >
            Reintentar
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#64748B]">
          Cargando oferta académica...
        </div>
      ) : (
        <>
          <OfferingHeader
            instances={instances}
            selectedInstanceId={selectedInstanceId}
            selectedInstance={selectedInstance}
            onSelectInstance={(id) => {
              setSelectedInstanceId(id);
              const firstInInstance = groups.find((g) => g.instanciaId === id);
              setSelectedGroupId(firstInInstance?.id || '');
            }}
            onOpenCreateGroup={() => setIsGroupModalOpen(true)}
            groupsCount={filteredGroups.length}
            subjectsCount={currentSubjects.length}
            totalEnrolled={totalEnrolled}
            totalCapacity={totalCapacity}
          />

          <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-5 items-start">
            <GroupSidebar
              groups={filteredGroups}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
              searchTerm={groupSearch}
              onSearchChange={setGroupSearch}
              getSubjectCount={(gId) => subjects.filter((s) => s.grupoId === gId).length}
            />

            <GroupSubjectTable
              selectedGroupName={selectedGroup?.nombre}
              selectedGroupCode={selectedGroup?.codigo}
              subjects={currentSubjects}
              onOpenAddSubject={() => setIsSubjectModalOpen(true)}
              onNavigateSchedule={onNavigateToSchedule}
              onNavigateEnrollment={onNavigateToEnrollment}
            />
          </div>

          <ModalCrearGrupo
            isOpen={isGroupModalOpen}
            onClose={() => setIsGroupModalOpen(false)}
            onSave={handleCreateGroup}
            isSaving={isSavingGroup}
          />

          <ModalAsignarMateria
            isOpen={isSubjectModalOpen}
            onClose={() => setIsSubjectModalOpen(false)}
            onSave={handleAddSubject}
            defaultCapacity={selectedGroup?.cupo || 35}
            availableSubjects={availableSubjects}
            availableTeachers={availableTeachers}
            isSaving={isSavingSubject}
          />
        </>
      )}
    </div>
  );
};

export default AcademicOffering;
