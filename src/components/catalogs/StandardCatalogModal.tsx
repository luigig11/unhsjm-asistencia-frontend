import React, { useState, useEffect } from 'react';
import { Button, Input } from '../common';

export interface CatalogItem {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
  extraCol1?: string;
  extraCol2?: string;
  raw?: unknown;
}

interface StandardCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogTitle: string;
  itemToEdit?: CatalogItem | null;
  onSave?: (item: Partial<CatalogItem>) => Promise<void>;
  loading?: boolean;
}

export const StandardCatalogModal: React.FC<StandardCatalogModalProps> = ({
  isOpen,
  onClose,
  catalogTitle,
  itemToEdit,
  onSave,
  loading = false,
}) => {
  const [codigo, setCodigo] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [activo, setActivo] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setCodigo(itemToEdit.codigo || '');
        setNombre(itemToEdit.nombre || '');
        setActivo(itemToEdit.activo ?? true);
      } else {
        setCodigo('');
        setNombre('');
        setActivo(true);
      }
    }
  }, [isOpen, itemToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSave) {
      await onSave({
        id: itemToEdit?.id,
        codigo,
        nombre,
        activo,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-slate-200 rounded-lg shadow-lg overflow-hidden text-left">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1D63B8]">
              Catálogo Base
            </span>
            <h3 className="text-lg font-bold text-[#0F172A] mt-0.5">
              {itemToEdit ? `Editar ${catalogTitle}` : `Nuevo Registro · ${catalogTitle}`}
            </h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Cerrar modal"
          >
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            id="catalog-codigo"
            label="Código Único"
            required
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="ej. ING-SIS o LAB-01"
            className="font-mono bg-white"
          />

          <Input
            id="catalog-nombre"
            label="Nombre Oficial"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Descripción oficial del elemento"
            className="bg-white"
          />

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

          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={loading}
            >
              Guardar Registro
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
