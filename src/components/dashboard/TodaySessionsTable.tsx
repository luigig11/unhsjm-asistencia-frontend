import React from 'react';
import type { SesionHoyDashboard, EstadoActaSesion } from '../../api/dashboard';
import { SearchIcon } from '../common/Icons';

interface TodaySessionsTableProps {
  sesiones?: SesionHoyDashboard[];
  loading?: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sessionFilter: string;
  onFilterChange: (filter: string) => void;
}

const renderEstadoBadge = (estado: EstadoActaSesion) => {
  switch (estado) {
    case 'PRESENTE':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Presente
        </span>
      );
    case 'PENDIENTE':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pendiente
        </span>
      );
    case 'AUSENTE':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Ausente
        </span>
      );
    case 'SUSTITUTO':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Sustituto
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#475569] border border-slate-200">
          {estado}
        </span>
      );
  }
};

const formatHora = (iso: string): string => {
  if (!iso) return '--:--';
  const d = new Date(iso);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  const parts = iso.split('T');
  return parts[1] ? parts[1].substring(0, 5) : iso;
};

export const TodaySessionsTable: React.FC<TodaySessionsTableProps> = ({
  sesiones = [],
  loading = false,
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

  const filteredSesiones = sesiones.filter((s) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      s.materia_nombre.toLowerCase().includes(term) ||
      s.grupo_codigo.toLowerCase().includes(term) ||
      s.docente_nombre.toLowerCase().includes(term) ||
      s.aula_codigo.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (sessionFilter === 'TODAS') return true;
    if (sessionFilter === 'REGISTRADA') {
      return s.estado_acta === 'PRESENTE' || s.estado_acta === 'SUSTITUTO';
    }
    if (sessionFilter === 'SUSTITUCION') {
      return s.estado_acta === 'SUSTITUTO' || s.estado_acta === 'AUSENTE';
    }
    if (sessionFilter === 'PENDIENTE' || sessionFilter === 'EN_CURSO') {
      return s.estado_acta === 'PENDIENTE';
    }
    return true;
  });

  return (
    <div className="lg:col-span-8 bg-[#FFFFFF] border border-slate-200 rounded-lg overflow-hidden text-left shadow-sm">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0F3C6E]">
            Sesiones en Curso / Hoy
          </h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Seguimiento diario de clases programadas y estado de asistencia del docente
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <SearchIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar asignatura, grupo o docente..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-slate-200 rounded-md text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1D63B8]"
          />
        </div>
      </div>

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
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 px-6 text-center text-xs text-[#475569]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#1D63B8] border-t-transparent rounded-full animate-spin" />
                    <span>Cargando sesiones del día...</span>
                  </div>
                </td>
              </tr>
            ) : filteredSesiones.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-14 px-6 text-center text-xs text-[#94A3B8]">
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
            ) : (
              filteredSesiones.map((sesion) => (
                <tr key={sesion.id_calendario} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-medium text-[#0F172A] text-xs">
                      {formatHora(sesion.fecha_inicio)} - {formatHora(sesion.fecha_fin)}
                    </div>
                    <div className="text-[11px] text-[#475569] font-medium flex items-center gap-1 mt-0.5">
                      <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">
                        Aula: {sesion.aula_codigo}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#0F172A] text-xs">
                      {sesion.materia_nombre}
                    </div>
                    <div className="text-[11px] text-[#475569] flex items-center gap-1 mt-0.5">
                      <span className="px-1.5 py-0.5 bg-[#EBF3FC] text-[#0F3C6E] border border-[#93C5FD] rounded font-mono text-[10px] font-semibold">
                        {sesion.grupo_codigo}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-xs text-[#0F172A] font-medium">
                      {sesion.docente_nombre}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {renderEstadoBadge(sesion.estado_acta)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[11px] font-mono font-medium text-[#475569]">
                      {sesion.estado_acta === 'PENDIENTE' ? 'En espera' : 'Registrada'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
