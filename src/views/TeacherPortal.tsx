import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { TeacherHeader } from '../components/teacher/TeacherHeader';
import { TeacherSessionList } from '../components/teacher/TeacherSessionList';
import type { TeacherSession } from '../components/teacher/TeacherSessionList';
import { obtenerAgendaHoyDocente, obtenerResumenDashboard } from '../api/dashboard';
import { listarSesionesCalendario, listarMateriasPorGrupo } from '../api/calendario';
import { AlertCircleIcon } from '../components/common/Icons';
import { Button } from '../components/common/Button';

interface TeacherPortalProps {
  onNavigateToAttendance?: (sessionId: string, courseId?: string) => void;
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

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  onNavigateToAttendance,
}) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TeacherSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('es-NI', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(today);

  const teacherDisplayName = user
    ? `${user.nombre} ${user.apellido}`
    : 'Docente Titular';

  const cargarSesiones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let sesionesMapeadas: TeacherSession[] = [];

      try {
        const agenda = await obtenerAgendaHoyDocente();
        if (Array.isArray(agenda) && agenda.length > 0) {
          sesionesMapeadas = agenda.map((s) => ({
            id: s.id_calendario,
            idMateriaPorGrupo: s.id_materia_por_grupo,
            materia: s.materia_nombre,
            codigo: s.materia_codigo,
            grupo: s.grupo_codigo,
            aula: s.aula_codigo,
            horaInicio: formatHora(s.fecha_inicio),
            horaFin: formatHora(s.fecha_fin),
            estado: s.acta_registrada ? 'Registrada' : 'Pendiente',
          }));
        }
      } catch {}

      if (sesionesMapeadas.length === 0) {
        try {
          const resumen = await obtenerResumenDashboard();
          if (resumen?.sesiones_hoy && resumen.sesiones_hoy.length > 0) {
            sesionesMapeadas = resumen.sesiones_hoy.map((s) => ({
              id: s.id_calendario,
              materia: s.materia_nombre,
              codigo: s.grupo_codigo,
              grupo: s.grupo_codigo,
              aula: s.aula_codigo,
              horaInicio: formatHora(s.fecha_inicio),
              horaFin: formatHora(s.fecha_fin),
              estado: s.estado_acta !== 'PENDIENTE' ? 'Registrada' : 'Pendiente',
            }));
          }
        } catch {}
      }

      if (sesionesMapeadas.length === 0) {
        try {
          const [calendarioList, materiasList] = await Promise.all([
            listarSesionesCalendario({ activo: true }),
            listarMateriasPorGrupo({ activo: true }),
          ]);

          const materiasMap = new Map(materiasList.map((m) => [m.id, m]));

          if (Array.isArray(calendarioList) && calendarioList.length > 0) {
            sesionesMapeadas = calendarioList.slice(0, 10).map((cal) => {
              const mat = materiasMap.get(cal.idMateriaPorGrupo);
              return {
                id: cal.id,
                idMateriaPorGrupo: cal.idMateriaPorGrupo,
                materia: mat ? mat.materiaNombre : 'Sesión Académica',
                codigo: mat ? mat.materiaCodigo : 'ISI-301',
                grupo: mat ? mat.grupoCodigo : 'G-01',
                aula: cal.aulaCodigo || 'A-101',
                horaInicio: formatHora(cal.fechaInicio),
                horaFin: formatHora(cal.fechaFin),
                estado: cal.estadoAsistencia === 'REGISTRADA' ? 'Registrada' : 'Pendiente',
              };
            });
          }
        } catch {}
      }

      setSessions(sesionesMapeadas);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar agenda docente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarSesiones();
  }, [cargarSesiones]);

  const pendingCount = sessions.filter((s) => s.estado === 'Pendiente').length;
  const registeredCount = sessions.filter((s) => s.estado === 'Registrada').length;

  const filteredSessions = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return sessions;

    return sessions.filter((session) =>
      [session.materia, session.codigo, session.grupo, session.aula].some((val) =>
        val.toLowerCase().includes(term)
      )
    );
  }, [sessions, search]);

  const handlePassAttendance = (session: TeacherSession) => {
    if (onNavigateToAttendance) {
      onNavigateToAttendance(session.id, session.idMateriaPorGrupo);
    }
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto flex-1 p-4 sm:p-6 space-y-5">
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5 text-rose-800 text-xs font-medium">
            <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="secondary"
            size="xs"
            onClick={cargarSesiones}
            className="text-rose-700 border-rose-300 hover:bg-rose-100"
          >
            Reintentar
          </Button>
        </div>
      )}

      <TeacherHeader
        teacherName={teacherDisplayName}
        formattedDate={formattedDate}
        totalSessions={sessions.length}
        pendingCount={pendingCount}
        registeredCount={registeredCount}
      />

      <TeacherSessionList
        sessions={filteredSessions}
        loading={loading}
        searchTerm={search}
        onSearchChange={setSearch}
        onPassAttendance={handlePassAttendance}
      />
    </div>
  );
};

export default TeacherPortal;
