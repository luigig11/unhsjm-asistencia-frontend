import React from 'react';
import {
  GridIcon,
  UsersIcon,
  DatabaseIcon,
  DocumentTextIcon,
  KanbanIcon,
  MenuIcon,
} from '../common/Icons';

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: (screenKey: string) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onNavigate,
}) => {
  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-[#0F3C6E] text-white border-r border-[#0A294D] flex flex-col justify-between shrink-0 transition-all duration-150`}
    >
      <div>
        {/* Cabecera del Sidebar */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#0A294D]">
          {!collapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-md bg-[#1D63B8] border border-white/20 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                UN
              </div>
              <div className="truncate text-left">
                <p className="text-sm font-bold tracking-tight leading-none">
                  UNHSJM
                </p>
                <p className="text-[11px] text-[#EBF3FC]/80 mt-0.5 truncate">
                  Gestión Académica
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md text-[#EBF3FC] hover:bg-[#0A294D] border border-transparent hover:border-[#1D63B8] transition-colors mx-auto sm:mx-0"
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            <MenuIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Menú Principal de Navegación */}
        <nav className="p-2.5 space-y-1 text-left">
          {!collapsed && (
            <p className="px-2.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#EBF3FC]/60">
              Administración
            </p>
          )}

          <button
            type="button"
            onClick={() => onNavigate?.('P02')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold bg-[#0A294D] text-white border border-[#1D63B8]"
          >
            <GridIcon className="w-4 h-4 shrink-0 text-[#EBF3FC]" />
            {!collapsed && <span className="truncate">Panel Principal</span>}
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('P03')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white transition-colors"
          >
            <UsersIcon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Usuarios y Docentes</span>}
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('P04')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white transition-colors"
          >
            <DatabaseIcon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Catálogos Institucionales</span>}
          </button>

          {!collapsed && (
            <p className="px-2.5 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#EBF3FC]/60">
              Diseño Curricular
            </p>
          )}

          <button
            type="button"
            onClick={() => onNavigate?.('P05')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white transition-colors"
          >
            <DocumentTextIcon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Planes Académicos</span>}
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('P06')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white transition-colors"
          >
            <KanbanIcon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Malla Curricular</span>}
          </button>
        </nav>
      </div>

      {/* Pie del Sidebar: Sesión de Usuario */}
      <div className="p-3 border-t border-[#0A294D]">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="text-left truncate">
              <p className="text-xs font-semibold text-white truncate">
                Usuario Activo
              </p>
              <p className="text-[11px] text-[#EBF3FC]/80">
                Sesión iniciada
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.('P01')}
              className="px-2.5 py-1 rounded text-[11px] font-medium bg-[#0A294D] hover:bg-[#C81E2B] text-white border border-[#1D63B8] hover:border-[#C81E2B] transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate?.('P01')}
            className="w-full py-1.5 rounded text-xs font-mono bg-[#0A294D] hover:bg-[#C81E2B] text-white"
            title="Cerrar sesión"
          >
            ←
          </button>
        )}
      </div>
    </aside>
  );
};
