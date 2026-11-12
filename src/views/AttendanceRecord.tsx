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
import { CheckCircleIcon, AlertCircleIcon, ArrowLeftIcon } from '../components/common/Icons';

interface AttendanceRecordProps {
  sessionId?: string;
  onBack?: () => void;
  onNavigateToSheet?: (courseId: string) => void;
}

const formatHora = (iso: string): string => {
  if (!iso) return '--:--';
  const d = new Date(iso);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  const parts = iso.split('T');
  return parts[1] ? parts[1].substring(0, 5) : iso;
};

const formatFecha = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.split('T')[0] || iso;
  return d.toLocaleDateString('es-NI', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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
            targetId = sesiones[0].id;
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
        if (acta?.sesion) {
          setSessionData(acta.sesion);
        }

        if (acta?.cabecera_asistencia) {
          const cab = acta.cabecera_asistencia;
          setTeacherAttended(cab.docente_asignado_asistio !== false);
          setSubstituteTeacherId(cab.id_docente_sustituto || '');
          setSubstituteTeacher(cab.docente_sustituto_nombre || '');
          setSubstituteReasonId(cab.id_motivo_ausencia || '');
        }

        if (Array.isArray(acta?.estudiantes)) {
          const mappedStudents: StudentAttendance[] = acta.estudiantes.map((e) => ({
            id: e.id_inscripcion_grupo,
            codigo_unico: e.codigo_unico,
            carnet: e.carnet,
            nombre: e.nombre_completo,
            asistio: e.asistio ? 'Presente' : 'Ausente',
            motivoId: e.id_motivo_ausencia || '',
            motivo: '',
          }));
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
        docente_asignado_asistio: teacherAttended,
        id_docente_sustituto: !teacherAttended && substituteTeacherId ? substituteTeacherId : undefined,
        id_motivo_ausencia: !teacherAttended && substituteReasonId ? substituteReasonId : undefined,
        detalles: students.map((s) => ({
          id_inscripcion_grupo: s.id,
          asistio: s.asistio === 'Presente',
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
              <button
                type="button"
                onClick={onBack}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-[#475569] bg-white border border-[#CBD5E1] hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
                <span>Volver al Portal Docente</span>
              </button>
            )}

            {sessionData?.id_materia_por_grupo && onNavigateToSheet && (
              <button
                type="button"
                onClick={() => onNavigateToSheet(sessionData.id_materia_por_grupo)}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-[#0F3C6E] bg-[#EBF3FC] border border-[#93C5FD] hover:bg-[#D8E9F9] transition-colors cursor-pointer"
              >
                Ver Sábana de Asistencia
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5 text-rose-800 text-xs font-medium">
              <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={cargarDatos}
              className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-white border border-rose-300 rounded hover:bg-rose-100 transition-colors shrink-0"
            >
              Reintentar
            </button>
          </div>
        )}

        <AttendanceSessionHeader
          sessionId={activeSessionId}
          subjectName={sessionData?.materia_nombre || 'Desarrollo de Software III'}
          groupCode={sessionData?.grupo_codigo || 'ISI-301'}
          roomName={sessionData?.aula_codigo || 'A-101'}
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

      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] px-4 py-3 sm:px-6 shadow-md">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-[#0F172A]">
              {presentCount} presentes · {absentCount} ausentes
            </p>
            <p className="text-xs text-[#64748B]">
              {students.length} estudiantes inscritos en el acta
            </p>
          </div>

          <button
            type="button"
            onClick={saveAttendance}
            disabled={saving || loading}
            className={`w-full sm:w-auto px-8 py-2.5 rounded-md text-sm font-bold transition-colors cursor-pointer ${
              saved
                ? 'bg-[#15803D] text-white hover:bg-[#166534]'
                : 'bg-[#0F3C6E] hover:bg-[#1D63B8] text-white disabled:opacity-50'
            }`}
          >
            {saving ? 'Guardando en Servidor...' : saved ? '✓ Asistencia Actualizada (Guardar Nuevamente)' : 'Guardar Registro de Asistencia'}
          </button>
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
    </div>
  );
};

export default AttendanceRecord;
