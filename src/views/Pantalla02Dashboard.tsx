import React, { useState } from 'react';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { DashboardKPIs } from '../components/dashboard/DashboardKPIs';
import { QuickActions } from '../components/dashboard/QuickActions';
import { TodaySessionsTable } from '../components/dashboard/TodaySessionsTable';

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
      {/* Sidebar Modular */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onNavigate={onNavigate}
      />

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Cabecera Superior */}
        <header className="h-16 bg-[#FFFFFF] border-b border-slate-200 px-6 flex items-center justify-between gap-4">
          <div className="text-left">
            <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-tight">
              Panel de Control Académico
            </h1>
            <p className="text-xs text-[#475569] mt-0.5">
              Resumen operativo del período escolar, grupos ofertados y control de asistencia
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

        {/* Cuerpo del Dashboard */}
        <main className="flex-1 p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* 1. Tarjetas KPI */}
          <DashboardKPIs />

          {/* 2. Accesos Rápidos */}
          <QuickActions onNavigate={onNavigate} />

          {/* 3. Sección Central: Sesiones y Panel Lateral */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Tabla de Sesiones de Hoy */}
            <TodaySessionsTable
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sessionFilter={sessionFilter}
              onFilterChange={setSessionFilter}
            />

            {/* Panel Lateral: Eventos y Resumen de Catálogos */}
            <div className="lg:col-span-4 space-y-6 text-left">
              <div className="bg-[#FFFFFF] border border-slate-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-[#0F3C6E]">
                      Próximos Eventos / Feriados del Período
                    </h2>
                    <p className="text-xs text-[#475569] mt-0.5">
                      Fechas no lectivas y actividades del calendario escolar
                    </p>
                  </div>
                </div>

                <div className="p-8 text-center">
                  <p className="text-sm font-semibold text-[#475569]">
                    Sin eventos próximos registrados
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Los feriados nacionales, vacaciones y actividades extracurriculares del período activo se mostrarán en esta sección.
                  </p>
                </div>
              </div>

              {/* Resumen de Catálogos Activos */}
              <div className="bg-[#FFFFFF] border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-[#0F3C6E] uppercase tracking-wider mb-3">
                  Resumen de Catálogos Activos
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-[#475569]">Direcciones Académicas</span>
                    <span className="font-mono font-semibold text-[#0F172A]">0</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-[#475569]">Carreras Registradas</span>
                    <span className="font-mono font-semibold text-[#0F172A]">0</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-[#475569]">Planes de Estudio Vigentes</span>
                    <span className="font-mono font-semibold text-[#0F172A]">0</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-[#475569]">Docentes Activos</span>
                    <span className="font-mono font-semibold text-[#0F172A]">0</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Pantalla02Dashboard;
