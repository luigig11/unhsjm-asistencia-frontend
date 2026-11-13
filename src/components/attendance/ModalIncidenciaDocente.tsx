import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../common/Icons';
import { Button } from '../common/Button';

export interface OpcionDocenteSustituto {
  id: string;
  nombre: string;
}

export interface OpcionMotivoDocente {
  id: string;
  nombre: string;
}

interface ModalIncidenciaDocenteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    motivoId?: string;
    motivo: string;
    sustitutoId?: string;
    sustituto: string;
  }) => void;
  initialReason?: string;
  initialTeacher?: string;
  motivos?: OpcionMotivoDocente[];
  sustitutos?: OpcionDocenteSustituto[];
}

export const ModalIncidenciaDocente: React.FC<ModalIncidenciaDocenteProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialReason = '',
  initialTeacher = '',
  motivos = [],
  sustitutos = [],
}) => {
  const [selectedMotivoId, setSelectedMotivoId] = useState<string>('');
  const [selectedSustitutoId, setSelectedSustitutoId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (motivos.length > 0) {
        const found = motivos.find((m) => m.nombre === initialReason);
        setSelectedMotivoId(found ? found.id : motivos[0].id);
      }
      if (sustitutos.length > 0 && initialTeacher) {
        const foundSub = sustitutos.find((s) => s.nombre === initialTeacher);
        setSelectedSustitutoId(foundSub ? foundSub.id : '');
      }
    }
  }, [isOpen, initialReason, initialTeacher, motivos, sustitutos]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const motivoObj = motivos.find((m) => m.id === selectedMotivoId);
    const subObj = sustitutos.find((s) => s.id === selectedSustitutoId);

    onConfirm({
      motivoId: selectedMotivoId || undefined,
      motivo: motivoObj ? motivoObj.nombre : 'Ausencia justificada',
      sustitutoId: selectedSustitutoId || undefined,
      sustituto: subObj ? subObj.nombre : '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-md w-full text-left shadow-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              Registro de Incidencia Docente
            </h3>
            <p className="text-xs text-[#475569] mt-0.5">
              Notificación de ausencia del docente titular y asignación de reemplazo
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-[#FFF4E5] border border-[#F5D6A8] rounded-md text-[#9A5800]">
            <span className="font-bold">Aviso:</span> Al confirmar, el docente titular figurará como ausente justificado en el acta oficial de la sesión.
          </div>

          <div className="space-y-1.5">
            <label htmlFor="select-motivo-docente" className="font-bold text-[#0F172A]">
              Motivo de Inasistencia Justificada *
            </label>
            <select
              id="select-motivo-docente"
              value={selectedMotivoId}
              onChange={(e) => setSelectedMotivoId(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8]"
            >
              {motivos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="select-docente-sustituto" className="font-bold text-[#0F172A]">
              Docente Sustituto Designado (Opcional)
            </label>
            <select
              id="select-docente-sustituto"
              value={selectedSustitutoId}
              onChange={(e) => setSelectedSustitutoId(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8]"
            >
              <option value="">Sin docente sustituto (Sesión no impartida)</option>
              {sustitutos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
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
              Confirmar Incidencia
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
