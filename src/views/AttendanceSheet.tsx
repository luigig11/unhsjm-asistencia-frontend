import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  AttendanceSheetHeader,
  type OpcionCursoSabana,
} from '../components/attendance/AttendanceSheetHeader';
import { AttendanceSheetSummary } from '../components/attendance/AttendanceSheetSummary';
import {
  AttendanceMatrixTable,
  getPercentage,
  type Session,
  type SheetStudent,
} from '../components/attendance/AttendanceMatrixTable';
import {
  obtenerSabanaAsistenciaGrupo,
  type SabanaAsistencia,
} from '../api/asistencia';
import { listarMateriasPorGrupo } from '../api/calendario';
import { AlertCircleIcon } from '../components/common/Icons';
import { Button } from '../components/common/Button';

interface AttendanceSheetProps {
  idMateriaPorGrupo?: string;
  onBack?: () => void;
}

const formatFecha = (iso: string): string => {
  if (!iso) return '';
  const dateStr = iso.includes('T') ? iso.split('T')[0] : iso.split(' ')[0];
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const localDate = new Date(year, month, day);
    return localDate.toLocaleDateString('es-NI', {
      day: 'numeric',
      month: 'short',
    });
  }
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.split('T')[0] || iso;
  return d.toLocaleDateString('es-NI', {
    day: 'numeric',
    month: 'short',
  });
};

const ESTUDIANTES_CATALOGO: Record<string, { nombre: string; codigo_unico: string }> = {
  '1512292': { nombre: 'Andrew Ramón Torrez Gutiérrez', codigo_unico: '6C688F22' },
  '2210451': { nombre: 'Luis Enrique Garcia Cantillano', codigo_unico: '7B419A15' },
  '2210452': { nombre: 'Humberto José Oviedo Pérez', codigo_unico: '8F523C40' },
};

export const AttendanceSheet: React.FC<AttendanceSheetProps> = ({
  idMateriaPorGrupo,
  onBack,
}) => {
  const [cursos, setCursos] = useState<OpcionCursoSabana[]>([]);
  const [selectedCursoId, setSelectedCursoId] = useState<string>(idMateriaPorGrupo || '');
  const [sabanaData, setSabanaData] = useState<SabanaAsistencia | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [students, setStudents] = useState<SheetStudent[]>([]);

  const [search, setSearch] = useState<string>('');
  const [group, setGroup] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (idMateriaPorGrupo) {
      setSelectedCursoId(idMateriaPorGrupo);
    }
  }, [idMateriaPorGrupo]);

  const cargarCursos = useCallback(async () => {
    try {
      const res = await listarMateriasPorGrupo({ activo: true });
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map((m) => ({
          id: m.id,
          nombre: m.materiaNombre,
          grupo: m.grupoCodigo,
        }));
        setCursos(mapped);
        if (!selectedCursoId) {
          setSelectedCursoId(mapped[0].id);
        }
      }
    } catch {}
  }, [selectedCursoId]);

  useEffect(() => {
    cargarCursos();
  }, [cargarCursos]);

  const cargarSabana = useCallback(async () => {
    if (!selectedCursoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerSabanaAsistenciaGrupo(selectedCursoId);
      setSabanaData(data);

      const rawCurso = data?.curso;
      if (rawCurso) {
        setGroup((rawCurso.grupoCodigo || rawCurso.grupo_codigo || 'ISI-IIIB').replace('-DOM', ''));
        setPeriod(rawCurso.instanciaNombre || rawCurso.instancia_nombre || '');
      }

      const rawCols = data?.sesionesColumnas || data?.sesiones_columnas;
      if (Array.isArray(rawCols)) {
        const mappedSessions: Session[] = rawCols.map((s) => {
          const num = s.numeroEncuentro ?? s.numero_encuentro ?? 1;
          const f = s.fechaInicio || s.fecha_inicio || '';
          return {
            id: num,
            number: num,
            date: formatFecha(f),
            label: `E${num}`,
          };
        });
        setSessions(mappedSessions);
      }

      const rawFilas = data?.alumnosFilas || data?.alumnos_filas;
      if (Array.isArray(rawFilas)) {
        const mappedStudents: SheetStudent[] = rawFilas.map((a, idx) => {
          const carnetKey = (a.carnet || '').trim();
          const fallback = ESTUDIANTES_CATALOGO[carnetKey];
          return {
            id: idx + 1,
            codigo_unico: a.codigoUnico || a.codigo_unico || fallback?.codigo_unico || 'SETEC',
            nombre: a.nombreCompleto || a.nombre_completo || fallback?.nombre || `Estudiante ${carnetKey}`,
            attendance: (a.marcajes || []).map((m) =>
              m.estado === 'PENDIENTE' ? 'A' : (m.estado as 'P' | 'A' | 'J')
            ),
            reasons: (a.marcajes || []).map((m) => m.motivoAusenciaNombre || m.motivo_ausencia_nombre || ''),
          };
        });
        setStudents(mappedStudents);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar la sábana de asistencia.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedCursoId]);

  useEffect(() => {
    cargarSabana();
  }, [cargarSabana]);

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase().trim();

    return students.filter((student) => {
      const matchesSearch =
        student.nombre.toLowerCase().includes(term) ||
        student.codigo_unico.toLowerCase().includes(term);

      const percentage = getPercentage(student.attendance);
      const matchesStatus =
        statusFilter === 'Todos' ||
        (statusFilter === 'Riesgo' && percentage < 75) ||
        (statusFilter === 'Advertencia' && percentage >= 75 && percentage < 90) ||
        (statusFilter === 'Excelente' && percentage >= 90);

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  const totalPresent = students.reduce(
    (sum, student) =>
      sum + student.attendance.filter((status) => status === 'P').length,
    0
  );

  const totalAbsent = students.reduce(
    (sum, student) =>
      sum + student.attendance.filter((status) => status === 'A').length,
    0
  );

  const totalJustified = students.reduce(
    (sum, student) =>
      sum + student.attendance.filter((status) => status === 'J').length,
    0
  );

  const averageAttendance =
    students.length > 0
      ? Math.round(
          students.reduce(
            (sum, student) => sum + getPercentage(student.attendance),
            0
          ) / students.length
        )
      : 0;

  const excelenteCount = students.filter(
    (s) => getPercentage(s.attendance) >= 90
  ).length;

  const advertenciaCount = students.filter((s) => {
    const p = getPercentage(s.attendance);
    return p >= 75 && p < 90;
  }).length;

  const riesgoCount = students.filter(
    (s) => getPercentage(s.attendance) < 75
  ).length;

  const handleExportExcel = () => {
    const headers = [
      'Código Único',
      'Estudiante',
      ...sessions.map((s) => `Sesión ${s.number} - ${s.label}`),
      'Porcentaje de Asistencia',
    ];

    const rows = filteredStudents.map((student) => [
      student.codigo_unico,
      student.nombre,
      ...student.attendance,
      `${getPercentage(student.attendance)}%`,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(';')
      )
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sabana_Asistencia_${group}_${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] text-left">
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <AttendanceSheetHeader
          cursos={cursos}
          selectedCursoId={selectedCursoId}
          onCursoChange={setSelectedCursoId}
          period={period}
          onPeriodChange={setPeriod}
          group={group}
          onGroupChange={setGroup}
          searchTerm={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          onBack={onBack}
        />

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5 text-rose-800 text-xs font-medium">
              <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              variant="secondary"
              size="xs"
              onClick={cargarSabana}
              className="text-rose-700 border-rose-300 hover:bg-rose-100"
            >
              Reintentar
            </Button>
          </div>
        )}

        <AttendanceSheetSummary
          totalPresent={totalPresent}
          totalAbsent={totalAbsent}
          totalJustified={totalJustified}
          averageAttendance={averageAttendance}
          excelenteCount={excelenteCount}
          advertenciaCount={advertenciaCount}
          riesgoCount={riesgoCount}
        />

        {loading ? (
          <div className="p-12 text-center text-xs text-[#475569] bg-white border border-[#E2E8F0] rounded-lg shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#1D63B8] border-t-transparent rounded-full animate-spin" />
              <span>Cargando matriz consolidada de asistencia...</span>
            </div>
          </div>
        ) : (
          <AttendanceMatrixTable
            students={filteredStudents}
            sessions={sessions}
            group={sabanaData?.curso?.grupo_codigo || group}
            period={period}
          />
        )}

        <p className="text-[10px] text-[#94A3B8] text-right print:hidden">
          UNHSJM · Sistema de Gestión Académica y Control de Asistencia
        </p>
      </main>
    </div>
  );
};

export default AttendanceSheet;
