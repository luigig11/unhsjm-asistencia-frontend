import React, { useState } from 'react';

export interface CatalogItem {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
  extraCol1?: string;
  extraCol2?: string;
}

interface StandardCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogTitle: string;
  itemToEdit?: CatalogItem | null;
  onSave?: (item: Partial<CatalogItem>) => void;
}

export const StandardCatalogModal: React.FC<StandardCatalogModalProps> = ({
  isOpen,
  onClose,
  catalogTitle,
  itemToEdit,
  onSave,
}) => {
  const [codigo, setCodigo] = useState<string>(itemToEdit?.codigo || '');
  const [nombre, setNombre] = useState<string>(itemToEdit?.nombre || '');
  const [activo, setActivo] = useState<boolean>(itemToEdit?.activo ?? true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave?.({
      codigo,
      nombre,
      activo,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-slate-200 rounded-lg shadow-sm overflow-hidden text-left">
        {/* Cabecera del modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1D63B8]">
              Catálogo Base
            </span>
            <h3 className="text-lg font-bold text-[#0F172A] mt-0.5">
              {itemToEdit ? `Editar ${catalogTitle}` : `Nuevo Registro · ${catalogTitle}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {/* Código */}
          <div>
            <label
              htmlFor="catalog-codigo"
              className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5"
            >
              Código Único
            </label>
            <input
              id="catalog-codigo"
              type="text"
              required
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="ej. ING-SIS o LAB-01"
              className="w-full px-3.5 py-2 text-xs font-mono bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
            />
          </div>

          {/* Nombre descriptivo */}
          <div>
            <label
              htmlFor="catalog-nombre"
              className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5"
            >
              Nombre Oficial
            </label>
            <input
              id="catalog-nombre"
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Descripción oficial del elemento"
              className="w-full px-3.5 py-2 text-xs bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
            />
          </div>

          {/* Estado Activo */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-medium text-[#475569]">
              Registro Activo
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0F3C6E]"></div>
            </label>
          </div>

          {/* Botones de acción */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-xs font-semibold text-[#0F172A] bg-[#FFFFFF] border border-slate-200 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-[#0F3C6E] hover:bg-[#0A294D] border border-[#0F3C6E] transition-colors cursor-pointer"
            >
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
