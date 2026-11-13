import React from 'react';
import { PlusIcon } from '../common/Icons';
import { Button } from '../common/Button';

export interface AcademicInstance {
  id: string;
  nombre: string;
  periodoEscolar: string;
  bloque: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

interface OfferingHeaderProps {
  instances: AcademicInstance[];
  selectedInstanceId: string;
  selectedInstance?: AcademicInstance;
  onSelectInstance: (id: string) => void;
  onOpenCreateGroup: () => void;
  groupsCount: number;
  subjectsCount: number;
  totalEnrolled: number;
  totalCapacity: number;
}

const formatDate = (value: string) => {
  if (!value) return '—';
  return new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString('es-NI', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const OfferingHeader: React.FC<OfferingHeaderProps> = ({
  instances,
  selectedInstanceId,
  selectedInstance,
  onSelectInstance,
  onOpenCreateGroup,
  groupsCount,
  subjectsCount,
  totalEnrolled,
  totalCapacity,
}) => {
  return (
    <div className="space-y-4">
      {/* Título de Página y Botón de Acción */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Oferta Académica
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Apertura de grupos, asignación de carga docente y control de cupos por período
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<PlusIcon className="w-3.5 h-3.5" />}
          onClick={onOpenCreateGroup}
        >
          Nuevo Grupo / Sección
        </Button>
      </div>

      {/* Selector de Instancia Académica */}
      <section className="rounded-lg border border-[#E2E8F0] bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1 text-left">
            <label className="block text-xs font-semibold text-[#475569]">
              Instancia Académica
            </label>
            <select
              value={selectedInstanceId}
              onChange={(e) => onSelectInstance(e.target.value)}
              className="w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
            >
              {instances.length === 0 ? (
                <option value="">Sin instancias académicas</option>
              ) : (
                instances.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.nombre} ({inst.bloque})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 text-left">
            <p className="text-[11px] text-[#64748B]">Año Lectivo</p>
            <p className="font-semibold text-xs text-[#0F3C6E] mt-0.5">
              {selectedInstance?.periodoEscolar ?? '—'}
            </p>
          </div>

          <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 text-left">
            <p className="text-[11px] text-[#64748B]">Vigencia de la Instancia</p>
            <p className="text-xs font-semibold text-[#0F3C6E] mt-0.5">
              {formatDate(selectedInstance?.fecha_inicio ?? '')} — {formatDate(selectedInstance?.fecha_fin ?? '')}
            </p>
          </div>
        </div>
      </section>

      {/* 3 KPIs Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-3.5 text-left">
          <p className="text-xs text-[#64748B]">Grupos ofertados</p>
          <p className="mt-1 text-xl font-bold text-[#0F172A]">{groupsCount}</p>
        </div>

        <div className="rounded-lg border border-[#E2E8F0] bg-white p-3.5 text-left">
          <p className="text-xs text-[#64748B]">Materias con docente asignado</p>
          <p className="mt-1 text-xl font-bold text-[#0F3C6E]">{subjectsCount}</p>
        </div>

        <div className="rounded-lg border border-[#E2E8F0] bg-white p-3.5 text-left">
          <p className="text-xs text-[#64748B]">Ocupación total</p>
          <p className="mt-1 text-xl font-bold text-[#0F3C6E]">
            {totalEnrolled} <span className="text-xs font-normal text-[#64748B]">/ {totalCapacity} cupos</span>
          </p>
        </div>
      </div>
    </div>
  );
};
