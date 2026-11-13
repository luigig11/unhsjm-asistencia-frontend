import React from 'react';
import { SearchIcon, PlusIcon } from '../common/Icons';
import { Button } from '../common/Button';
import type { CatalogTabConfig } from './CatalogNav';
import type { CatalogItem } from './StandardCatalogModal';

interface CatalogContentViewProps {
  currentTab: CatalogTabConfig;
  items?: CatalogItem[];
  loading?: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenCreateModal: () => void;
  onEditItem?: (item: CatalogItem) => void;
}

export const CatalogContentView: React.FC<CatalogContentViewProps> = ({
  currentTab,
  items = [],
  loading = false,
  searchTerm,
  onSearchChange,
  onOpenCreateModal,
  onEditItem,
}) => {
  return (
    <div className="flex-1 bg-[#FFFFFF] border border-slate-200 rounded-lg overflow-hidden text-left flex flex-col justify-between shadow-sm">
      <div>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFFFF]">
          <div>
            <h2 className="text-base font-bold text-[#0F3C6E]">
              {currentTab.name}
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Administración de registros para la configuración académica
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-full sm:w-60">
              <span className="inset-y-0 left-0 pl-3 flex items-center pointer-events-none absolute text-[#94A3B8]">
                <SearchIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={`Buscar en ${currentTab.name}...`}
                className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] border border-slate-200 rounded-md focus:outline-none focus:border-[#1D63B8]"
              />
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<PlusIcon className="w-3.5 h-3.5" />}
              onClick={onOpenCreateModal}
              className="shrink-0"
            >
              Nuevo Registro
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
                <th className="py-2.5 px-4">Código</th>
                <th className="py-2.5 px-4">Nombre Oficial</th>
                {currentTab.extraHeader1 && (
                  <th className="py-2.5 px-4">{currentTab.extraHeader1}</th>
                )}
                {currentTab.extraHeader2 && (
                  <th className="py-2.5 px-4">{currentTab.extraHeader2}</th>
                )}
                <th className="py-2.5 px-4">Estado</th>
                <th className="py-2.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {loading ? (
                <tr>
                  <td
                    colSpan={3 + (currentTab.extraHeader1 ? 1 : 0) + (currentTab.extraHeader2 ? 1 : 0) + 1}
                    className="py-16 px-6 text-center text-xs text-[#475569]"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#1D63B8] border-t-transparent rounded-full animate-spin" />
                      <span>Cargando catálogo...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={3 + (currentTab.extraHeader1 ? 1 : 0) + (currentTab.extraHeader2 ? 1 : 0) + 1}
                    className="py-16 px-6 text-center text-xs text-[#94A3B8]"
                  >
                    <div className="max-w-sm mx-auto space-y-1">
                      <p className="font-semibold text-[#475569] text-sm">
                        No hay registros en {currentTab.name}
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        Utiliza el botón "Nuevo Registro" para dar de alta elementos en este catálogo institucional.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-[#0F3C6E]">
                      {item.codigo}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#0F172A] text-xs">
                      {item.nombre}
                    </td>
                    {currentTab.extraHeader1 && (
                      <td className="py-3 px-4 text-xs text-[#475569]">
                        {item.extraCol1 || '—'}
                      </td>
                    )}
                    {currentTab.extraHeader2 && (
                      <td className="py-3 px-4 text-xs text-[#475569]">
                        {item.extraCol2 || '—'}
                      </td>
                    )}
                    <td className="py-3 px-4">
                      {item.activo ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onEditItem?.(item)}
                        className="text-[#0F3C6E] hover:text-[#1D63B8]"
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-3 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between text-xs text-[#475569]">
        <span>Total: {items.length} elementos</span>
        <span className="font-mono text-[11px] text-[#94A3B8]">UNHSJM · Catálogos</span>
      </div>
    </div>
  );
};
