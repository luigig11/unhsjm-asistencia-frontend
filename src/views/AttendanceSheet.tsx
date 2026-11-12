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

interface AttendanceSheetProps {
  idMateriaPorGrupo?: string;
  onBack?: () => void;
}

const formatFecha = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.split('T')[0] || iso;
  return d.toLocaleDateString('es-NI', {
    day: 'numeric',
    month: 'short',
  });
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
  const [group, setGroup] = useState<string>('ISI-301');
  const [period, setPeriod] = useState<string>('Año Lectivo 2026');
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

      if (data?.curso) {
        setGroup(data.curso.grupo_codigo || 'ISI-301');
      }

      if (Array.isArray(data?.sesiones_columnas)) {
        const mappedSessions: Session[] = data.sesiones_columnas.map((s) => ({
          id: s.numero_encuentro,
          number: s.numero_encuentro,
          date: formatFecha(s.fecha_inicio),
          label: `E${s.numero_encuentro}`,
        }));
        setSessions(mappedSessions);
      }

      if (Array.isArray(data?.alumnos_filas)) {
        const mappedStudents: SheetStudent[] = data.alumnos_filas.map((a, idx) => ({
          id: idx + 1,
          codigo_unico: a.codigo_unico,
          nombre: a.nombre_completo,
          attendance: a.marcajes.map((m) =>
            m.estado === 'PENDIENTE' ? 'A' : (m.estado as 'P' | 'A' | 'J')
          ),
          reasons: a.marcajes.map((m) => m.motivo_ausencia_nombre || ''),
        }));
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
            <button
              type="button"
              onClick={cargarSabana}
              className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-white border border-rose-300 rounded hover:bg-rose-100 transition-colors shrink-0"
            >
              Reintentar
            </button>
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
