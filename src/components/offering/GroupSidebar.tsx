import React from 'react';
import { SearchIcon } from '../common/Icons';

export interface AcademicGroup {
  id: string;
  codigo: string;
  nombre: string;
  cupo: number;
  instanciaId: string;
}

interface GroupSidebarProps {
  groups: AcademicGroup[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
  searchTerm: string;
  onSearchChange: (query: string) => void;
  getSubjectCount: (groupId: string) => number;
}

export const GroupSidebar: React.FC<GroupSidebarProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  searchTerm,
  onSearchChange,
  getSubjectCount,
}) => {
  return (
    <section className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white text-left">
      <div className="border-b border-[#E2E8F0] p-4 space-y-3">
        <div>
          <h2 className="text-sm font-bold text-[#0F172A]">
            Grupos y Secciones
          </h2>
          <p className="mt-0.5 text-xs text-[#64748B]">
            Selecciona un grupo para consultar su carga de asignaturas.
          </p>
        </div>

        {/* Buscador de grupos */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#94A3B8]">
            <SearchIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por código o carrera..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1D63B8]"
          />
        </div>
      </div>

      {/* Lista de grupos */}
      <div className="divide-y divide-[#E2E8F0] max-h-[460px] overflow-y-auto">
        {groups.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#94A3B8]">
            No hay grupos abiertos en esta instancia.
          </div>
        ) : (
          groups.map((group) => {
            const isSelected = group.id === selectedGroupId;
            const count = getSubjectCount(group.id);

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelectGroup(group.id)}
                className={`w-full p-3.5 text-left transition-colors cursor-pointer block ${
                  isSelected
                    ? 'bg-[#EBF3FC]/60 border-l-4 border-l-[#1D63B8]'
                    : 'hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs font-bold text-[#0F3C6E]">
                    {group.codigo}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-semibold text-[#1D63B8] bg-white px-1.5 py-0.2 rounded border border-[#1D63B8]/30">
                      Activo
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-[#0F172A] mt-1 truncate">
                  {group.nombre}
                </p>

                <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748B]">
                  <span>Cupo: {group.cupo}</span>
                  <span>{count} asignaturas</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
};
