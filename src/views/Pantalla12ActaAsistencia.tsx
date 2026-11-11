
import { useMemo, useState } from 'react';

type AttendanceStatus = 'Presente' | 'Ausente';

type StudentAttendance = {
  id: number;
  carnet: string;
  nombre: string;
  asistio: AttendanceStatus;
  motivo: string;
};

const motivosAusencia = [
  'Enfermedad',
  'Permiso personal',
  'Problemas familiares',
  'Problemas de transporte',
  'Otro',
];

const initialStudents: StudentAttendance[] = [
  { id: 1, carnet: '2022-0012', nombre: 'Ana María López', asistio: 'Presente', motivo: '' },
  { id: 2, carnet: '2022-0013', nombre: 'Carlos Alberto Ruiz', asistio: 'Presente', motivo: '' },
  { id: 3, carnet: '2022-0014', nombre: 'María Fernanda Pérez', asistio: 'Presente', motivo: '' },
  { id: 4, carnet: '2022-0015', nombre: 'José Manuel García', asistio: 'Ausente', motivo: 'Enfermedad' },
  { id: 5, carnet: '2022-0016', nombre: 'Daniela Torres', asistio: 'Presente', motivo: '' },
  { id: 6, carnet: '2022-0017', nombre: 'Luis Fernando Castillo', asistio: 'Presente', motivo: '' },
  { id: 7, carnet: '2022-0018', nombre: 'Andrea Morales', asistio: 'Presente', motivo: '' },
  { id: 8, carnet: '2022-0019', nombre: 'Roberto Sánchez', asistio: 'Presente', motivo: '' },
  { id: 9, carnet: '2022-0020', nombre: 'Gabriela Hernández', asistio: 'Ausente', motivo: 'Permiso personal' },
  { id: 10, carnet: '2022-0021', nombre: 'Miguel Ángel López', asistio: 'Presente', motivo: '' },
  { id: 11, carnet: '2022-0022', nombre: 'Valeria Gómez', asistio: 'Presente', motivo: '' },
  { id: 12, carnet: '2022-0023', nombre: 'Kevin Rodríguez', asistio: 'Presente', motivo: '' },
];

interface Pantalla12ActaAsistenciaProps {
  sessionId?: number;
}

export const Pantalla12ActaAsistencia = ({
  sessionId = 1,
}: Pantalla12ActaAsistenciaProps) => {
  const [students, setStudents] = useState<StudentAttendance[]>(initialStudents);
  const [teacherAttended, setTeacherAttended] = useState(true);

  const [showSubstituteModal, setShowSubstituteModal] = useState(false);
  const [substituteReason, setSubstituteReason] = useState('');
  const [substituteTeacher, setSubstituteTeacher] = useState('');
  const [substituteConfirmed, setSubstituteConfirmed] = useState(false);

  const [search, setSearch] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [saved, setSaved] = useState(false);

  const presentCount = students.filter(
    (student) => student.asistio === 'Presente'
  ).length;

  const absentCount = students.filter(
    (student) => student.asistio === 'Ausente'
  ).length;

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return students;

    return students.filter(
      (student) =>
        student.nombre.toLowerCase().includes(term) ||
        student.carnet.toLowerCase().includes(term)
    );
  }, [students, search]);

  const updateAttendance = (
    id: number,
    status: AttendanceStatus
  ) => {
    setStudents((previous) =>
      previous.map((student) =>
        student.id === id
          ? {
              ...student,
              asistio: status,
              motivo: status === 'Presente' ? '' : student.motivo,
            }
          : student
      )
    );

    setSaved(false);
    setShowSuccess(false);
  };

  const updateReason = (id: number, reason: string) => {
    setStudents((previous) =>
      previous.map((student) =>
        student.id === id
          ? { ...student, motivo: reason }
          : student
      )
    );

    setSaved(false);
    setShowSuccess(false);
  };

  const markAllPresent = () => {
    setStudents((previous) =>
      previous.map((student) => ({
        ...student,
        asistio: 'Presente',
        motivo: '',
      }))
    );

    setSaved(false);
    setShowSuccess(false);
  };

  const saveAttendance = () => {
    const missingReasons = students.some(
      (student) =>
        student.asistio === 'Ausente' && !student.motivo
    );

    if (missingReasons) {
      alert('Debés seleccionar el motivo de ausencia de cada estudiante ausente.');
      return;
    }

    if (!teacherAttended && !substituteReason) {
      setShowSubstituteModal(true);
      return;
    }

    setSaved(true);
    setShowSuccess(true);
  };

  const confirmSubstitute = () => {
    if (!substituteReason) {
      alert('Seleccioná el motivo de ausencia del docente.');
      return;
    }

    setSubstituteConfirmed(true);
    setShowSubstituteModal(false);
    setSaved(true);
    setShowSuccess(true);
  };

  const today = new Intl.DateTimeFormat('es-NI', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-28">

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ENCABEZADO */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1D63B8] mb-2">
            Gestión académica / Control de asistencia
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F3C6E]">
            Acta de Pase de Lista
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Registro de asistencia de estudiantes por sesión académica.
          </p>
        </div>

        {/* INFORMACIÓN DE LA SESIÓN */}
        <section className="bg-white border border-[#E2E8F0] rounded-lg p-4 sm:p-5 mb-5">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

            <div>
              <span className="text-xs font-semibold text-[#1D63B8] uppercase">
                Sesión académica #{sessionId}
              </span>

              <h2 className="text-lg sm:text-xl font-bold text-[#0F3C6E] mt-1">
                Programación Orientada a Objetos
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">

                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">
                    Grupo
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    IS-02
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">
                    Aula
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    Laboratorio 2
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">
                    Fecha
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {today}
                  </p>
                </div>

              </div>
            </div>

            <span className="self-start text-xs font-semibold bg-[#EAF2FB] text-[#0F3C6E] px-3 py-2 rounded-md">
              08:00 - 09:30
            </span>
          </div>
        </section>

        {/* ASISTENCIA DEL DOCENTE */}
        <section className="bg-white border border-[#E2E8F0] rounded-lg p-4 sm:p-5 mb-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h3 className="font-bold text-slate-800">
                Asistencia del docente titular
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Confirmá si el docente asignado impartió esta sesión.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() => {
                  setTeacherAttended(true);
                  setSubstituteConfirmed(false);
                  setSubstituteReason('');
                  setSubstituteTeacher('');
                  setSaved(false);
                }}
                className={`flex-1 sm:flex-none px-4 py-3 rounded-md text-sm font-semibold border ${
                  teacherAttended
                    ? 'bg-[#15803D] text-white border-[#15803D]'
                    : 'bg-white text-slate-500 border-[#E2E8F0]'
                }`}
              >
                ✓ Asistió
              </button>

              <button
                type="button"
                onClick={() => {
                  setTeacherAttended(false);
                  setSaved(false);
                  setShowSubstituteModal(true);
                }}
                className={`flex-1 sm:flex-none px-4 py-3 rounded-md text-sm font-semibold border ${
                  !teacherAttended
                    ? 'bg-[#C81E2B] text-white border-[#C81E2B]'
                    : 'bg-white text-slate-500 border-[#E2E8F0]'
                }`}
              >
                ✕ No asistió
              </button>

            </div>
          </div>

          {!teacherAttended && (
            <div className="mt-4 p-3 rounded-md bg-[#FEF3C7] border border-[#FDE68A]">
              <p className="text-sm font-semibold text-[#92400E]">
                Docente titular ausente
              </p>

              <p className="text-xs text-[#92400E] mt-1">
                {substituteConfirmed
                  ? `Motivo: ${substituteReason}. ${
                      substituteTeacher
                        ? `Sustituto: ${substituteTeacher}`
                        : 'Sin docente sustituto registrado.'
                    }`
                  : 'Pendiente de registrar el motivo y los datos de sustitución.'}
              </p>

              <button
                type="button"
                onClick={() => setShowSubstituteModal(true)}
                className="mt-2 text-xs font-bold text-[#0F3C6E] underline"
              >
                Editar información
              </button>
            </div>
          )}
        </section>

        {/* CONTADORES */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">

          <div className="bg-white border border-[#BBF7D0] rounded-lg p-4">
            <p className="text-xs font-semibold text-[#15803D]">
              Presentes
            </p>
            <p className="text-3xl font-bold text-[#15803D] mt-1">
              {presentCount}
            </p>
          </div>

          <div className="bg-white border border-[#FECACA] rounded-lg p-4">
            <p className="text-xs font-semibold text-[#C81E2B]">
              Ausentes
            </p>
            <p className="text-3xl font-bold text-[#C81E2B] mt-1">
              {absentCount}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white border border-[#E2E8F0] rounded-lg p-4">
            <p className="text-xs font-semibold text-slate-500">
              Total matriculados
            </p>
            <p className="text-3xl font-bold text-[#0F3C6E] mt-1">
              {students.length}
            </p>
          </div>

        </section>

        {/* LISTADO DE ESTUDIANTES */}
        <section className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">

          <div className="p-4 sm:p-5 border-b border-[#E2E8F0]">

            <div className="flex flex-col gap-3">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0F3C6E]">
                    Nómina de estudiantes
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Marcá el estado de asistencia de cada estudiante.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={markAllPresent}
                  className="px-4 py-2.5 rounded-md bg-[#EAF2FB] border border-[#C7D9ED] text-[#0F3C6E] text-xs font-bold hover:bg-[#DCEBFA]"
                >
                  ✓ Marcar todos como presentes
                </button>
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o carnet..."
                className="w-full border border-[#E2E8F0] rounded-md px-3 py-3 text-sm outline-none focus:border-[#1D63B8]"
              />

            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0]">

            {filteredStudents.length === 0 ? (
              <div className="text-center py-10 text-sm text-slate-500">
                No se encontraron estudiantes.
              </div>
            ) : (
              filteredStudents.map((student, index) => (
                <div
                  key={student.id}
                  className="p-4 min-h-[76px] flex flex-col gap-3"
                >

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-9 h-9 rounded-full bg-[#EAF2FB] text-[#0F3C6E] flex items-center justify-center text-xs font-bold shrink-0">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">
                          {student.nombre}
                        </p>

                        <p className="text-xs text-slate-500">
                          {student.carnet}
                        </p>
                      </div>

                    </div>

                    {/* CONTROL DE ASISTENCIA */}
                    <div className="grid grid-cols-2 gap-2 sm:w-[230px] shrink-0">

                      <button
                        type="button"
                        onClick={() =>
                          updateAttendance(student.id, 'Presente')
                        }
                        className={`min-h-[48px] rounded-md text-xs sm:text-sm font-bold border transition-colors ${
                          student.asistio === 'Presente'
                            ? 'bg-[#15803D] text-white border-[#15803D]'
                            : 'bg-white text-[#15803D] border-[#BBF7D0] hover:bg-[#F0FDF4]'
                        }`}
                      >
                        ✓ Presente
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateAttendance(student.id, 'Ausente')
                        }
                        className={`min-h-[48px] rounded-md text-xs sm:text-sm font-bold border transition-colors ${
                          student.asistio === 'Ausente'
                            ? 'bg-[#C81E2B] text-white border-[#C81E2B]'
                            : 'bg-white text-[#C81E2B] border-[#FECACA] hover:bg-[#FEF2F2]'
                        }`}
                      >
                        ✕ Ausente
                      </button>

                    </div>
                  </div>

                  {/* MOTIVO DE AUSENCIA */}
                  {student.asistio === 'Ausente' && (
                    <div className="ml-0 sm:ml-12 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-md">

                      <label className="block text-xs font-semibold text-[#991B1B] mb-2">
                        Motivo de ausencia *
                      </label>

                      <select
                        value={student.motivo}
                        onChange={(e) =>
                          updateReason(student.id, e.target.value)
                        }
                        className="w-full border border-[#FECACA] bg-white rounded-md px-3 py-3 text-sm outline-none focus:border-[#C81E2B]"
                      >
                        <option value="">Seleccionar motivo...</option>

                        {motivosAusencia.map((motivo) => (
                          <option key={motivo} value={motivo}>
                            {motivo}
                          </option>
                        ))}
                      </select>

                    </div>
                  )}

                </div>
              ))
            )}

          </div>
        </section>

        {/* MENSAJE DE ÉXITO */}
        {showSuccess && (
          <div className="mt-5 bg-[#DCFCE7] border border-[#BBF7D0] rounded-lg p-4">
            <p className="text-sm font-bold text-[#166534]">
              ✓ Registro de asistencia completado correctamente.
            </p>

            <p className="text-xs text-[#166534] mt-1">
              Presentes: {presentCount} · Ausentes: {absentCount}
            </p>
          </div>
        )}

      </main>

      {/* FOOTER FIJO */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] px-4 py-3 sm:px-6">

        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-700">
              {presentCount} presentes · {absentCount} ausentes
            </p>
            <p className="text-xs text-slate-400">
              {students.length} estudiantes en total
            </p>
          </div>

          <button
            type="button"
            onClick={saveAttendance}
            disabled={saved}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-md text-sm font-bold transition-colors ${
              saved
                ? 'bg-[#15803D] text-white cursor-default'
                : 'bg-[#0F3C6E] hover:bg-[#1D63B8] text-white cursor-pointer'
            }`}
          >
            {saved ? '✓ Asistencia registrada' : 'Guardar Registro de Asistencia'}
          </button>

        </div>
      </footer>

      {/* MODAL B - AUSENCIA DOCENTE / SUSTITUCIÓN */}
      {showSubstituteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-md rounded-lg border border-[#E2E8F0] p-5 sm:p-6">

            <div className="flex items-start justify-between mb-5">

              <div>
                <p className="text-xs uppercase font-semibold text-[#1D63B8]">
                  Modal B
                </p>

                <h3 className="text-lg font-bold text-[#0F3C6E] mt-1">
                  Ausencia del docente
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Registro de ausencia o sustitución.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSubstituteModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl"
                aria-label="Cerrar modal"
              >
                ×
              </button>

            </div>

            <div className="space-y-4">

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Motivo de ausencia del docente *
                </label>

                <select
                  value={substituteReason}
                  onChange={(e) => setSubstituteReason(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-md px-3 py-3 text-sm outline-none focus:border-[#1D63B8]"
                >
                  <option value="">Seleccionar motivo...</option>
                  <option value="Enfermedad">Enfermedad</option>
                  <option value="Permiso autorizado">Permiso autorizado</option>
                  <option value="Emergencia familiar">Emergencia familiar</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Docente sustituto (opcional)
                </label>

                <select
                  value={substituteTeacher}
                  onChange={(e) => setSubstituteTeacher(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-md px-3 py-3 text-sm outline-none focus:border-[#1D63B8]"
                >
                  <option value="">Sin docente sustituto</option>
                  <option value="María López">María López</option>
                  <option value="Carlos Martínez">Carlos Martínez</option>
                  <option value="Roberto Sánchez">Roberto Sánchez</option>
                </select>
              </div>

            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">

              <button
                type="button"
                onClick={() => setShowSubstituteModal(false)}
                className="px-4 py-3 rounded-md border border-[#E2E8F0] text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmSubstitute}
                className="px-4 py-3 rounded-md bg-[#0F3C6E] text-white text-sm font-semibold hover:bg-[#1D63B8]"
              >
                Confirmar información
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
