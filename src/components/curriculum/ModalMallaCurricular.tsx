import React, { useState, useEffect } from 'react';
import { CloseIcon, ChevronDownIcon } from '../common/Icons';
import type { SubjectMalla } from './SubjectCard';

// Catálogo oficial de asignaturas de Ingeniería en Sistemas de Información (UNHSJM)
const MATERIAS_CATALOGO = [
  { id: 'mat-ing-tec', codigo: 'ING-101', nombre: 'Inglés Técnico' },
  { id: 'mat-fts', codigo: 'FTS-101', nombre: 'Fundamentos de Tecnología y Sistemas' },
  { id: 'mat-mat-intro', codigo: 'MAT-100', nombre: 'Matemática Introductoria' },
  { id: 'mat-tec-com', codigo: 'COM-101', nombre: 'Técnicas y Estrategias de Comunicación' },
  { id: 'mat-filo', codigo: 'HUM-101', nombre: 'Filosofía' },
  { id: 'mat-hist-nic', codigo: 'HUM-102', nombre: 'Historia de Nicaragua' },
  { id: 'mat-fund-prog', codigo: 'PROG-101', nombre: 'Fundamentos de Programación' },
  { id: 'mat-intro-elec', codigo: 'ELC-101', nombre: 'Introducción a la Electrónica' },
  { id: 'mat-calc-1', codigo: 'MAT-101', nombre: 'Cálculo I' },
  { id: 'mat-comp-red', codigo: 'COM-102', nombre: 'Composición y Redacción Técnica' },
  { id: 'mat-cur-int', codigo: 'CLI-101', nombre: 'Curso Libre de Integración' },
  { id: 'mat-cur-hum-1', codigo: 'CLH-101', nombre: 'Curso Libre General y Humanístico I' },
];

interface ModalMallaCurricularProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<SubjectMalla>) => void;
  initialData?: SubjectMalla | null;
  bloqueNombre?: string;
}

export const ModalMallaCurricular: React.FC<ModalMallaCurricularProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  bloqueNombre = 'Período',
}) => {
  const [selectedMateriaId, setSelectedMateriaId] = useState<string>('');
  const [creditos, setCreditos] = useState<number>(4);
  const [horas, setHoras] = useState<number>(60);
  const [encuentrosTotales, setEncuentrosTotales] = useState<number>(12);
  const [encuentrosSemana, setEncuentrosSemana] = useState<number>(1);
  const [obligatoria, setObligatoria] = useState<boolean>(true);
  const [selectedPrerequisitos, setSelectedPrerequisitos] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setSelectedMateriaId(initialData.materia_id || 'mat-1');
      setCreditos(initialData.creditos);
      setHoras(initialData.cantidad_horas_materia);
      setEncuentrosTotales(initialData.encuentros_totales);
      setEncuentrosSemana(initialData.encuentros_por_semana);
      setObligatoria(initialData.obligatoria);
      setSelectedPrerequisitos(initialData.prerequisitos || []);
    } else {
      setSelectedMateriaId(MATERIAS_CATALOGO[0].id);
      setCreditos(4);
      setHoras(60);
      setEncuentrosTotales(12);
      setEncuentrosSemana(1);
      setObligatoria(true);
      setSelectedPrerequisitos([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const togglePrerequisito = (codigo: string) => {
    setSelectedPrerequisitos((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const materiaInfo = MATERIAS_CATALOGO.find((m) => m.id === selectedMateriaId) || MATERIAS_CATALOGO[0];
    onSave({
      id: initialData?.id || `sub-${Date.now()}`,
      materia_id: materiaInfo.id,
      codigo: materiaInfo.codigo,
      nombre: materiaInfo.nombre,
      creditos,
      cantidad_horas_materia: horas,
      encuentros_totales: encuentrosTotales,
      encuentros_por_semana: encuentrosSemana,
      obligatoria,
      prerequisitos: selectedPrerequisitos,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      {/* Contenedor del Modal A (Flat Design 2.0, max-w-lg) */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-lg w-full text-left shadow-none overflow-hidden flex flex-col max-h-[90vh]">
        {/* Encabezado */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              {initialData ? 'Editar Asignatura en Malla' : 'Agregar Asignatura a Malla'}
            </h3>
            <p className="text-xs text-[#475569] mt-0.5">
              Asignando a: <span className="font-semibold text-[#0F3C6E]">{bloqueNombre}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Selector de Materia */}
          <div className="space-y-1">
            <label className="font-semibold text-[#475569] block">
              Asignatura del Catálogo <span className="text-[#C81E2B]">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedMateriaId}
                onChange={(e) => setSelectedMateriaId(e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D63B8] focus:border-[#1D63B8] cursor-pointer"
                required
              >
                {MATERIAS_CATALOGO.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.codigo} — {m.nombre}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#475569]">
                <ChevronDownIcon className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Fila de Campos Numéricos: Créditos y Horas Totales */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Créditos Académicos (CR)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={creditos}
                onChange={(e) => setCreditos(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D63B8] focus:border-[#1D63B8]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Horas de Materia (h)
              </label>
              <input
                type="number"
                min={10}
                max={300}
                step={5}
                value={horas}
                onChange={(e) => setHoras(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D63B8] focus:border-[#1D63B8]"
                required
              />
            </div>
          </div>

          {/* Fila: Encuentros Totales y Encuentros por Semana */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Encuentros Totales (sesiones)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={encuentrosTotales}
                onChange={(e) => setEncuentrosTotales(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D63B8] focus:border-[#1D63B8]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#475569] block">
                Encuentros por Semana
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={encuentrosSemana}
                onChange={(e) => setEncuentrosSemana(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D63B8] focus:border-[#1D63B8]"
                required
              />
            </div>
          </div>

          {/* Switch Obligatoria / Optativa */}
          <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#0F172A] block">
                Carácter de la Asignatura
              </span>
              <span className="text-[11px] text-[#475569]">
                {obligatoria ? 'Materia obligatoria para el pensum' : 'Materia optativa / electiva'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setObligatoria(!obligatoria)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                obligatoria ? 'bg-[#0F3C6E]' : 'bg-[#CBD5E1]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  obligatoria ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Selector Múltiple de Prerrequisitos */}
          <div className="pt-2 border-t border-[#E2E8F0] space-y-1.5">
            <label className="font-semibold text-[#475569] block">
              Prerrequisitos de la Asignatura
            </label>
            <p className="text-[11px] text-[#94A3B8]">
              Selecciona las materias que deben ser aprobadas previamente:
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md">
              {MATERIAS_CATALOGO.map((m) => {
                const isSelected = selectedPrerequisitos.includes(m.codigo);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => togglePrerequisito(m.codigo)}
                    className={`font-mono text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F3C6E] text-white border-[#0F3C6E]'
                        : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#1D63B8]'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {m.codigo}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-md text-[#475569] font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0F3C6E] hover:bg-[#0A294D] text-white rounded-md font-semibold transition-colors cursor-pointer shadow-xs"
            >
              {initialData ? 'Guardar Cambios' : 'Agregar Asignatura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
