import React from 'react';

interface TodaySessionsTableProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sessionFilter: string;
  onFilterChange: (filter: string) => void;
}

export const TodaySessionsTable: React.FC<TodaySessionsTableProps> = ({
  searchTerm,
  onSearchChange,
  sessionFilter,
  onFilterChange,
}) => {
  const filterTabs = [
    { key: 'TODAS', label: 'Todas' },
    { key: 'EN_CURSO', label: 'En curso' },
    { key: 'REGISTRADA', label: 'Registradas' },
    { key: 'SUSTITUCION', label: 'Sustitución / Ausencia' },
    { key: 'PENDIENTE', label: 'Pendientes' },
  ];

  return (
    <div className="lg:col-span-8 bg-[#FFFFFF] border border-slate-200 rounded-lg overflow-hidden text-left">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0F3C6E]">
            Sesiones en Curso / Hoy
          </h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Seguimiento diario de clases programadas y estado de asistencia del docente
          </p>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar asignatura, grupo o docente..."
            className="w-full px-3 py-1.5 text-xs bg-[#F8FAFC] border border-slate-200 rounded-md text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1D63B8]"
          />
        </div>
      </div>

      {/* Filtros de Estado */}
      <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-slate-200 flex flex-wrap items-center gap-1.5">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onFilterChange(tab.key)}
            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              sessionFilter === tab.key
                ? 'bg-[#0F3C6E] text-white border-[#0F3C6E]'
                : 'bg-[#FFFFFF] text-[#475569] border-slate-200 hover:text-[#0F172A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabla de Sesiones (Estado Limpio) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
              <th className="py-2.5 px-4">Horario / Aula</th>
              <th className="py-2.5 px-4">Asignatura y Grupo</th>
              <th className="py-2.5 px-4">Docente</th>
              <th className="py-2.5 px-4">Asistencia</th>
              <th className="py-2.5 px-4 text-right">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={5}
                className="py-14 px-6 text-center text-xs text-[#94A3B8]"
              >
                <div className="max-w-sm mx-auto space-y-1">
                  <p className="font-semibold text-[#475569] text-sm">
                    No hay sesiones registradas para el día de hoy
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    Las sesiones programadas en el calendario aparecerán listadas en esta tabla junto con el estado de asistencia del docente titular.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
