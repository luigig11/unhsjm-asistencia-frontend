import React from 'react';
import { DownloadIcon, PrinterIcon, SearchIcon, ChevronDownIcon, ArrowLeftIcon } from '../common/Icons';

export interface OpcionCursoSabana {
  id: string;
  nombre: string;
  grupo: string;
}

interface AttendanceSheetHeaderProps {
  cursos?: OpcionCursoSabana[];
  selectedCursoId?: string;
  onCursoChange?: (val: string) => void;
  period: string;
  onPeriodChange: (val: string) => void;
  group: string;
  onGroupChange: (val: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onBack?: () => void;
}

export const AttendanceSheetHeader: React.FC<AttendanceSheetHeaderProps> = ({
  cursos = [],
  selectedCursoId = '',
  onCursoChange,
  period,
  onPeriodChange,
  group,
  onGroupChange,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onExportExcel,
  onExportPDF,
  onBack,
}) => {
  return (
    <div className="space-y-4 text-left">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-2.5 py-1 text-xs font-semibold text-[#475569] bg-white border border-[#CBD5E1] rounded hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>
            )}
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D63B8]">
              Gestión Académica / Control de Asistencia
            </p>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Sábana Consolidada de Asistencia
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Control acumulado de asistencia por estudiante y encuentro académico
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          <button
            type="button"
            onClick={onExportExcel}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-white border border-[#E2E8F0] text-xs font-semibold text-[#15803D] hover:bg-[#F0FDF4] transition-colors cursor-pointer"
          >
            <DownloadIcon className="w-4 h-4 text-[#15803D]" />
            Exportar Excel (.csv)
          </button>

          <button
            type="button"
            onClick={onExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#0F3C6E] text-xs font-semibold text-white hover:bg-[#1D63B8] transition-colors cursor-pointer"
          >
            <PrinterIcon className="w-4 h-4" />
            Exportar Acta PDF
          </button>
        </div>
      </div>

      <section className="bg-white border border-[#E2E8F0] rounded-lg p-4 print:hidden shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <div>
            <label htmlFor="select-curso-sabana" className="block text-xs font-semibold text-[#475569] mb-1.5">
              Asignatura / Curso Ofertado
            </label>
            <div className="relative">
              <select
                id="select-curso-sabana"
                value={selectedCursoId}
                onChange={(e) => onCursoChange && onCursoChange(e.target.value)}
                className="w-full appearance-none border border-[#E2E8F0] rounded-md px-3 py-2 text-xs bg-white text-[#0F172A] outline-none focus:border-[#1D63B8] pr-8 cursor-pointer"
              >
                {cursos.length > 0 ? (
                  cursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.grupo})
                    </option>
                  ))
                ) : (
                  <option value="">Cargando cursos...</option>
                )}
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="select-periodo-sabana" className="block text-xs font-semibold text-[#475569] mb-1.5">
              Período Escolar
            </label>
            <div className="relative">
              <select
                id="select-periodo-sabana"
                value={period}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="w-full appearance-none border border-[#E2E8F0] rounded-md px-3 py-2 text-xs bg-white text-[#0F172A] outline-none focus:border-[#1D63B8] pr-8"
              >
                <option value="Año Lectivo 2026">Año Lectivo 2026</option>
                <option value="Año Lectivo 2025">Año Lectivo 2025</option>
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5">
              Buscar Estudiante
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Nombre o código único..."
                className="w-full border border-[#E2E8F0] rounded-md pl-8 pr-3 py-2 text-xs outline-none focus:border-[#1D63B8] text-[#0F172A] placeholder-[#94A3B8]"
              />
              <SearchIcon className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label htmlFor="select-filtro-estado" className="block text-xs font-semibold text-[#475569] mb-1.5">
              Estado de Asistencia
            </label>
            <div className="relative">
              <select
                id="select-filtro-estado"
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="w-full appearance-none border border-[#E2E8F0] rounded-md px-3 py-2 text-xs bg-white text-[#0F172A] outline-none focus:border-[#1D63B8] pr-8"
              >
                <option value="Todos">Todos los estudiantes</option>
                <option value="Excelente">Excelente (90% o más)</option>
                <option value="Advertencia">Advertencia (75% - 89%)</option>
                <option value="Riesgo">Riesgo (menos de 75%)</option>
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
