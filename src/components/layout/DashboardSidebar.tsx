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
  activeScreen?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onNavigate,
  activeScreen = 'P02',
}) => {
  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-[#0F3C6E] text-white border-r border-[#0A294D] flex flex-col justify-between shrink-0 transition-all duration-150`}
    >
      <div>
        {/* Cabecera del Sidebar con Logo Oficial y Botón de Toggle */}
        <div className="h-16 px-3 flex items-center justify-between border-b border-[#0A294D]">
          {!collapsed ? (
            /* Vista expandida: Logo + Texto institucional */
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-md bg-white border border-white/20 p-1 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/Logos/Logo_Color_Sin_Letras.png"
                  alt="UNHSJM"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="truncate text-left">
                <p className="text-sm font-bold tracking-tight leading-none text-white">
                  UNHSJM
                </p>
                <p className="text-[11px] text-[#EBF3FC]/80 mt-0.5 truncate">
                  Gestión Académica
                </p>
              </div>
            </div>
          ) : (
            /* Vista colapsada: Logo interactivo que expande al hacer clic */
            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-9 h-9 rounded-md bg-white border border-white/20 p-1 flex items-center justify-center shrink-0 mx-auto hover:ring-2 hover:ring-[#1D63B8] transition-all cursor-pointer"
              title="Clic para expandir menú lateral"
            >
              <img
                src="/Logos/Logo_Color_Sin_Letras.png"
                alt="UNHSJM"
                className="w-full h-full object-contain"
              />
            </button>
          )}

          {/* Botón de hamburguesa visible cuando está expandido */}
          {!collapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-md text-[#EBF3FC] hover:bg-[#0A294D] border border-transparent hover:border-[#1D63B8] transition-colors cursor-pointer"
              title="Colapsar menú lateral"
              aria-label="Colapsar menú"
            >
              <MenuIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Menú Principal de Navegación */}
        <nav className="p-2.5 space-y-1 text-left">
          {!collapsed && (
            <p className="px-2.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#EBF3FC]/60">
              Administración
            </p>
          )}

          {/* Enlace al Dashboard (Pantalla 02) */}
          <button
            type="button"
            onClick={() => onNavigate?.('P02')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
              activeScreen === 'P02'
                ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Panel Principal' : undefined}
          >
            <GridIcon className="w-4 h-4 shrink-0 text-[#EBF3FC]" />
            {!collapsed && <span className="truncate">Panel Principal</span>}
          </button>

          {/* Enlace a Usuarios y Docentes (Pantalla 03) */}
          <button
            type="button"
            onClick={() => onNavigate?.('P03')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
              activeScreen === 'P03'
                ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Usuarios y Docentes' : undefined}
          >
            <UsersIcon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Usuarios y Docentes</span>}
          </button>

          {/* Enlace a Catálogos (Pantalla 04) */}
          <button
            type="button"
            onClick={() => onNavigate?.('P04')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
              activeScreen === 'P04'
                ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Catálogos Institucionales' : undefined}
          >
            <DatabaseIcon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Catálogos Institucionales</span>}
          </button>

          {!collapsed && (
            <p className="px-2.5 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#EBF3FC]/60">
              Diseño Curricular
            </p>
          )}

          {/* Enlace a Planes Académicos (Pantalla 05) */}
          <button
            type="button"
            onClick={() => onNavigate?.('P05')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
              activeScreen === 'P05'
                ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Planes Académicos' : undefined}
          >
            <DocumentTextIcon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Planes Académicos</span>}
          </button>

          {/* Enlace a Malla Curricular (Pantalla 06) */}
          <button
            type="button"
            onClick={() => onNavigate?.('P06')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
              activeScreen === 'P06'
                ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Malla Curricular' : undefined}
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
            {/* Botón cerrar sesión */}
            <button
              type="button"
              onClick={() => onNavigate?.('P01')}
              className="px-2.5 py-1 rounded text-[11px] font-medium bg-[#0A294D] hover:bg-[#C81E2B] text-white border border-[#1D63B8] hover:border-[#C81E2B] transition-colors cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate?.('P01')}
            className="w-full py-1.5 rounded text-xs font-mono bg-[#0A294D] hover:bg-[#C81E2B] text-white cursor-pointer"
            title="Cerrar sesión"
          >
            ←
          </button>
        )}
      </div>
    </aside>
  );
};
