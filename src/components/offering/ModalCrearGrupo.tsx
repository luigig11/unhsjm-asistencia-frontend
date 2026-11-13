import React, { useState } from 'react';
import { CloseIcon } from '../common/Icons';
import { Button } from '../common/Button';

interface ModalCrearGrupoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupData: { codigo: string; nombre: string; cupo: number }) => Promise<void> | void;
  isSaving?: boolean;
}

export const ModalCrearGrupo: React.FC<ModalCrearGrupoProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [cupo, setCupo] = useState('35');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim() || !nombre.trim() || Number(cupo) <= 0) return;
    setError(null);
    try {
      await onSave({
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        cupo: Number(cupo),
      });
      setCodigo('');
      setNombre('');
      setCupo('35');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar el grupo');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-sm w-full text-left shadow-none overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A]">Abrir Grupo / Sección</h3>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            icon={<CloseIcon className="w-4 h-4" />}
            onClick={onClose}
            disabled={isSaving}
            className="text-[#94A3B8] hover:text-[#0F172A]"
          />
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">
              Código de Sección <span className="text-[#C81E2B]">*</span>
            </label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej. ISI-01"
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">
              Nombre descriptivo <span className="text-[#C81E2B]">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Ingeniería en Sistemas - Turno Mañana"
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">
              Cupo Límite de Estudiantes <span className="text-[#C81E2B]">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={cupo}
              onChange={(e) => setCupo(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
              required
            />
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
            >
              Guardar Grupo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
