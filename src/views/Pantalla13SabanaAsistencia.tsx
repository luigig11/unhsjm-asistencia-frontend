
import { useMemo, useState } from 'react';

type AttendanceStatus = 'P' | 'A' | 'J';

type Session = {
  id: number;
  number: number;
  date: string;
  label: string;
};

type Student = {
  id: number;
  carnet: string;
  nombre: string;
  attendance: AttendanceStatus[];
  reasons: string[];
};

const sessions: Session[] = [
  { id: 1, number: 1, date: '2026-10-05', label: '05/10' },
  { id: 2, number: 2, date: '2026-10-07', label: '07/10' },
  { id: 3, number: 3, date: '2026-10-12', label: '12/10' },
  { id: 4, number: 4, date: '2026-10-14', label: '14/10' },
  { id: 5, number: 5, date: '2026-10-19', label: '19/10' },
  { id: 6, number: 6, date: '2026-10-21', label: '21/10' },
  { id: 7, number: 7, date: '2026-10-26', label: '26/10' },
  { id: 8, number: 8, date: '2026-10-28', label: '28/10' },
];

const initialStudents: Student[] = [
  {
    id: 1,
    carnet: '2022-0012',
    nombre: 'Ana María López',
    attendance: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    reasons: ['', '', '', '', '', '', '', ''],
  },
  {
    id: 2,
    carnet: '2022-0013',
    nombre: 'Carlos Alberto Ruiz',
    attendance: ['P', 'A', 'P', 'P', 'P', 'P', 'A', 'P'],
    reasons: ['', 'Enfermedad', '', '', '', '', 'Permiso personal', ''],
  },
  {
    id: 3,
    carnet: '2022-0014',
    nombre: 'María Fernanda Pérez',
    attendance: ['P', 'P', 'J', 'P', 'P', 'P', 'P', 'P'],
    reasons: ['', '', 'Cita médica', '', '', '', '', ''],
  },
  {
    id: 4,
    carnet: '2022-0015',
    nombre: 'José Manuel García',
    attendance: ['A', 'P', 'A', 'P', 'P', 'A', 'P', 'P'],
    reasons: ['Enfermedad', '', 'Problemas familiares', '', '', 'Enfermedad', '', ''],
  },
  {
    id: 5,
    carnet: '2022-0016',
    nombre: 'Daniela Torres',
    attendance: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    reasons: ['', '', '', '', '', '', '', ''],
  },
  {
    id: 6,
    carnet: '2022-0017',
    nombre: 'Luis Fernando Castillo',
    attendance: ['P', 'A', 'P', 'J', 'P', 'P', 'P', 'P'],
    reasons: ['', 'Transporte', '', 'Permiso autorizado', '', '', '', ''],
  },
  {
    id: 7,
    carnet: '2022-0018',
    nombre: 'Andrea Morales',
    attendance: ['P', 'P', 'P', 'P', 'A', 'P', 'P', 'P'],
    reasons: ['', '', '', '', 'Enfermedad', '', '', ''],
  },
  {
    id: 8,
    carnet: '2022-0019',
    nombre: 'Roberto Sánchez',
    attendance: ['A', 'A', 'P', 'A', 'P', 'P', 'A', 'P'],
    reasons: ['Enfermedad', 'Transporte', '', 'Enfermedad', '', '', 'Permiso personal', ''],
  },
  {
    id: 9,
    carnet: '2022-0020',
    nombre: 'Gabriela Hernández',
    attendance: ['P', 'P', 'P', 'J', 'P', 'P', 'P', 'P'],
    reasons: ['', '', '', 'Cita médica', '', '', '', ''],
  },
  {
    id: 10,
    carnet: '2022-0021',
    nombre: 'Miguel Ángel López',
    attendance: ['P', 'P', 'A', 'A', 'P', 'P', 'P', 'P'],
    reasons: ['', '', 'Enfermedad', 'Enfermedad', '', '', '', ''],
  },
  {
    id: 11,
    carnet: '2022-0022',
    nombre: 'Valeria Gómez',
    attendance: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    reasons: ['', '', '', '', '', '', '', ''],
  },
  {
    id: 12,
    carnet: '2022-0023',
    nombre: 'Kevin Rodríguez',
    attendance: ['A', 'P', 'A', 'P', 'J', 'P', 'A', 'P'],
    reasons: ['Enfermedad', '', 'Transporte', '', 'Cita médica', '', 'Enfermedad', ''],
  },
];

const getPercentage = (attendance: AttendanceStatus[]) => {
  if (attendance.length === 0) return 0;

  const present = attendance.filter((status) => status === 'P').length;

  return Math.round((present / attendance.length) * 100);
};

const getStatusColor = (status: AttendanceStatus) => {
  switch (status) {
    case 'P':
      return 'bg-[#15803D] text-white border-[#15803D]';
    case 'A':
      return 'bg-[#C81E2B] text-white border-[#C81E2B]';
    case 'J':
      return 'bg-[#D97706] text-white border-[#D97706]';
  }
};

const getPercentageColor = (percentage: number) => {
  if (percentage >= 90) {
    return {
      text: 'text-[#15803D]',
      background: 'bg-[#DCFCE7]',
      label: 'Excelente',
    };
  }

  if (percentage >= 75) {
    return {
      text: 'text-[#D97706]',
      background: 'bg-[#FEF3C7]',
      label: 'Advertencia',
    };
  }

  return {
    text: 'text-[#C81E2B]',
    background: 'bg-[#FEE2E2]',
    label: 'Riesgo',
  };
};

export const Pantalla13SabanaAsistencia = () => {
  const [students] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('IS-02');
  const [period, setPeriod] = useState('2026-2');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase().trim();

    return students.filter((student) => {
      const matchesSearch =
        student.nombre.toLowerCase().includes(term) ||
        student.carnet.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'Todos' ||
        (statusFilter === 'Riesgo' &&
          getPercentage(student.attendance) < 75) ||
        (statusFilter === 'Advertencia' &&
          getPercentage(student.attendance) >= 75 &&
          getPercentage(student.attendance) < 90) ||
        (statusFilter === 'Excelente' &&
          getPercentage(student.attendance) >= 90);

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

  const averageAttendance = Math.round(
    students.reduce(
      (sum, student) => sum + getPercentage(student.attendance),
      0
    ) / students.length
  );

  const exportExcel = () => {
    const headers = [
      'Carnet',
      'Estudiante',
      ...sessions.map((session) => `Encuentro ${session.number} - ${session.label}`),
      'Porcentaje de asistencia',
    ];

    const rows = filteredStudents.map((student) => [
      student.carnet,
      student.nombre,
      ...student.attendance,
      `${getPercentage(student.attendance)}%`,
    ]);

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(';')
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

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ENCABEZADO */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D63B8] mb-2">
              Gestión académica / Control de asistencia
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F3C6E]">
              Sábana Consolidada de Asistencia
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Control acumulado de asistencia por estudiante y encuentro académico.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 print:hidden">
            <button
              type="button"
              onClick={exportExcel}
              className="px-4 py-3 rounded-md bg-white border border-[#15803D] text-[#15803D] text-sm font-bold hover:bg-[#F0FDF4]"
            >
              ↓ Exportar Excel
            </button>

            <button
              type="button"
              onClick={exportPDF}
              className="px-4 py-3 rounded-md bg-[#0F3C6E] text-white text-sm font-bold hover:bg-[#1D63B8]"
            >
              ↓ Exportar Acta PDF
            </button>
          </div>

        </div>

        {/* FILTROS */}
        <section className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-5 print:hidden">

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Instancia académica
              </label>

              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-md px-3 py-3 text-sm bg-white outline-none focus:border-[#1D63B8]"
              >
                <option value="2026-2">Segundo semestre 2026</option>
                <option value="2026-1">Primer semestre 2026</option>
                <option value="2025-2">Segundo semestre 2025</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Grupo académico
              </label>

              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-md px-3 py-3 text-sm bg-white outline-none focus:border-[#1D63B8]"
              >
                <option value="IS-02">IS-02</option>
                <option value="IS-01">IS-01</option>
                <option value="IS-03">IS-03</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Buscar estudiante
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre o carnet..."
                className="w-full border border-[#E2E8F0] rounded-md px-3 py-3 text-sm outline-none focus:border-[#1D63B8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Estado de asistencia
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-md px-3 py-3 text-sm bg-white outline-none focus:border-[#1D63B8]"
              >
                <option value="Todos">Todos los estudiantes</option>
                <option value="Excelente">Excelente (90% o más)</option>
                <option value="Advertencia">Advertencia (75% - 89%)</option>
                <option value="Riesgo">Riesgo (menos de 75%)</option>
              </select>
            </div>

          </div>
        </section>

        {/* RESUMEN */}
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">

          <div className="bg-white border border-[#BBF7D0] rounded-lg p-4">
            <p className="text-xs font-semibold text-[#15803D]">
              Registros presentes
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-[#15803D] mt-1">
              {totalPresent}
            </p>
          </div>

          <div className="bg-white border border-[#FECACA] rounded-lg p-4">
            <p className="text-xs font-semibold text-[#C81E2B]">
              Registros ausentes
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-[#C81E2B] mt-1">
              {totalAbsent}
            </p>
          </div>

          <div className="bg-white border border-[#FDE68A] rounded-lg p-4">
            <p className="text-xs font-semibold text-[#D97706]">
              Ausencias justificadas
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-[#D97706] mt-1">
              {totalJustified}
            </p>
          </div>

          <div className="bg-white border border-[#C7D9ED] rounded-lg p-4">
            <p className="text-xs font-semibold text-[#0F3C6E]">
              Promedio de asistencia
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F3C6E] mt-1">
              {averageAttendance}%
            </p>
          </div>

        </section>

        {/* INFORMACIÓN DEL REPORTE */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">

          <div>
            <h2 className="text-base font-bold text-[#0F3C6E]">
              Matriz de asistencia académica
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Grupo {group} · Instancia {period} · {filteredStudents.length} estudiantes
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-[#15803D] text-white flex items-center justify-center">P</span>
              Presente
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-[#C81E2B] text-white flex items-center justify-center">A</span>
              Ausente
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-[#D97706] text-white flex items-center justify-center">J</span>
              Justificada
            </span>
          </div>

        </div>

        {/* MATRIZ */}
        <section className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px] border-collapse text-left">

              <thead>
                <tr className="bg-[#0F3C6E] text-white">

                  <th className="sticky left-0 z-20 bg-[#0F3C6E] px-3 py-4 text-xs font-bold min-w-[55px]">
                    #
                  </th>

                  <th className="sticky left-[55px] z-20 bg-[#0F3C6E] px-3 py-4 text-xs font-bold min-w-[230px]">
                    Estudiante
                  </th>

                  {sessions.map((session) => (
                    <th
                      key={session.id}
                      className="px-2 py-3 text-center min-w-[75px] border-l border-white/15"
                    >
                      <div className="text-[10px] text-[#DCEBFA]">
                        Encuentro {session.number}
                      </div>
                      <div className="text-xs font-bold mt-1">
                        {session.label}
                      </div>
                    </th>
                  ))}

                  <th className="sticky right-0 z-20 bg-[#0F3C6E] px-3 py-4 text-center min-w-[115px] border-l border-white/20">
                    Asistencia %
                  </th>

                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={sessions.length + 3}
                      className="py-12 text-center text-sm text-slate-500"
                    >
                      No se encontraron estudiantes con esos criterios.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => {
                    const percentage = getPercentage(student.attendance);
                    const percentageStyle = getPercentageColor(percentage);

                    return (
                      <tr
                        key={student.id}
                        className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                      >

                        <td className="sticky left-0 z-10 bg-white px-3 py-3 text-xs text-slate-500 font-semibold">
                          {index + 1}
                        </td>

                        <td className="sticky left-[55px] z-10 bg-white px-3 py-3">
                          <p className="text-xs font-bold text-slate-800">
                            {student.nombre}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {student.carnet}
                          </p>
                        </td>

                        {student.attendance.map((status, sessionIndex) => {
                          const reason = student.reasons[sessionIndex];

                          const tooltip = [
                            `Encuentro ${sessionIndex + 1}`,
                            `Fecha: ${sessions[sessionIndex].date}`,
                            `Estado: ${
                              status === 'P'
                                ? 'Presente'
                                : status === 'A'
                                  ? 'Ausente'
                                  : 'Justificada'
                            }`,
                            reason ? `Motivo: ${reason}` : '',
                          ]
                            .filter(Boolean)
                            .join(' | ');

                          return (
                            <td
                              key={`${student.id}-${sessionIndex}`}
                              className="px-2 py-3 text-center border-l border-[#F1F5F9]"
                              title={tooltip}
                            >
                              <span
                                className={`inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold border ${getStatusColor(status)}`}
                              >
                                {status}
                              </span>
                            </td>
                          );
                        })}

                        <td className="sticky right-0 z-10 bg-white px-3 py-3 border-l border-[#E2E8F0]">
                          <div className="flex flex-col items-center gap-1">

                            <span className={`text-sm font-bold ${percentageStyle.text}`}>
                              {percentage}%
                            </span>

                            <span className={`text-[9px] font-bold px-2 py-1 rounded ${percentageStyle.background} ${percentageStyle.text}`}>
                              {percentageStyle.label}
                            </span>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>

          </div>

          <div className="px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <p className="text-[11px] text-slate-500">
              Los porcentajes se calculan como encuentros presentes / encuentros registrados. Las justificaciones se muestran por separado y no se contabilizan como presencia.
            </p>
          </div>

        </section>

        {/* RESUMEN DE ALERTAS */}
        <section className="mt-5 bg-white border border-[#E2E8F0] rounded-lg p-4">

          <h3 className="text-sm font-bold text-[#0F3C6E] mb-3">
            Indicadores de seguimiento
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <div className="flex items-center justify-between p-3 rounded-md bg-[#F0FDF4] border border-[#BBF7D0]">
              <span className="text-xs font-semibold text-[#166534]">
                Excelente
              </span>
              <span className="text-sm font-bold text-[#15803D]">
                {students.filter((s) => getPercentage(s.attendance) >= 90).length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-md bg-[#FFFBEB] border border-[#FDE68A]">
              <span className="text-xs font-semibold text-[#92400E]">
                En advertencia
              </span>
              <span className="text-sm font-bold text-[#D97706]">
                {students.filter((s) => {
                  const p = getPercentage(s.attendance);
                  return p >= 75 && p < 90;
                }).length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-md bg-[#FEF2F2] border border-[#FECACA]">
              <span className="text-xs font-semibold text-[#991B1B]">
                En riesgo
              </span>
              <span className="text-sm font-bold text-[#C81E2B]">
                {students.filter((s) => getPercentage(s.attendance) < 75).length}
              </span>
            </div>

          </div>
        </section>

        <p className="text-[10px] text-slate-400 mt-5 text-right">
          UNHSJM · Sistema de Gestión Académica y Control de Asistencia
        </p>

      </main>

      {/* ESTILOS PARA IMPRESIÓN PDF */}
      <style>
        {`
          @media print {
            @page {
              size: landscape;
              margin: 10mm;
            }

            body {
              background: white !important;
            }

            body * {
              visibility: hidden;
            }

            main, main * {
              visibility: visible;
            }

            main {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-width: none !important;
              padding: 0 !important;
            }

            .print\\:hidden {
              display: none !important;
            }

            table {
              font-size: 9px !important;
            }

            tr {
              break-inside: avoid;
            }

            .overflow-x-auto {
              overflow: visible !important;
            }

            th, td {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `}
      </style>

    </div>
  );
};
