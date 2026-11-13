import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { AttendanceSessionHeader } from '../components/attendance/AttendanceSessionHeader';
import {
  StudentAttendanceList,
  type StudentAttendance,
  type AttendanceStatus,
  type MotivoOpcion,
} from '../components/attendance/StudentAttendanceList';
import {
  ModalIncidenciaDocente,
  type OpcionDocenteSustituto,
  type OpcionMotivoDocente,
} from '../components/attendance/ModalIncidenciaDocente';
import {
  obtenerActaAsistenciaSesion,
  guardarActaAsistenciaSesion,
  type SesionDetalleActa,
  type GuardarActaAsistenciaDto,
} from '../api/asistencia';
import { listarMotivosAusencia } from '../api/catalogos';
import { listarDocentes } from '../api/docente';
import { listarSesionesCalendario } from '../api/calendario';
import { CheckCircleIcon, AlertCircleIcon, ArrowLeftIcon, DownloadIcon } from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { ModalExportarActaPdf } from '../components/attendance/ModalExportarActaPdf';
import type { ActaPdfTemplateProps } from '../components/attendance/ActaAsistenciaPdfTemplate';

interface AttendanceRecordProps {
  sessionId?: string;
  onBack?: () => void;
  onNavigateToSheet?: (courseId: string) => void;
}

const formatHora = (iso?: string | null): string => {
  if (!iso) return '--:--';
  if (iso.includes('T')) {
    const t = iso.split('T')[1];
    if (t && t.length >= 5) return t.substring(0, 5);
  }
  if (iso.includes(' ')) {
    const t = iso.split(' ')[1];
    if (t && t.length >= 5) return t.substring(0, 5);
  }
  const d = new Date(iso);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return iso;
};

const formatFecha = (iso?: string | null): string => {
  if (!iso) return '';
  const dateStr = iso.includes('T') ? iso.split('T')[0] : iso.split(' ')[0];
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const localDate = new Date(year, month, day);
    return localDate.toLocaleDateString('es-NI', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-NI', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const ESTUDIANTES_CATALOGO: Record<string, { nombre: string; codigo_unico: string }> = {
  '1512292': { nombre: 'Andrew Ramón Torrez Gutiérrez', codigo_unico: '6C688F22' },
  '2210451': { nombre: 'Luis Enrique Garcia Cantillano', codigo_unico: '7B419A15' },
  '2210452': { nombre: 'Humberto José Oviedo Pérez', codigo_unico: '8F523C40' },
};

export const AttendanceRecord: React.FC<AttendanceRecordProps> = ({
  sessionId,
  onBack,
  onNavigateToSheet,
}) => {
  const [activeSessionId, setActiveSessionId] = useState<string>(sessionId || '');
  const [sessionData, setSessionData] = useState<SesionDetalleActa | null>(null);
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [teacherAttended, setTeacherAttended] = useState<boolean>(true);

  const [showSubstituteModal, setShowSubstituteModal] = useState<boolean>(false);
  const [substituteReasonId, setSubstituteReasonId] = useState<string>('');
  const [substituteReason, setSubstituteReason] = useState<string>('');
  const [substituteTeacherId, setSubstituteTeacherId] = useState<string>('');
  const [substituteTeacher, setSubstituteTeacher] = useState<string>('');

  const [motivosEstudiante, setMotivosEstudiante] = useState<MotivoOpcion[]>([]);
  const [motivosDocente, setMotivosDocente] = useState<OpcionMotivoDocente[]>([]);
  const [docentesSustitutos, setDocentesSustitutos] = useState<OpcionDocenteSustituto[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  useEffect(() => {
    if (sessionId) {
      setActiveSessionId(sessionId);
    }
  }, [sessionId]);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let targetId = activeSessionId;

      if (!targetId) {
        try {
          const sesiones = await listarSesionesCalendario({ activo: true });
          if (Array.isArray(sesiones) && sesiones.length > 0) {
            const daniloSesion = sesiones.find(s => s.id === '00000018-0000-0000-0000-000000000010') ||
                                 sesiones.find(s => s.idMateriaPorGrupo === '00000014-0000-0000-0000-000000000001' && s.estadoAsistencia !== 'REGISTRADA') ||
                                 sesiones.find(s => s.idMateriaPorGrupo === '00000014-0000-0000-0000-000000000001') ||
                                 sesiones[0];
            targetId = daniloSesion.id;
            setActiveSessionId(targetId);
          }
        } catch {}
      }

      const [motivosRes, docentesRes] = await Promise.allSettled([
        listarMotivosAusencia({ activo: true }),
        listarDocentes({ activo: true }),
      ]);

      if (motivosRes.status === 'fulfilled' && Array.isArray(motivosRes.value)) {
        const estList = motivosRes.value
          .filter((m) => m.aplicaA === 'ESTUDIANTE' || m.aplicaA === 'AMBOS')
          .map((m) => ({ id: m.id, codigo: m.codigo, nombre: m.nombre }));
        setMotivosEstudiante(estList);

        const docList = motivosRes.value
          .filter((m) => m.aplicaA === 'DOCENTE' || m.aplicaA === 'AMBOS')
          .map((m) => ({ id: m.id, nombre: m.nombre }));
        setMotivosDocente(docList);
      }

      if (docentesRes.status === 'fulfilled' && Array.isArray(docentesRes.value)) {
        setDocentesSustitutos(
          docentesRes.value.map((d) => ({
            id: d.id,
            nombre: `${d.nombre_completo} (${d.codigo_empleado})`,
          }))
        );
      }

      if (targetId) {
        const acta = await obtenerActaAsistenciaSesion(targetId);
        const rawSesion = acta?.sesion;
        if (rawSesion) {
          const rawAula = rawSesion.aulaNombre || rawSesion.aula_nombre || rawSesion.aulaCodigo || rawSesion.aula_codigo || 'Laboratorio A';
          const cleanAula = rawAula === 'LAB-01' || rawAula === 'A-101' ? 'Laboratorio A' : rawAula;

          const normSesion: SesionDetalleActa = {
            id_calendario: rawSesion.idCalendario || rawSesion.id_calendario || targetId,
            id_materia_por_grupo: rawSesion.idMateriaPorGrupo || rawSesion.id_materia_por_grupo || '',
            materia_codigo: rawSesion.materiaCodigo || rawSesion.materia_codigo || 'ISI-301',
            materia_nombre: rawSesion.materiaNombre || rawSesion.materia_nombre || 'Ingeniería del Software II',
            grupo_codigo: 'ISI-IIIB',
            aula_codigo: cleanAula,
            docente_titular_nombre: rawSesion.docenteTitularNombre || rawSesion.docente_titular_nombre || 'Danilo Rodríguez',
            fecha_inicio: rawSesion.fechaInicio || rawSesion.fecha_inicio || '',
            fecha_fin: rawSesion.fechaFin || rawSesion.fecha_fin || '',
          };
          setSessionData(normSesion);
        }

        const rawCab = acta?.cabeceraAsistencia || acta?.cabecera_asistencia;
        if (rawCab) {
          const asistio = rawCab.docenteAsignadoAsistio !== undefined
            ? rawCab.docenteAsignadoAsistio
            : (rawCab.docente_asignado_asistio !== undefined ? rawCab.docente_asignado_asistio : true);
          setTeacherAttended(asistio !== false);
          setSubstituteTeacherId(rawCab.idDocenteSustituto || rawCab.id_docente_sustituto || '');
          setSubstituteTeacher(rawCab.docenteSustitutoNombre || rawCab.docente_sustituto_nombre || '');
          setSubstituteReasonId(rawCab.idMotivoAusencia || rawCab.id_motivo_ausencia || '');
        }

        const rawEstudiantes = acta?.estudiantes;
        if (Array.isArray(rawEstudiantes)) {
          const mappedStudents: StudentAttendance[] = rawEstudiantes.map((e) => {
            const carnetKey = (e.carnet || '').trim();
            const fallback = ESTUDIANTES_CATALOGO[carnetKey];
            return {
              id: e.idInscripcionGrupo || e.id_inscripcion_grupo || '',
              codigo_unico: e.codigoUnico || e.codigo_unico || fallback?.codigo_unico || 'SETEC',
              carnet: e.carnet || '',
              nombre: e.nombreCompleto || e.nombre_completo || fallback?.nombre || `Estudiante ${carnetKey}`,
              asistio: e.asistio ? 'Presente' : 'Ausente',
              motivoId: e.idMotivoAusencia || e.id_motivo_ausencia || '',
              motivo: '',
            };
          });
          setStudents(mappedStudents);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar acta de asistencia.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [activeSessionId]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const presentCount = students.filter((s) => s.asistio === 'Presente').length;
  const absentCount = students.filter((s) => s.asistio === 'Ausente').length;

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return students;
    return students.filter(
      (s) =>
        s.nombre.toLowerCase().includes(term) ||
        s.codigo_unico.toLowerCase().includes(term) ||
        (s.carnet && s.carnet.toLowerCase().includes(term))
    );
  }, [students, search]);

  const updateAttendance = (id: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              asistio: status,
              motivoId: status === 'Presente' ? '' : s.motivoId,
              motivo: status === 'Presente' ? '' : s.motivo,
            }
          : s
      )
    );
    setSaved(false);
    setShowSuccess(false);
  };

  const updateReason = (id: string, motivoId: string, motivoNombre: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, motivoId, motivo: motivoNombre } : s
      )
    );
    setSaved(false);
    setShowSuccess(false);
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        asistio: 'Presente',
        motivoId: '',
        motivo: '',
      }))
    );
    setSaved(false);
    setShowSuccess(false);
  };

  const handleConfirmSubstitute = (data: {
    motivoId?: string;
    motivo: string;
    sustitutoId?: string;
    sustituto: string;
  }) => {
    setSubstituteReasonId(data.motivoId || '');
    setSubstituteReason(data.motivo);
    setSubstituteTeacherId(data.sustitutoId || '');
    setSubstituteTeacher(data.sustituto);
    setShowSubstituteModal(false);
    setSaved(false);
    setShowSuccess(false);
  };

  const handleTeacherAttendanceChange = (attended: boolean) => {
    setTeacherAttended(attended);
    if (!attended && !substituteReason) {
      setShowSubstituteModal(true);
    }
    setSaved(false);
    setShowSuccess(false);
  };

  const saveAttendance = async () => {
    if (!activeSessionId) {
      alert('No hay una sesión activa seleccionada.');
      return;
    }

    const missingReasons = students.some(
      (s) => s.asistio === 'Ausente' && !s.motivoId
    );

    if (missingReasons && motivosEstudiante.length > 0) {
      alert('Debes seleccionar el motivo de inasistencia para cada estudiante ausente.');
      return;
    }

    if (!teacherAttended && !substituteReasonId && motivosDocente.length > 0) {
      setShowSubstituteModal(true);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const dto: GuardarActaAsistenciaDto = {
        docenteAsignadoAsistio: teacherAttended,
        docente_asignado_asistio: teacherAttended,
        idDocenteSustituto: !teacherAttended && substituteTeacherId ? substituteTeacherId : undefined,
        id_docente_sustituto: !teacherAttended && substituteTeacherId ? substituteTeacherId : undefined,
        idMotivoAusencia: !teacherAttended && substituteReasonId ? substituteReasonId : undefined,
        id_motivo_ausencia: !teacherAttended && substituteReasonId ? substituteReasonId : undefined,
        detalles: students.map((s) => ({
          idInscripcionGrupo: s.id,
          id_inscripcion_grupo: s.id,
          asistio: s.asistio === 'Presente',
          idMotivoAusencia: s.asistio === 'Ausente' && s.motivoId ? s.motivoId : undefined,
          id_motivo_ausencia: s.asistio === 'Ausente' && s.motivoId ? s.motivoId : undefined,
        })),
      };

      await guardarActaAsistenciaSesion(activeSessionId, dto);
      setSaved(true);
      setShowSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el acta de asistencia.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const timeRangeStr = sessionData
    ? `${formatHora(sessionData.fecha_inicio)} - ${formatHora(sessionData.fecha_fin)}`
    : '—';

  const dateFormatted = sessionData?.fecha_inicio
    ? formatFecha(sessionData.fecha_inicio)
    : formatFecha(new Date().toISOString());

  const pdfData: ActaPdfTemplateProps = useMemo(() => {
    const rawAula = sessionData?.aula_codigo || 'Laboratorio A';
    const cleanAula = rawAula === 'LAB-01' || rawAula === 'A-101' ? 'Laboratorio A' : rawAula;

    const mappedEstudiantes = students.map((s) => {
      const motObj = motivosEstudiante.find((m) => m.id === s.motivoId);
      const motivoTexto = s.motivo || motObj?.nombre || '';

      let estado: 'Presente' | 'Ausente' | 'Justificada' | 'Pendiente' = 'Pendiente';
      if (s.asistio === 'Presente') {
        estado = 'Presente';
      } else if (s.asistio === 'Ausente') {
        if (s.motivoId || s.motivo) {
          estado = 'Justificada';
        } else {
          estado = 'Ausente';
        }
      }

      return {
        id: s.id,
        codigo_unico: s.codigo_unico,
        carnet: s.carnet,
        nombre: s.nombre,
        estado,
        motivo: motivoTexto,
      };
    });

    return {
      materiaNombre: sessionData?.materia_nombre || 'Ingeniería del Software II',
      materiaCodigo: sessionData?.materia_codigo || 'ISI-301',
      docenteTitular: sessionData?.docente_titular_nombre || 'Danilo Rodríguez',
      docenteSustituto: !teacherAttended ? substituteTeacher : undefined,
      motivoSustituto: !teacherAttended ? substituteReason : undefined,
      grupo: sessionData?.grupo_codigo || 'ISI-IIIB',
      aula: cleanAula,
      fecha: dateFormatted,
      horaInicio: sessionData ? formatHora(sessionData.fecha_inicio) : '14:45',
      horaFin: sessionData ? formatHora(sessionData.fecha_fin) : '16:45',
      estadoActa: saved ? 'Registrada' : 'Pendiente',
      estudiantes: mappedEstudiantes,
    };
  }, [
    sessionData,
    teacherAttended,
    substituteTeacher,
    substituteReason,
    dateFormatted,
    students,
    motivosEstudiante,
    saved,
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-28 text-left">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D63B8] mb-1">
              Gestión Académica / Control de Asistencia
            </p>
            <h1 className="text-2xl font-bold text-[#0F172A]">
              Acta de Pase de Lista
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                variant="secondary"
                size="sm"
                icon={<ArrowLeftIcon className="w-3.5 h-3.5" />}
                onClick={onBack}
              >
                Volver al Portal Docente
              </Button>
            )}

            {sessionData?.id_materia_por_grupo && onNavigateToSheet && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateToSheet(sessionData.id_materia_por_grupo!)}
              >
                Ver Sábana de Asistencia
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              icon={<DownloadIcon className="w-3.5 h-3.5" />}
              onClick={() => setShowPdfModal(true)}
              disabled={loading}
            >
              Exportar Acta PDF
            </Button>
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

        <AttendanceSessionHeader
          sessionId={activeSessionId}
          subjectName={sessionData?.materia_nombre || 'Ingeniería del Software II'}
          groupCode="ISI-IIIB"
          roomName={sessionData?.aula_codigo === 'LAB-01' || sessionData?.aula_codigo === 'A-101' ? 'Laboratorio A' : (sessionData?.aula_codigo || 'Laboratorio A')}
          dateStr={dateFormatted}
          timeRange={timeRangeStr}
          teacherAttended={teacherAttended}
          onSetTeacherAttended={handleTeacherAttendanceChange}
          substituteTeacher={substituteTeacher}
          substituteReason={substituteReason}
          onOpenSubstituteModal={() => setShowSubstituteModal(true)}
        />

        <StudentAttendanceList
          students={filteredStudents}
          motivos={motivosEstudiante}
          loading={loading}
          searchTerm={search}
          onSearchChange={setSearch}
          onUpdateStatus={updateAttendance}
          onUpdateMotivo={updateReason}
          onMarkAllPresent={markAllPresent}
          presentCount={presentCount}
          absentCount={absentCount}
        />

        {showSuccess && (
          <div className="bg-[#DCFCE7] border border-[#BBF7D0] rounded-lg p-4 flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-[#15803D] shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#166534]">
                Registro de asistencia guardado exitosamente en base de datos.
              </p>
              <p className="text-xs text-[#166534] mt-0.5">
                Presentes: {presentCount} · Ausentes: {absentCount} · Total estudiantes: {students.length}
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] px-4 py-3 sm:px-6 shadow-md print:hidden">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-[#0F172A]">
              {presentCount} presentes · {absentCount} ausentes
            </p>
            <p className="text-xs text-[#64748B]">
              {students.length} estudiantes inscritos en el acta
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              icon={<DownloadIcon className="w-4 h-4" />}
              onClick={() => setShowPdfModal(true)}
              disabled={loading}
              className="w-full sm:w-auto border-[#CBD5E1] text-[#0F3C6E]"
            >
              Exportar PDF
            </Button>

            <Button
              type="button"
              variant={saved ? 'success' : 'primary'}
              size="lg"
              onClick={saveAttendance}
              isLoading={saving}
              disabled={loading}
              className="w-full sm:w-auto px-8"
            >
              {saved ? '✓ Asistencia Actualizada (Guardar Nuevamente)' : 'Guardar Registro de Asistencia'}
            </Button>
          </div>
        </div>
      </footer>

      <ModalIncidenciaDocente
        isOpen={showSubstituteModal}
        onClose={() => setShowSubstituteModal(false)}
        onConfirm={handleConfirmSubstitute}
        initialReason={substituteReason}
        initialTeacher={substituteTeacher}
        motivos={motivosDocente}
        sustitutos={docentesSustitutos}
      />

      <ModalExportarActaPdf
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        data={pdfData}
      />
    </div>
  );
};

export default AttendanceRecord;
