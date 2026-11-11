
import { useMemo, useState } from 'react';

type SessionStatus = 'Pendiente' | 'Registrada';

type Session = {
  id: number;
  materia: string;
  codigo: string;
  grupo: string;
  aula: string;
  horaInicio: string;
  horaFin: string;
  estado: SessionStatus;
};

interface Pantalla11PortalDocenteProps {
  onNavigateToAttendance?: (sessionId: number) => void;
}

const initialSessions: Session[] = [
  {
    id: 1,
    materia: 'Programación Orientada a Objetos',
    codigo: 'IS-204',
    grupo: 'IS-02',
    aula: 'Laboratorio 2',
    horaInicio: '08:00',
    horaFin: '09:30',
    estado: 'Pendiente',
  },
  {
    id: 2,
    materia: 'Base de Datos II',
    codigo: 'IS-305',
    grupo: 'IS-01',
    aula: 'Aula 4',
    horaInicio: '10:00',
    horaFin: '11:30',
    estado: 'Pendiente',
  },
  {
    id: 3,
    materia: 'Redes de Computadoras',
    codigo: 'IS-401',
    grupo: 'IS-03',
    aula: 'Laboratorio 1',
    horaInicio: '13:00',
    horaFin: '14:30',
    estado: 'Registrada',
  },
];

export const Pantalla11PortalDocente = ({
  onNavigateToAttendance,
}: Pantalla11PortalDocenteProps) => {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [search, setSearch] = useState('');

  const today = new Date();

  const formattedDate = new Intl.DateTimeFormat('es-NI', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(today);

  const pendingCount = sessions.filter(
    (session) => session.estado === 'Pendiente'
  ).length;

  const registeredCount = sessions.filter(
    (session) => session.estado === 'Registrada'
  ).length;

  const filteredSessions = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return sessions;

    return sessions.filter((session) =>
      [
        session.materia,
        session.codigo,
        session.grupo,
        session.aula,
      ].some((value) => value.toLowerCase().includes(term))
    );
  }, [sessions, search]);

  const handleAttendance = (session: Session) => {
    if (onNavigateToAttendance) {
      onNavigateToAttendance(session.id);
      return;
    }

    setSelectedSession(session);
  };

  const handleMarkRegistered = () => {
    if (!selectedSession) return;

    setSessions((previous) =>
      previous.map((session) =>
        session.id === selectedSession.id
          ? { ...session, estado: 'Registrada' }
          : session
      )
    );

    setSelectedSession(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <main className="w-full max-w-[1400px] mx-auto px-4 py-6 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-7">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1D63B8] mb-2">
              Gestión académica / Portal docente
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F3C6E]">
              Mi agenda académica
            </h1>

            <p className="text-sm text-slate-500 mt-1 capitalize">
              {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-lg px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF2FB] flex items-center justify-center text-[#0F3C6E] font-bold">
              DOC
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Docente activo
              </p>
              <p className="text-xs text-slate-500">
                Portal del docente
              </p>
            </div>
          </div>
        </div>

        {/* Resumen de sesiones */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 font-medium">
                Sesiones de hoy
              </p>
              <span className="text-xl text-[#1D63B8]">▦</span>
            </div>

            <p className="text-3xl font-bold text-[#0F3C6E] mt-2">
              {sessions.length}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Clases programadas
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 font-medium">
                Pendientes
              </p>
              <span className="text-xl text-[#D97706]">◷</span>
            </div>

            <p className="text-3xl font-bold text-[#D97706] mt-2">
              {pendingCount}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Requieren pasar asistencia
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 font-medium">
                Registradas
              </p>
              <span className="text-xl text-[#15803D]">✓</span>
            </div>

            <p className="text-3xl font-bold text-[#15803D] mt-2">
              {registeredCount}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Asistencias completadas
            </p>
          </div>
        </div>

        {/* Sesiones del día */}
        <section className="bg-white border border-[#E2E8F0] rounded-lg">

          <div className="p-5 border-b border-[#E2E8F0]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0F3C6E]">
                  Mis sesiones de hoy
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Consulta tus clases y registra la asistencia de cada grupo.
                </p>
              </div>

              <div className="w-full sm:w-72">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar materia, grupo o aula..."
                  className="w-full border border-[#E2E8F0] rounded-md px-3 py-2 text-sm outline-none focus:border-[#1D63B8]"
                />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4">

            {filteredSessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3 text-slate-300">▦</div>
                <p className="font-semibold text-slate-600">
                  No se encontraron sesiones
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Probá con otro nombre de materia, grupo o aula.
                </p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <article
                  key={session.id}
                  className="border border-[#E2E8F0] rounded-lg p-4 sm:p-5 hover:border-[#B8CCE2] transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* Información de la materia */}
                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-semibold bg-[#EAF2FB] text-[#0F3C6E] px-2.5 py-1 rounded">
                          {session.codigo}
                        </span>

                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
                          Grupo {session.grupo}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-800">
                        {session.materia}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="text-[#1D63B8]">◷</span>
                          <div>
                            <p className="text-[10px] uppercase text-slate-400 font-semibold">
                              Horario
                            </p>
                            <p className="font-medium">
                              {session.horaInicio} - {session.horaFin}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="text-[#1D63B8]">⌖</span>
                          <div>
                            <p className="text-[10px] uppercase text-slate-400 font-semibold">
                              Aula
                            </p>
                            <p className="font-medium">
                              {session.aula}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Estado y acción */}
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 lg:min-w-[210px]">

                      <div className="flex justify-center">
                        {session.estado === 'Pendiente' ? (
                          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#92400E] bg-[#FEF3C7] px-3 py-2 rounded-md">
                            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                            Pendiente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-3 py-2 rounded-md">
                            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                            Registrada
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAttendance(session)}
                        disabled={session.estado === 'Registrada'}
                        className={`w-full sm:w-auto lg:w-full xl:w-auto px-5 py-3 rounded-md text-sm font-semibold transition-colors ${
                          session.estado === 'Registrada'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-[#0F3C6E] hover:bg-[#1D63B8] text-white cursor-pointer'
                        }`}
                      >
                        {session.estado === 'Registrada'
                          ? 'Asistencia completada'
                          : 'Pasar Asistencia'}
                      </button>

                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Nota informativa */}
        <div className="mt-5 bg-[#EAF2FB] border border-[#C7D9ED] rounded-lg p-4 flex gap-3">
          <span className="text-[#1D63B8] font-bold">i</span>
          <p className="text-xs text-[#0F3C6E] leading-relaxed">
            Revisá el horario y el aula asignada antes de iniciar cada sesión.
            Una vez registrada la asistencia, la sesión aparecerá como completada.
          </p>
        </div>

      </main>

      {/* Vista temporal mientras se integra P12 */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg border border-[#E2E8F0] p-6">

            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase font-semibold text-[#1D63B8]">
                  Registro de asistencia
                </p>
                <h3 className="text-lg font-bold text-[#0F3C6E] mt-1">
                  {selectedSession.materia}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="text-slate-400 hover:text-slate-700 text-xl"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-50 rounded-md p-4 space-y-2 text-sm mb-5">
              <p>
                <strong>Grupo:</strong> {selectedSession.grupo}
              </p>
              <p>
                <strong>Aula:</strong> {selectedSession.aula}
              </p>
              <p>
                <strong>Horario:</strong> {selectedSession.horaInicio} - {selectedSession.horaFin}
              </p>
            </div>

            <p className="text-sm text-slate-600 mb-5">
              Esta sesión está lista para iniciar el pase de lista. La pantalla
              P12 se conectará en el siguiente módulo.
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 rounded-md border border-[#E2E8F0] text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleMarkRegistered}
                className="px-4 py-2 rounded-md bg-[#0F3C6E] text-white text-sm font-semibold hover:bg-[#1D63B8]"
              >
                Simular registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
