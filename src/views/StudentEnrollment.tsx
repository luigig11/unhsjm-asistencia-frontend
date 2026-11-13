import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { EnrollmentHeader, type Group } from '../components/enrollment/EnrollmentHeader';
import { StudentSearchSection, type Student } from '../components/enrollment/StudentSearchSection';
import { EnrolledStudentsTable, type EnrolledStudentItem } from '../components/enrollment/EnrolledStudentsTable';
import {
  listarMateriasPorGrupo,
  listarInscripcionesPorCurso,
  crearInscripcionGrupo,
  eliminarInscripcionGrupo,
} from '../api/calendario';
import { listarEstudiantes } from '../api/estudiante';
import { AlertCircleIcon } from '../components/common/Icons';

export const StudentEnrollment: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState<string>('');
  const [enrollments, setEnrollments] = useState<EnrolledStudentItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const [loadingGroups, setLoadingGroups] = useState<boolean>(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarGrupos = useCallback(async () => {
    setLoadingGroups(true);
    setError(null);
    try {
      const res = await listarMateriasPorGrupo({ activo: true });
      if (Array.isArray(res) && res.length > 0) {
        const mapped: Group[] = res.map((m) => ({
          id: m.id,
          materia: m.materiaNombre,
          codigoMateria: m.materiaCodigo,
          grupo: m.grupoCodigo,
          docente: m.docenteNombreCompleto || 'Docente Asignado',
          periodo: 'Año Lectivo 2026',
          cupoLimite: m.cupoLimite,
        }));
        setGroups(mapped);
        if (!groupId) {
          setGroupId(mapped[0].id);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar cursos ofertados.';
      setError(msg);
    } finally {
      setLoadingGroups(false);
    }
  }, [groupId]);

  useEffect(() => {
    cargarGrupos();
  }, [cargarGrupos]);

  const cargarInscripciones = useCallback(async () => {
    if (!groupId) return;
    setLoadingEnrollments(true);
    try {
      const res = await listarInscripcionesPorCurso({ idMateriaPorGrupo: groupId, activo: true });
      if (Array.isArray(res)) {
        const mapped: EnrolledStudentItem[] = res.map((i) => ({
          id: i.id,
          estudianteId: i.idEstudiante,
          codigo_unico: i.codigoUnico,
          carnet: i.carnet,
          nombre: `${i.nombres} ${i.primerApellido}${i.segundoApellido ? ' ' + i.segundoApellido : ''}`,
          fechaInscripcion: i.fechaInscripcion,
          activo: i.activo,
        }));
        setEnrollments(mapped);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar inscripciones del grupo.';
      setError(msg);
    } finally {
      setLoadingEnrollments(false);
    }
  }, [groupId]);

  useEffect(() => {
    cargarInscripciones();
  }, [cargarInscripciones]);

  const selectedGroup = useMemo(() => {
    return (
      groups.find((g) => g.id === groupId) ?? {
        id: '',
        materia: 'Sin materia asignada',
        codigoMateria: 'N/A',
        grupo: 'Sin grupo',
        docente: 'Sin docente asignado',
        periodo: 'N/A',
        cupoLimite: 0,
      }
    );
  }, [groups, groupId]);

  const enrolledIds = useMemo(() => {
    return enrollments.map((item) => item.estudianteId);
  }, [enrollments]);

  useEffect(() => {
    const query = search.trim();
    if (query.length < 2 || selectedStudent !== null) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const result = await listarEstudiantes({ search: query, activo: true });
        if (result?.items && Array.isArray(result.items)) {
          const filtered = result.items
            .filter((s) => !enrolledIds.includes(s.id))
            .slice(0, 6)
            .map((s) => ({
              id: s.id,
              codigo_unico: s.codigo_unico,
              carnet: s.carnet,
              nombre: `${s.nombres} ${s.primer_apellido}${s.segundo_apellido ? ' ' + s.segundo_apellido : ''}`,
              carrera: s.carrera_nombre || 'Ingeniería en Sistemas',
              activo: s.activo,
            }));
          setSuggestions(filtered);
        }
      } catch {}
    }, 250);

    return () => clearTimeout(timer);
  }, [search, selectedStudent, enrolledIds]);

  const occupied = enrollments.length;
  const cupoLimite = selectedGroup.cupoLimite || 1;
  const available = Math.max(selectedGroup.cupoLimite - occupied, 0);
  const percentage =
    selectedGroup.cupoLimite > 0
      ? Math.min((occupied / cupoLimite) * 100, 100)
      : 0;

  const handleEnrollStudent = async () => {
    if (!selectedStudent) {
      setFeedback('Primero selecciona un estudiante de la lista.');
      return;
    }
    if (available <= 0) {
      setFeedback('El grupo alcanzó su cupo límite.');
      return;
    }

    setLoadingAction(true);
    setError(null);
    try {
      await crearInscripcionGrupo({
        idMateriaPorGrupo: groupId,
        idEstudiante: selectedStudent.id,
      });

      setFeedback(`Inscripción registrada con éxito para ${selectedStudent.nombre}.`);
      setSearch('');
      setSelectedStudent(null);
      await cargarInscripciones();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar la matrícula.';
      setError(msg);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRemoveEnrollment = async (enrId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas retirar la matrícula de este estudiante?')) {
      return;
    }

    setLoadingAction(true);
    setError(null);
    try {
      await eliminarInscripcionGrupo(enrId);
      setFeedback('Estudiante desinscrito correctamente.');
      await cargarInscripciones();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al desinscribir estudiante.';
      setError(msg);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto flex-1 p-4 sm:p-6 space-y-5 text-left">
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5 text-rose-800 text-xs font-medium">
            <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={cargarInscripciones}
            className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-white border border-rose-300 rounded hover:bg-rose-100 transition-colors shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      <EnrollmentHeader
        groups={groups}
        selectedGroupId={groupId}
        onSelectGroup={(newId) => {
          setGroupId(newId);
          setSearch('');
          setSelectedStudent(null);
          setFeedback('');
        }}
        selectedGroup={selectedGroup}
        occupied={occupied}
        available={available}
        percentage={percentage}
      />

      <StudentSearchSection
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          if (selectedStudent) setSelectedStudent(null);
        }}
        suggestions={suggestions}
        selectedStudent={selectedStudent}
        onSelectStudent={(st) => {
          setSelectedStudent(st);
          setSearch(st.nombre);
          setSuggestions([]);
        }}
        onEnroll={handleEnrollStudent}
        feedback={feedback}
        isAvailable={available > 0}
        loading={loadingAction}
      />

      <EnrolledStudentsTable
        enrollments={enrollments}
        loading={loadingEnrollments || loadingGroups}
        onRemoveEnrollment={handleRemoveEnrollment}
      />
    </div>
  );
};

export default StudentEnrollment;
