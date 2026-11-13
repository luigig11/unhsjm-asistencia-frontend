import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../common/Icons';
import { Button, Input, Select } from '../common';
import type { SubjectMalla } from './SubjectCard';

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
      <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-lg w-full text-left shadow-none overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              {initialData ? 'Editar Asignatura en Malla' : 'Agregar Asignatura a Malla'}
            </h3>
            <p className="text-xs text-[#475569] mt-0.5">
              Asignando a: <span className="font-semibold text-[#0F3C6E]">{bloqueNombre}</span>
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            icon={<CloseIcon className="w-4 h-4" />}
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A]"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <Select
            label="Asignatura del Catálogo"
            required
            value={selectedMateriaId}
            onChange={(e) => setSelectedMateriaId(e.target.value)}
          >
            {MATERIAS_CATALOGO.map((m) => (
              <option key={m.id} value={m.id}>
                {m.codigo} — {m.nombre}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Créditos Académicos (CR)"
              type="number"
              min={1}
              max={12}
              required
              value={creditos}
              onChange={(e) => setCreditos(Number(e.target.value))}
            />
            <Input
              label="Horas de Materia (h)"
              type="number"
              min={10}
              max={300}
              step={5}
              required
              value={horas}
              onChange={(e) => setHoras(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Encuentros Totales (sesiones)"
              type="number"
              min={1}
              max={60}
              required
              value={encuentrosTotales}
              onChange={(e) => setEncuentrosTotales(Number(e.target.value))}
            />
            <Input
              label="Encuentros por Semana"
              type="number"
              min={1}
              max={5}
              required
              value={encuentrosSemana}
              onChange={(e) => setEncuentrosSemana(Number(e.target.value))}
            />
          </div>

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
                  <Button
                    key={m.id}
                    type="button"
                    variant={isSelected ? 'primary' : 'secondary'}
                    size="xs"
                    onClick={() => togglePrerequisito(m.codigo)}
                    className="font-mono text-[10px]"
                  >
                    {isSelected ? `✓ ${m.codigo}` : m.codigo}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              {initialData ? 'Guardar Cambios' : 'Agregar Asignatura'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
