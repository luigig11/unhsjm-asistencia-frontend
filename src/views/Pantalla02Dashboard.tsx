import React, { useState } from 'react';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { DashboardKPIs } from '../components/dashboard/DashboardKPIs';
import { TodaySessionsTable } from '../components/dashboard/TodaySessionsTable';
import { UpcomingEventsPanel } from '../components/dashboard/UpcomingEventsPanel';

interface Pantalla02DashboardProps {
  onNavigate?: (screenKey: string) => void;
}

export const Pantalla02Dashboard: React.FC<Pantalla02DashboardProps> = ({
  onNavigate,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [sessionFilter, setSessionFilter] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDirection, setSelectedDirection] = useState<string>('');

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex">
      {/* Sidebar Fijo de Navegación (260px / colapsable 64px) */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onNavigate={onNavigate}
      />

      {/* Área Principal de Contenido */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Institucional */}
        <header className="h-16 bg-[#FFFFFF] border-b border-slate-200 px-6 flex items-center justify-between gap-4">
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

        {/* Estructura Oficial .md: Fila de 4 KPIs + Sección Central en 2 Columnas */}
        <main className="flex-1 p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* 1. Fila superior de 4 tarjetas KPI planas */}
          <DashboardKPIs />

          {/* 2. Sección central dividida en dos columnas */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Columna 1: Sesiones en Curso / Hoy (con estado de asistencia del docente) */}
            <TodaySessionsTable
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sessionFilter={sessionFilter}
              onFilterChange={setSessionFilter}
            />

            {/* Columna 2: Próximos Eventos / Feriados del Período */}
            <UpcomingEventsPanel />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Pantalla02Dashboard;
