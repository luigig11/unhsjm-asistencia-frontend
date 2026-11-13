import React, { useState, useEffect, useCallback } from 'react';
import { DashboardKPIs } from '../components/dashboard/DashboardKPIs';
import { TodaySessionsTable } from '../components/dashboard/TodaySessionsTable';
import { UpcomingEventsPanel } from '../components/dashboard/UpcomingEventsPanel';
import { obtenerResumenDashboard } from '../api/dashboard';
import type { DashboardResumen } from '../api/dashboard';
import { listarDirecciones } from '../api/catalogos';
import type { DireccionDto } from '../api/catalogos';
import { AlertCircleIcon } from '../components/common/Icons';
import { Button } from '../components/common/Button';

export const Dashboard: React.FC = () => {
  const [sessionFilter, setSessionFilter] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDirection, setSelectedDirection] = useState<string>('');
  const [resumen, setResumen] = useState<DashboardResumen | null>(null);
  const [direcciones, setDirecciones] = useState<DireccionDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resumenData, direccionesData] = await Promise.allSettled([
        obtenerResumenDashboard(),
        listarDirecciones({ activo: true }),
      ]);

      if (resumenData.status === 'fulfilled') {
        setResumen(resumenData.value);
      } else {
        const errorMsg =
          resumenData.reason instanceof Error
            ? resumenData.reason.message
            : 'Error al conectar con el servicio de dashboard.';
        setError(errorMsg);
      }

      if (direccionesData.status === 'fulfilled') {
        setDirecciones(direccionesData.value || []);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const actasRegistradasHoy =
    resumen?.sesiones_hoy?.filter((s) => s.estado_acta !== 'PENDIENTE').length ?? 0;

  return (
    <>
      <header className="h-16 bg-[#FFFFFF] border-b border-slate-200 px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="text-left">
          <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-tight">
            Dashboard Operativo
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Control de asistencia docente, sesiones de clase y eventos del período
          </p>
        </div>

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
              {direcciones.map((dir) => (
                <option key={dir.id} value={dir.id}>
                  {dir.nombre}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={cargarDatos}
            isLoading={loading}
          >
            Actualizar
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 max-w-[1600px] w-full mx-auto overflow-y-auto">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5 text-rose-800 text-xs font-medium">
              <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              variant="secondary"
              size="xs"
              onClick={cargarDatos}
              className="text-rose-700 border-rose-300 hover:bg-rose-100"
            >
              Reintentar
            </Button>
          </div>
        )}

        <DashboardKPIs
          periodoNombre={resumen?.periodo_escolar_activo?.nombre}
          totalGrupos={resumen?.total_grupos_ofertados ?? 0}
          totalSesionesHoy={resumen?.total_sesiones_hoy ?? 0}
          actasRegistradasHoy={actasRegistradasHoy}
          alertasAusenciaDocenteHoy={resumen?.alertas_ausencia_docente_hoy ?? 0}
          loading={loading}
        />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <TodaySessionsTable
            sesiones={resumen?.sesiones_hoy ?? []}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sessionFilter={sessionFilter}
            onFilterChange={setSessionFilter}
          />

          <UpcomingEventsPanel
            eventos={resumen?.proximos_eventos ?? []}
            loading={loading}
          />
        </section>
      </main>
    </>
  );
};

export default Dashboard;
