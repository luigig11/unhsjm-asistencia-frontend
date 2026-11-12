import React from 'react';
import { PlusIcon } from '../common/Icons';

export interface SchoolPeriod {
  id: string;
  nombre_periodo_escolar: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

interface PeriodHeaderProps {
  periods: SchoolPeriod[];
  selectedPeriodId: string;
  selectedPeriod: SchoolPeriod;
  onSelectPeriod: (periodId: string) => void;
  onOpenEventModal: () => void;
  totalEvents: number;
}

const formatDate = (value: string) => {
  if (!value) return '—';
  return new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString('es-NI', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const PeriodHeader: React.FC<PeriodHeaderProps> = ({
  periods,
  selectedPeriodId,
  selectedPeriod,
  onSelectPeriod,
  onOpenEventModal,
  totalEvents,
}) => {
  return (
    <div className="space-y-4">
      <header className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Período Escolar y Feriados
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Configuración del año lectivo institucional y calendario de días no lectivos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <label className="flex flex-col gap-1 min-w-[240px]">
            <span className="text-xs font-semibold text-[#475569]">Año Lectivo / Período</span>
            <select
              value={selectedPeriodId}
              onChange={(e) => onSelectPeriod(e.target.value)}
              className="h-9 rounded-md border border-[#CBD5E1] bg-white px-3 text-xs text-[#0F172A] outline-none focus:border-[#1D63B8] focus:ring-1 focus:ring-[#1D63B8] cursor-pointer"
            >
              {periods.length === 0 ? (
                <option value="sin-periodo">Sin períodos registrados</option>
              ) : (
                periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.nombre_periodo_escolar}
                  </option>
                ))
              )}
            </select>
          </label>

          <button
            type="button"
            onClick={onOpenEventModal}
            className="h-9 px-3.5 rounded-md bg-[#0F3C6E] hover:bg-[#0A294D] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Registrar Evento</span>
          </button>
        </div>
      </header>

      {/* Tarjetas KPI de Rango de Período */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 text-left">
          <p className="text-xs font-medium text-[#64748B]">Inicio del período</p>
          <p className="text-base font-bold text-[#0F172A] mt-0.5">
            {formatDate(selectedPeriod.fecha_inicio)}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 text-left">
          <p className="text-xs font-medium text-[#64748B]">Fin del período</p>
          <p className="text-base font-bold text-[#0F172A] mt-0.5">
            {formatDate(selectedPeriod.fecha_fin)}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 text-left">
          <p className="text-xs font-medium text-[#64748B]">Días no lectivos / Feriados</p>
          <p className="text-base font-bold text-[#0F3C6E] mt-0.5">
            {totalEvents} <span className="text-xs font-normal text-[#64748B]">registrados</span>
          </p>
        </div>
      </section>
    </div>
  );
};
