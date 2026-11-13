import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../common/Icons';
import { Button, Input, Select } from '../common';
import type { CreatePlanAcademicoDto } from '../../api/planAcademico';
import type {
  CarreraDto,
  CentroUniversitarioDto,
  ModalidadDto,
  TipoPeriodoAcademicoDto,
} from '../../api/catalogos';

interface ModalPlanAcademicoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPlan: CreatePlanAcademicoDto) => Promise<void> | void;
  carreras: CarreraDto[];
  centros: CentroUniversitarioDto[];
  modalidades: ModalidadDto[];
  tiposPeriodo: TipoPeriodoAcademicoDto[];
  isSaving?: boolean;
}

export const ModalPlanAcademico: React.FC<ModalPlanAcademicoProps> = ({
  isOpen,
  onClose,
  onSave,
  carreras,
  centros,
  modalidades,
  tiposPeriodo,
  isSaving = false,
}) => {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [idCarrera, setIdCarrera] = useState('');
  const [idCentro, setIdCentro] = useState('');
  const [idModalidad, setIdModalidad] = useState('');
  const [idTipoPeriodo, setIdTipoPeriodo] = useState('');
  const [cantidadCiclos, setCantidadCiclos] = useState<number>(5);
  const [cantidadPeriodos, setCantidadPeriodos] = useState<number>(15);
  const [activoDesde, setActivoDesde] = useState('2026-01-01');
  const [activoHasta, setActivoHasta] = useState('2030-12-31');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setIdCarrera(carreras[0]?.id || '');
    setIdCentro(centros[0]?.id || '');
    setIdModalidad(modalidades[0]?.id || '');
    setIdTipoPeriodo(tiposPeriodo[0]?.id || '');
    setCodigo('');
    setNombre('');
    setCantidadCiclos(5);
    setCantidadPeriodos(15);
    setActivoDesde('2026-01-01');
    setActivoHasta('2030-12-31');
  }, [isOpen, carreras, centros, modalidades, tiposPeriodo]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!codigo.trim() || !idCarrera || !idModalidad || !idTipoPeriodo) {
      setError('Por favor complete los campos obligatorios.');
      return;
    }

    try {
      await onSave({
        codigo: codigo.trim().toUpperCase(),
        nombre: nombre.trim() || `Plan Curricular ${codigo.trim()}`,
        idCarrera,
        idCentroUniversitario: idCentro || centros[0]?.id || '00000000-0000-0000-0000-000000000000',
        idModalidad,
        idTipoPeriodoAcademico: idTipoPeriodo,
        cantidadCicloAcademico: Number(cantidadCiclos) || 5,
        cantidadPeriodoAcademico: Number(cantidadPeriodos) || 15,
        activoDesde: activoDesde ? `${activoDesde}T00:00:00Z` : '2026-01-01T00:00:00Z',
        activoHasta: activoHasta ? `${activoHasta}T23:59:59Z` : null,
        activo: true,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar el plan académico.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-lg w-full text-left shadow-none overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              Nuevo Plan Académico
            </h3>
            <p className="text-xs text-[#475569] mt-0.5">
              Registra un nuevo programa curricular en la institución
            </p>
          </div>
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

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Código del Plan"
              required
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej. ISI-2026"
            />

            <Select
              label="Modalidad"
              required
              value={idModalidad}
              onChange={(e) => setIdModalidad(e.target.value)}
            >
              {modalidades.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Nombre descriptivo del Plan"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Plan Curricular de Ingeniería en Sistemas 2026"
          />

          <Select
            label="Carrera Curricular"
            required
            value={idCarrera}
            onChange={(e) => setIdCarrera(e.target.value)}
          >
            {carreras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} ({c.codigo})
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Centro Universitario"
              value={idCentro}
              onChange={(e) => setIdCentro(e.target.value)}
            >
              {centros.map((cen) => (
                <option key={cen.id} value={cen.id}>
                  {cen.nombre}
                </option>
              ))}
            </Select>

            <Select
              label="Tipo de Período"
              required
              value={idTipoPeriodo}
              onChange={(e) => setIdTipoPeriodo(e.target.value)}
            >
              {tiposPeriodo.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {tp.nombre}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Años / Ciclos Totales"
              type="number"
              min={1}
              max={10}
              value={cantidadCiclos}
              onChange={(e) => setCantidadCiclos(Number(e.target.value))}
            />

            <Input
              label="Períodos / Trimestres Totales"
              type="number"
              min={1}
              max={30}
              value={cantidadPeriodos}
              onChange={(e) => setCantidadPeriodos(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Activo Desde"
              type="date"
              value={activoDesde}
              onChange={(e) => setActivoDesde(e.target.value)}
            />

            <Input
              label="Activo Hasta (Vigencia)"
              type="date"
              value={activoHasta}
              onChange={(e) => setActivoHasta(e.target.value)}
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
              Crear Plan Académico
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
