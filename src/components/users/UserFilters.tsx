import React from 'react';
import { SearchIcon, PlusIcon } from '../common/Icons';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedDirection: string;
  onDirectionChange: (direction: string) => void;
  onOpenCreateDrawer: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedDirection,
  onDirectionChange,
  onOpenCreateDrawer,
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-left">
      {/* Controles de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
        {/* Input de búsqueda por cédula o nombre */}
        <div className="relative flex-1 max-w-md">
          <span className="inset-y-0 left-0 pl-3 flex items-center pointer-events-none absolute text-[#94A3B8]">
            <SearchIcon className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por cédula o nombre..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] border border-slate-200 rounded-md focus:outline-none focus:border-[#1D63B8]"
          />
        </div>

        {/* Filtro por Rol */}
        <div className="w-full sm:w-44">
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium bg-[#F8FAFC] text-[#0F172A] border border-slate-200 rounded-md focus:outline-none focus:border-[#1D63B8]"
          >
            <option value="">Todos los roles</option>
            <option value="ADMIN">Administrador</option>
            <option value="DIRECTOR">Director de Área</option>
            <option value="DOCENTE">Docente</option>
          </select>
        </div>

        {/* Filtro por Dirección */}
        <div className="w-full sm:w-56">
          <select
            value={selectedDirection}
            onChange={(e) => onDirectionChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium bg-[#F8FAFC] text-[#0F172A] border border-slate-200 rounded-md focus:outline-none focus:border-[#1D63B8]"
          >
            <option value="">Todas las direcciones</option>
            <option value="DCByT">Ciencias Básicas y Tecnología</option>
            <option value="DCEE">Ciencias Económicas y Empresariales</option>
            <option value="DCH">Ciencias y Humanidades</option>
          </select>
        </div>
      </div>

      {/* Botón para abrir el Slide-over Drawer de nuevo usuario */}
      <button
        type="button"
        onClick={onOpenCreateDrawer}
        className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-[#0F3C6E] hover:bg-[#0A294D] border border-[#0F3C6E] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
      >
        <PlusIcon className="w-4 h-4" />
        <span>Nuevo Usuario</span>
      </button>
    </div>
  );
};
