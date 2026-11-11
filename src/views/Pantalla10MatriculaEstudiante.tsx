
import { useMemo, useState } from 'react';

type Student = {
  id: number;
  carnet: string;
  nombre: string;
  carrera: string;
  activo: boolean;
};

type Group = {
  id: number;
  materia: string;
  codigoMateria: string;
  grupo: string;
  docente: string;
  periodo: string;
  cupoLimite: number;
};

type Enrollment = {
  id: number;
  estudianteId: number;
  grupoId: number;
  fechaInscripcion: string;
  activo: boolean;
};

const STUDENTS: Student[] = [
  { id: 1, carnet: '2022-0012', nombre: 'Andrea López Hernández', carrera: 'Ingeniería en Sistemas', activo: true },
  { id: 2, carnet: '2022-0025', nombre: 'Carlos Méndez Ruiz', carrera: 'Ingeniería en Sistemas', activo: true },
  { id: 3, carnet: '2023-0008', nombre: 'María Fernanda Torres', carrera: 'Administración de Empresas', activo: true },
  { id: 4, carnet: '2023-0019', nombre: 'José Manuel García', carrera: 'Ingeniería en Sistemas', activo: true },
  { id: 5, carnet: '2021-0041', nombre: 'Daniela Ramírez Castillo', carrera: 'Ingeniería en Sistemas', activo: true },
  { id: 6, carnet: '2022-0053', nombre: 'Luis Alberto Pérez', carrera: 'Contabilidad', activo: true },
  { id: 7, carnet: '2023-0027', nombre: 'Sofía Martínez López', carrera: 'Ingeniería en Sistemas', activo: true },
  { id: 8, carnet: '2021-0064', nombre: 'Miguel Ángel Sánchez', carrera: 'Ingeniería en Sistemas', activo: false },
  { id: 9, carnet: '2022-0070', nombre: 'Valeria Castro Flores', carrera: 'Administración de Empresas', activo: true },
];

const GROUPS: Group[] = [
  {
    id: 1,
    materia: 'Programación I',
    codigoMateria: 'IS-101',
    grupo: 'IS-01',
    docente: 'Carlos Martínez',
    periodo: '2026 - II',
    cupoLimite: 30,
  },
  {
    id: 2,
    materia: 'Base de Datos',
    codigoMateria: 'IS-204',
    grupo: 'IS-02',
    docente: 'María López',
    periodo: '2026 - II',
    cupoLimite: 25,
  },
  {
    id: 3,
    materia: 'Redes de Computadoras',
    codigoMateria: 'IS-305',
    grupo: 'IS-01',
    docente: 'Roberto Sánchez',
    periodo: '2026 - II',
    cupoLimite: 28,
  },
];

const INITIAL_ENROLLMENTS: Enrollment[] = [
  { id: 1, estudianteId: 1, grupoId: 1, fechaInscripcion: '2026-11-02', activo: true },
  { id: 2, estudianteId: 2, grupoId: 1, fechaInscripcion: '2026-11-03', activo: true },
  { id: 3, estudianteId: 4, grupoId: 1, fechaInscripcion: '2026-11-04', activo: true },
  { id: 4, estudianteId: 5, grupoId: 2, fechaInscripcion: '2026-11-04', activo: true },
  { id: 5, estudianteId: 7, grupoId: 2, fechaInscripcion: '2026-11-05', activo: true },
];

const inputClass =
  'w-full border border-[#CBD5E1] rounded-md px-3 py-2.5 text-sm text-[#334155] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D63B8]';

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('es-NI', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const Pantalla10MatriculaEstudiante = () => {
  const [groupId, setGroupId] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(INITIAL_ENROLLMENTS);
  const [feedback, setFeedback] = useState('');

  const selectedGroup = GROUPS.find((group) => group.id === groupId) ?? GROUPS[0];

  const groupEnrollments = useMemo(
    () => enrollments.filter((item) => item.grupoId === groupId && item.activo),
    [enrollments, groupId]
  );

  const enrolledIds = groupEnrollments.map((item) => item.estudianteId);

  const suggestions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!query || selectedStudentId !== null) return [];

    return STUDENTS.filter((student) => {
      const matches =
        student.nombre.toLocaleLowerCase().includes(query) ||
        student.carnet.toLowerCase().includes(query);

      return matches && student.activo && !enrolledIds.includes(student.id);
    }).slice(0, 6);
  }, [search, selectedStudentId, groupId, enrollments]);

  const selectedStudent =
    STUDENTS.find((student) => student.id === selectedStudentId) ?? null;

  const occupied = groupEnrollments.length;
  const available = Math.max(selectedGroup.cupoLimite - occupied, 0);
  const percentage = Math.min((occupied / selectedGroup.cupoLimite) * 100, 100);

  function changeGroup(value: string) {
    setGroupId(Number(value));
    setSearch('');
    setSelectedStudentId(null);
    setFeedback('');
  }

  function enrollStudent() {
    if (!selectedStudent) {
      setFeedback('Primero seleccioná un estudiante de los resultados.');
      return;
    }

    if (available <= 0) {
      setFeedback('El grupo alcanzó su cupo límite.');
      return;
    }

    if (enrolledIds.includes(selectedStudent.id)) {
      setFeedback('El estudiante ya está inscrito en este grupo.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    setEnrollments((current) => [
      ...current,
      {
        id: current.length
          ? Math.max(...current.map((item) => item.id)) + 1
          : 1,
        estudianteId: selectedStudent.id,
        grupoId: groupId,
        fechaInscripcion: today,
        activo: true,
      },
    ]);

    setFeedback(`Inscripción registrada para ${selectedStudent.nombre}.`);
    setSearch('');
    setSelectedStudentId(null);
  }

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] p-4 md:p-6 text-[#334155]">

      {/* ENCABEZADO */}
      <header className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#1D63B8]">
          Gestión académica
        </p>

        <h1 className="text-2xl font-bold text-[#0F3C6E]">
          Matrícula de Estudiantes
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Inscripción de estudiantes en grupos académicos y control de cupos.
        </p>
      </header>

      {/* SELECCIÓN DE MATERIA Y GRUPO */}
      <section className="mb-5 rounded-lg border border-[#E2E8F0] bg-white p-4 md:p-5">
        <label className="mb-2 block text-xs font-semibold text-slate-600">
          Seleccionar materia y grupo
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <select
            className={inputClass}
            value={groupId}
            onChange={(event) => changeGroup(event.target.value)}
          >
            {GROUPS.map((group) => (
              <option key={group.id} value={group.id}>
                {group.codigoMateria} · {group.materia} · Grupo {group.grupo}
              </option>
            ))}
          </select>

          <p className="text-sm text-slate-500">
            Instancia académica:{' '}
            <strong className="text-[#0F3C6E]">{selectedGroup.periodo}</strong>
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#E2E8F0] pt-5 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Materia</p>
            <p className="mt-1 font-semibold text-[#0F3C6E]">{selectedGroup.materia}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Grupo</p>
            <p className="mt-1 font-semibold text-[#0F3C6E]">{selectedGroup.grupo}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Docente asignado</p>
            <p className="mt-1 font-semibold text-[#0F3C6E]">{selectedGroup.docente}</p>
          </div>
        </div>
      </section>

      {/* CAPACIDAD DEL GRUPO */}
      <section className="mb-5 rounded-lg border border-[#E2E8F0] bg-white p-4 md:p-5">
        <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-[#0F3C6E]">Capacidad del grupo</h2>
            <p className="mt-1 text-xs text-slate-500">
              Ocupación actual respecto al cupo límite.
            </p>
          </div>

          <p className="text-sm font-semibold text-[#0F3C6E]">
            {occupied} de {selectedGroup.cupoLimite} estudiantes
          </p>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${
              percentage >= 90 ? 'bg-[#D97706]' : 'bg-[#1D63B8]'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs">
          <span className="text-slate-500">
            {percentage.toFixed(0)}% de ocupación
          </span>

          <span className={`font-semibold ${
            available === 0 ? 'text-[#C81E2B]' : 'text-emerald-700'
          }`}>
            {available === 0
              ? 'Cupo completo'
              : `${available} espacios disponibles`}
          </span>
        </div>
      </section>

      {/* BUSCADOR E INSCRIPCIÓN */}
      <section className="mb-5 rounded-lg border border-[#E2E8F0] bg-white p-4 md:p-5">
        <h2 className="font-bold text-[#0F3C6E]">Inscribir estudiante</h2>

        <p className="mb-4 mt-1 text-xs text-slate-500">
          Buscá por nombre o carnet y seleccioná al estudiante.
        </p>

        <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Buscar estudiante
            </label>

            <input
              className={inputClass}
              value={search}
              placeholder="Escribí el nombre o número de carnet..."
              onChange={(event) => {
                setSearch(event.target.value);
                setSelectedStudentId(null);
                setFeedback('');
              }}
            />

            {search.trim() !== '' && selectedStudentId === null && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-[#E2E8F0] bg-white shadow-lg">
                {suggestions.length ? (
                  suggestions.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setSearch(student.nombre);
                        setFeedback('');
                      }}
                      className="block w-full border-b border-[#E2E8F0] px-4 py-3 text-left last:border-0 hover:bg-blue-50"
                    >
                      <span className="block text-sm font-semibold text-[#0F3C6E]">
                        {student.nombre}
                      </span>

                      <span className="mt-1 block text-xs text-slate-500">
                        Carnet: {student.carnet} · {student.carrera}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-slate-500">
                    No hay estudiantes activos disponibles con esa búsqueda.
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={enrollStudent}
            disabled={!selectedStudent || available === 0}
            className="rounded-md bg-[#0F3C6E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D63B8] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            + Confirmar inscripción
          </button>
        </div>

        {selectedStudent && (
          <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3">
            <p className="mb-1 text-xs font-semibold text-[#1D63B8]">
              Estudiante seleccionado
            </p>

            <p className="text-sm font-semibold text-[#0F3C6E]">
              {selectedStudent.nombre}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Carnet: {selectedStudent.carnet} · {selectedStudent.carrera}
            </p>
          </div>
        )}

        {feedback && (
          <p className={`mt-4 rounded-md border p-3 text-sm ${
            feedback.startsWith('Inscripción registrada')
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-amber-200 bg-amber-50 text-amber-800'
          }`}>
            {feedback}
          </p>
        )}
      </section>

      {/* NÓMINA DE ESTUDIANTES */}
      <section className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
        <div className="flex flex-col justify-between gap-2 border-b border-[#E2E8F0] p-4 md:flex-row md:items-center md:p-5">
          <div>
            <h2 className="font-bold text-[#0F3C6E]">
              Nómina oficial de estudiantes inscritos
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Estudiantes con inscripción activa en {selectedGroup.grupo}.
            </p>
          </div>

          <span className="w-fit rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#1D63B8]">
            {groupEnrollments.length} inscritos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">N.º</th>
                <th className="px-4 py-3">Carnet</th>
                <th className="px-4 py-3">Nombre del estudiante</th>
                <th className="px-4 py-3">Carrera</th>
                <th className="px-4 py-3">Fecha de inscripción</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>

            <tbody>
              {groupEnrollments.map((enrollment, index) => {
                const student = STUDENTS.find(
                  (item) => item.id === enrollment.estudianteId
                );

                if (!student) return null;

                return (
                  <tr
                    key={enrollment.id}
                    className="border-t border-[#E2E8F0] hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-500">{index + 1}</td>

                    <td className="px-4 py-3 font-medium text-[#0F3C6E]">
                      {student.carnet}
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {student.nombre}
                    </td>

                    <td className="px-4 py-3">{student.carrera}</td>

                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(enrollment.fechaInscripcion)}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Activo
                      </span>
                    </td>
                  </tr>
                );
              })}

              {groupEnrollments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-slate-400">
                    Todavía no hay estudiantes inscritos en este grupo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-4 text-xs text-slate-400">
        Vista de demostración: los registros se mantienen únicamente mientras la aplicación está abierta.
      </p>
    </main>
  );
};

