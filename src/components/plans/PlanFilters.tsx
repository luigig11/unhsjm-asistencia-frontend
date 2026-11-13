import React from 'react';
import { SearchIcon, ChevronDownIcon } from '../common/Icons';
import { Button } from '../common/Button';
import type { CarreraDto, ModalidadDto, DireccionDto } from '../../api/catalogos';

export interface PlanFiltersState {
  searchQuery: string;
  selectedDireccion: string;
  selectedCarrera: string;
  selectedModalidad: string;
  selectedEstado: 'TODOS' | 'ACTIVOS' | 'INACTIVOS';
}

interface PlanFiltersProps {
  filters: PlanFiltersState;
  onChange: (newFilters: PlanFiltersState) => void;
  onNewPlan?: () => void;
  totalPlans: number;
  direcciones?: DireccionDto[];
  carreras?: CarreraDto[];
  modalidades?: ModalidadDto[];
}

export const PlanFilters: React.FC<PlanFiltersProps> = ({
  filters,
  onChange,
  onNewPlan,
  totalPlans,
  direcciones = [],
  carreras = [],
  modalidades = [],
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) =>
              onChange({ ...filters, searchQuery: e.target.value })
            }
            placeholder="Buscar por código (ej. ISI-2026) o carrera..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-md text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#1D63B8] focus:border-[#1D63B8] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<span className="text-sm leading-none">+</span>}
            onClick={onNewPlan}
          >
            Nuevo Plan Académico
          </Button>
        </div>
      </div>

      <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="relative">
          <select
            value={filters.selectedDireccion}
            onChange={(e) =>
              onChange({ ...filters, selectedDireccion: e.target.value })
            }
            className="w-full appearance-none pl-3 pr-8 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D63B8] focus:border-[#1D63B8] cursor-pointer"
          >
            <option value="TODAS">Todas las Direcciones</option>
            {direcciones.length > 0 ? (
              direcciones.map((d) => (
                <option key={d.id} value={d.nombre}>
                  {d.nombre}
                </option>
              ))
            ) : (
              <>
                <option value="Tecnología e Informática">Tecnología e Informática</option>
                <option value="Ciencias Económicas">Ciencias Económicas</option>
                <option value="Ciencias Médicas">Ciencias Médicas</option>
              </>
            )}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#475569]">
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="relative">
          <select
            value={filters.selectedCarrera}
            onChange={(e) =>
              onChange({ ...filters, selectedCarrera: e.target.value })
            }
            className="w-full appearance-none pl-3 pr-8 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D63B8] focus:border-[#1D63B8] cursor-pointer"
          >
            <option value="TODAS">Todas las Carreras</option>
            {carreras.length > 0 ? (
              carreras.map((c) => (
                <option key={c.id} value={c.nombre}>
                  {c.nombre}
                </option>
              ))
            ) : (
              <>
                <option value="Ingeniería en Sistemas de Información">Ingeniería en Sistemas de Información</option>
                <option value="Licenciatura en Administración">Licenciatura en Administración</option>
                <option value="Medicina General">Medicina General</option>
              </>
            )}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#475569]">
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="relative">
          <select
            value={filters.selectedModalidad}
            onChange={(e) =>
              onChange({ ...filters, selectedModalidad: e.target.value })
            }
            className="w-full appearance-none pl-3 pr-8 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D63B8] focus:border-[#1D63B8] cursor-pointer"
          >
            <option value="TODAS">Todas las Modalidades</option>
            {modalidades.length > 0 ? (
              modalidades.map((m) => (
                <option key={m.id} value={m.nombre}>
                  {m.nombre}
                </option>
              ))
            ) : (
              <>
                <option value="Regular / Diurna">Regular / Diurna</option>
                <option value="Sabatina">Sabatina</option>
                <option value="Dominical">Dominical</option>
              </>
            )}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#475569]">
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="relative">
          <select
            value={filters.selectedEstado}
            onChange={(e) =>
              onChange({
                ...filters,
                selectedEstado: e.target.value as 'TODOS' | 'ACTIVOS' | 'INACTIVOS',
              })
            }
            className="w-full appearance-none pl-3 pr-8 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D63B8] focus:border-[#1D63B8] cursor-pointer"
          >
            <option value="TODOS">Estado: Todos ({totalPlans})</option>
            <option value="ACTIVOS">Solo Vigentes / Activos</option>
            <option value="INACTIVOS">Inactivos / Históricos</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#475569]">
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
