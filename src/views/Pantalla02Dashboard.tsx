import React, { useState } from 'react';
import { DashboardKPIs } from '../components/dashboard/DashboardKPIs';
import { TodaySessionsTable } from '../components/dashboard/TodaySessionsTable';
import { UpcomingEventsPanel } from '../components/dashboard/UpcomingEventsPanel';

export const Pantalla02Dashboard: React.FC = () => {
  const [sessionFilter, setSessionFilter] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDirection, setSelectedDirection] = useState<string>('');

  return (
    <>
      {/* Cabecera Superior del Dashboard */}
      <header className="h-16 bg-[#FFFFFF] border-b border-slate-200 px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="text-left">
          <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-tight">
            Dashboard Operativo
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Control de asistencia docente, sesiones de clase y eventos del período
          </p>
        </div>

        {/* Selector de Dirección Académica */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <label
              htmlFor="filter-direccion"
              className="text-xs font-medium text-[#475569]"
            >
              Dirección Académica:
            </label>
            <select
              id="filter-direccion"
              value={selectedDirection}
              onChange={(e) => setSelectedDirection(e.target.value)}
              className="text-xs font-medium bg-[#F8FAFC] text-[#0F172A] border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-[#1D63B8]"
            >
              <option value="">Todas las direcciones</option>
            </select>
          </div>
        </div>
      </header>

      {/* Contenido Principal: Fila de 4 KPIs + 2 Columnas Centrales */}
      <main className="flex-1 p-6 space-y-6 max-w-[1600px] w-full mx-auto overflow-y-auto">
        {/* 1. Fila de 4 tarjetas KPI */}
        <DashboardKPIs />

        {/* 2. Sección central en 2 columnas */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna 1: Sesiones en Curso / Hoy */}
          <TodaySessionsTable
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sessionFilter={sessionFilter}
            onFilterChange={setSessionFilter}
          />

          {/* Columna 2: Próximos Eventos / Feriados */}
          <UpcomingEventsPanel />
        </section>
      </main>
    </>
  );
};

export default Pantalla02Dashboard;
