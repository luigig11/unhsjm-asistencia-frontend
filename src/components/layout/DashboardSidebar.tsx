import React from 'react';
import {
  GridIcon,
  UsersIcon,
  DatabaseIcon,
  DocumentTextIcon,
  KanbanIcon,
  MenuIcon,
} from '../common/Icons';
import { useAuth } from '../../context/AuthContext';

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
  activeScreen = 'dashboard',
}) => {
  const { user, logout } = useAuth();

  const rol = user?.rolCode || 'ADMIN';
  const isDocente = rol === 'DOCENTE';
  const isDirector = rol === 'DIRECTOR';
  const isAdmin = rol === 'ADMIN';

  const handleLogout = async () => {
    await logout();
    onNavigate?.('login');
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-[#0F3C6E] text-white border-r border-[#0A294D] flex flex-col justify-between shrink-0 transition-all duration-150 print:hidden`}
    >
      <div>
        <div className="h-16 px-3 flex items-center justify-between border-b border-[#0A294D]">
          {!collapsed ? (
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

        <nav className="p-2.5 space-y-1 text-left">
          {!collapsed && (
            <p className="px-2.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#EBF3FC]/60">
              Principal
            </p>
          )}

          <button
            type="button"
            onClick={() => onNavigate?.('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
              activeScreen === 'dashboard'
                ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Panel Principal' : undefined}
          >
            <GridIcon className="w-4 h-4 shrink-0 text-[#EBF3FC]" />
            {!collapsed && <span className="truncate">Panel Principal</span>}
          </button>

          {(isAdmin || isDirector) && (
            <>
              {!collapsed && (
                <p className="px-2.5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#EBF3FC]/60">
                  Administración
                </p>
              )}

              <button
                type="button"
                onClick={() => onNavigate?.('users')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  activeScreen === 'users'
                    ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                    : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? 'Usuarios y Docentes' : undefined}
              >
                <UsersIcon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">Usuarios y Docentes</span>}
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => onNavigate?.('catalogs')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                    activeScreen === 'catalogs'
                      ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                      : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? 'Catálogos Institucionales' : undefined}
                >
                  <DatabaseIcon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <span className="truncate">Catálogos Institucionales</span>
                  )}
                </button>
              )}

              {!collapsed && (
                <p className="px-2.5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#EBF3FC]/60">
                  Diseño Curricular
                </p>
              )}

              <button
                type="button"
                onClick={() => onNavigate?.('academic-plans')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  activeScreen === 'academic-plans'
                    ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                    : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? 'Planes Académicos' : undefined}
              >
                <DocumentTextIcon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">Planes Académicos</span>}
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('curriculum-design')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  activeScreen === 'curriculum-design'
                    ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                    : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? 'Malla Curricular' : undefined}
              >
                <KanbanIcon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">Malla Curricular</span>}
              </button>

              {!collapsed && (
                <p className="px-2.5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#EBF3FC]/60">
                  Oferta y Planificación
                </p>
              )}

              <button
                type="button"
                onClick={() => onNavigate?.('academic-period')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  activeScreen === 'academic-period'
                    ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                    : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? 'Período Escolar y Feriados' : undefined}
              >
                <DocumentTextIcon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <span className="truncate">Período Escolar y Feriados</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('academic-offering')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  activeScreen === 'academic-offering'
                    ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                    : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? 'Oferta Académica' : undefined}
              >
                <DocumentTextIcon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">Oferta Académica</span>}
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => onNavigate?.('schedule-planner')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                    activeScreen === 'schedule-planner'
                      ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                      : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? 'Programador de Horarios' : undefined}
                >
                  <KanbanIcon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <span className="truncate">Programador de Horarios</span>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => onNavigate?.('student-enrollment')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  activeScreen === 'student-enrollment'
                    ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                    : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? 'Matrícula de Estudiantes' : undefined}
              >
                <UsersIcon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <span className="truncate">Matrícula de Estudiantes</span>
                )}
              </button>
            </>
          )}

          {!collapsed && (
            <p className="px-2.5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#EBF3FC]/60">
              Control Docente y Asistencia
            </p>
          )}

          <button
            type="button"
            onClick={() => onNavigate?.('teacher-portal')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
              activeScreen === 'teacher-portal'
                ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Portal del Docente' : undefined}
          >
            <UsersIcon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Portal del Docente</span>}
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('attendance-record')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
              activeScreen === 'attendance-record'
                ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Acta de Pase de Lista' : undefined}
          >
            <DocumentTextIcon className="w-4 h-4 shrink-0" />
            {!collapsed && (
              <span className="truncate">Acta de Pase de Lista</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('attendance-sheet')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
              activeScreen === 'attendance-sheet'
                ? 'bg-[#0A294D] text-white border-[#1D63B8]'
                : 'text-[#EBF3FC]/90 hover:bg-[#0A294D] hover:text-white border-transparent'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Sábana Consolidada de Asistencia' : undefined}
          >
            <DocumentTextIcon className="w-4 h-4 shrink-0" />
            {!collapsed && (
              <span className="truncate">Sábana Consolidada</span>
            )}
          </button>
        </nav>
      </div>

      <div className="p-3 border-t border-[#0A294D]">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="text-left truncate">
              <p className="text-xs font-semibold text-white truncate">
                {user ? `${user.nombre} ${user.apellido}` : 'Usuario Activo'}
              </p>
              <p className="text-[10px] uppercase font-bold text-[#93C5FD] tracking-wide">
                {isDocente ? 'Docente' : isDirector ? 'Director' : 'Administrador'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="px-2 py-1 text-[11px] font-semibold text-rose-200 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 rounded transition-colors cursor-pointer"
            >
              Salir
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-1 text-[10px] font-bold text-rose-200 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 rounded"
            title="Cerrar sesión"
          >
            Salir
          </button>
        )}
      </div>
    </aside>
  );
};
