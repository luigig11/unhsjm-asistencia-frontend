import React, { useState, useEffect } from 'react';
import { CloseIcon, ChevronDownIcon } from '../common/Icons';

export interface EventType {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export const EVENT_TYPES: EventType[] = [
  { id: 'tipo-feriado', codigo: 'FER-NAC', nombre: 'Feriado Nacional', activo: true },
  { id: 'tipo-vacaciones', codigo: 'VAC-FIN', nombre: 'Vacaciones de Fin de Período', activo: true },
  { id: 'tipo-actividad', codigo: 'ACT-EXTRA', nombre: 'Actividad Extracurricular / Asueto', activo: true },
];

interface ModalEventoFeriadoProps {
  isOpen: boolean;
  onClose: () => void;
  eventTypes?: EventType[];
  onSave: (eventData: {
    nombre: string;
    id_tipo_evento: string;
    fecha_inicio: string;
    fecha_fin: string;
  }) => Promise<void> | void;
  loading?: boolean;
}

export const ModalEventoFeriado: React.FC<ModalEventoFeriadoProps> = ({
  isOpen,
  onClose,
  eventTypes = EVENT_TYPES,
  onSave,
  loading = false,
}) => {
  const [eventName, setEventName] = useState('');
  const [eventTypeId, setEventTypeId] = useState('');
  const [startDate, setStartDate] = useState('2026-11-16T08:00');
  const [endDate, setEndDate] = useState('2026-11-16T17:00');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (eventTypes.length > 0) {
        setEventTypeId(eventTypes[0].id);
      }
      setEventName('');
      setFormError('');
    }
  }, [isOpen, eventTypes]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) {
      setFormError('Ingresa el nombre o motivo del evento.');
      return;
    }
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setFormError('La fecha de fin no puede ser anterior a la de inicio.');
      return;
    }
    await onSave({
      nombre: eventName.trim(),
      id_tipo_evento: eventTypeId || (eventTypes[0]?.id ?? ''),
      fecha_inicio: startDate,
      fecha_fin: endDate,
    });
    setEventName('');
    setFormError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-md w-full text-left shadow-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              Registrar Feriado o Evento
            </h3>
            <p className="text-xs text-[#475569] mt-0.5">
              Impacta directamente en la no programación de sesiones de clase
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {formError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs">
              {formError}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="select-tipo-evento" className="font-semibold text-[#475569] block">
              Tipo de Evento o Feriado <span className="text-[#C81E2B]">*</span>
            </label>
            <div className="relative">
              <select
                id="select-tipo-evento"
                value={eventTypeId}
                onChange={(e) => setEventTypeId(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] appearance-none focus:outline-none focus:ring-1 focus:ring-[#1D63B8] cursor-pointer"
              >
                {eventTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.nombre} ({type.codigo})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#475569]">
                <ChevronDownIcon className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="input-nombre-evento" className="font-semibold text-[#475569] block">
              Descripción del Evento <span className="text-[#C81E2B]">*</span>
            </label>
            <input
              id="input-nombre-evento"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Ej. Feriado Nacional de Independencia"
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D63B8]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="input-start-date" className="font-semibold text-[#475569] block">
                Fecha / Hora Inicio <span className="text-[#C81E2B]">*</span>
              </label>
              <input
                id="input-start-date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D63B8]"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="input-end-date" className="font-semibold text-[#475569] block">
                Fecha / Hora Fin <span className="text-[#C81E2B]">*</span>
              </label>
              <input
                id="input-end-date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D63B8]"
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-md text-[#475569] font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0F3C6E] hover:bg-[#0A294D] text-white rounded-md font-semibold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
