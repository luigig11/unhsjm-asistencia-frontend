import React, { useState } from 'react';
import { CloseIcon, ChevronDownIcon } from '../common/Icons';
import type { PlanAcademicoItem } from './PlanCard';

interface ModalPlanAcademicoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPlan: PlanAcademicoItem) => void;
}

export const ModalPlanAcademico: React.FC<ModalPlanAcademicoProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [carrera, setCarrera] = useState('');
  const [direccion, setDireccion] = useState('');
  const [modalidad, setModalidad] = useState('Regular / Diurna');
  const [tipoPeriodo, setTipoPeriodo] = useState('Trimestre');
  const [cantidadCiclos, setCantidadCiclos] = useState<number>(5);
  const [cantidadPeriodos, setCantidadPeriodos] = useState<number>(15);
  const [activoDesde, setActivoDesde] = useState('');
  const [activoHasta, setActivoHasta] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim() || !carrera.trim()) return;

    const newPlan: PlanAcademicoItem = {
      id: `plan-${Date.now()}`,
      codigo: codigo.trim(),
      nombre: nombre.trim() || `Plan Curricular ${codigo.trim()}`,
      carrera: carrera.trim(),
      direccion: direccion.trim() || 'Dirección Académica',
      modalidad,
      tipo_periodo: tipoPeriodo,
      cantidad_ciclo_academico: Number(cantidadCiclos) || 5,
      cantidad_periodo_academico: Number(cantidadPeriodos) || 15,
      activo_desde: activoDesde || '2026-01-01',
      activo_hasta: activoHasta || '2030-12-31',
      activo: true,
      total_asignaturas: 0,
    };

    onSave(newPlan);
    setCodigo('');
    setNombre('');
    setCarrera('');
    setDireccion('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-lg w-full text-left shadow-none overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              Nuevo Plan Académico
            </h3>
            <p className="text-xs text-[#475569] mt-0.5">
              Registra un nuevo programa curricular en la institución
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Código del Plan <span className="text-[#C81E2B]">*</span>
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej. ISI-2026"
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Modalidad <span className="text-[#C81E2B]">*</span>
              </label>
              <div className="relative">
                <select
                  value={modalidad}
                  onChange={(e) => setModalidad(e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
                >
                  <option value="Regular / Diurna">Regular / Diurna</option>
                  <option value="Sabatina">Sabatina</option>
                  <option value="Dominical">Dominical</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#475569]">
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">
              Carrera <span className="text-[#C81E2B]">*</span>
            </label>
            <input
              type="text"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              placeholder="Ej. Ingeniería en Sistemas de Información"
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">
              Dirección Académica
            </label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej. Tecnología e Informática"
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Tipo Período
              </label>
              <div className="relative">
                <select
                  value={tipoPeriodo}
                  onChange={(e) => setTipoPeriodo(e.target.value)}
                  className="w-full appearance-none px-2.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
                >
                  <option value="Trimestre">Trimestre</option>
                  <option value="Semestre">Semestre</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center pointer-events-none text-[#475569]">
                  <ChevronDownIcon className="w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Ciclos (Años)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={cantidadCiclos}
                onChange={(e) => setCantidadCiclos(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Bloques Totales
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={cantidadPeriodos}
                onChange={(e) => setCantidadPeriodos(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Vigencia Desde
              </label>
              <input
                type="date"
                value={activoDesde}
                onChange={(e) => setActivoDesde(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Vigencia Hasta
              </label>
              <input
                type="date"
                value={activoHasta}
                onChange={(e) => setActivoHasta(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8]"
              />
            </div>
          </div>

          {/* Botones de acción */}
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
              className="px-4 py-1.5 bg-[#0F3C6E] hover:bg-[#0A294D] text-white rounded-md font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Crear Plan Académico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
