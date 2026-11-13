import React from 'react';
import { SearchIcon, PlusIcon } from '../common/Icons';
import { Button } from '../common/Button';

export interface OpcionRol {
  id: string;
  code: string;
  nombre: string;
}

export interface OpcionDireccion {
  id: string;
  codigo: string;
  nombre: string;
}

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedDirection: string;
  onDirectionChange: (direction: string) => void;
  roles?: OpcionRol[];
  direcciones?: OpcionDireccion[];
  onOpenCreateDrawer: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedDirection,
  onDirectionChange,
  roles = [],
  direcciones = [],
  onOpenCreateDrawer,
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-left shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
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

        <div className="w-full sm:w-44">
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium bg-[#F8FAFC] text-[#0F172A] border border-slate-200 rounded-md focus:outline-none focus:border-[#1D63B8] cursor-pointer"
          >
            <option value="">Todos los roles</option>
            {roles.length > 0 ? (
              roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))
            ) : (
              <>
                <option value="ADMIN">Administrador</option>
                <option value="DIRECTOR">Director de Área</option>
                <option value="DOCENTE">Docente</option>
              </>
            )}
          </select>
        </div>

        <div className="w-full sm:w-56">
          <select
            value={selectedDirection}
            onChange={(e) => onDirectionChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium bg-[#F8FAFC] text-[#0F172A] border border-slate-200 rounded-md focus:outline-none focus:border-[#1D63B8] cursor-pointer"
          >
            <option value="">Todas las direcciones</option>
            {direcciones.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        variant="primary"
        size="md"
        icon={<PlusIcon className="w-4 h-4" />}
        onClick={onOpenCreateDrawer}
        className="shrink-0"
      >
        Nuevo Usuario
      </Button>
    </div>
  );
};
