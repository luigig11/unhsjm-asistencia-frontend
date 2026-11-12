import React, { useState } from 'react';
import { CloseIcon } from '../common/Icons';

interface ModalAsignarMateriaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { materia: string; codigoMateria: string; docente: string; cupo_limite: number }) => void;
  defaultCapacity?: number;
}

export const ModalAsignarMateria: React.FC<ModalAsignarMateriaProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultCapacity = 35,
}) => {
  const [materia, setMateria] = useState('');
  const [codigoMateria, setCodigoMateria] = useState('');
  const [docente, setDocente] = useState('');
  const [cupo, setCupo] = useState(String(defaultCapacity));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materia.trim() || !codigoMateria.trim()) return;
    onSave({
      materia: materia.trim(),
      codigoMateria: codigoMateria.trim(),
      docente: docente.trim(),
      cupo_limite: Number(cupo) || defaultCapacity,
    });
    setMateria('');
    setCodigoMateria('');
    setDocente('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-sm w-full text-left shadow-none overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A]">Asignar Asignatura y Docente</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">
              Código de la Asignatura <span className="text-[#C81E2B]">*</span>
            </label>
            <input
              type="text"
              value={codigoMateria}
              onChange={(e) => setCodigoMateria(e.target.value)}
              placeholder="Ej. PROG-101"
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">
              Nombre de la Asignatura <span className="text-[#C81E2B]">*</span>
            </label>
            <input
              type="text"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              placeholder="Ej. Fundamentos de Programación"
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">
              Docente Titular Asignado
            </label>
            <input
              type="text"
              value={docente}
              onChange={(e) => setDocente(e.target.value)}
              placeholder="Nombre del docente (opcional)"
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">
              Cupo de la Asignatura
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={cupo}
              onChange={(e) => setCupo(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
            />
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-md text-[#475569] font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#0F3C6E] hover:bg-[#0A294D] text-white rounded-md font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Asignar Materia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
