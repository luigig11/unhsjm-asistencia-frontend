import React from 'react';
import { CloseIcon, PrinterIcon } from '../common/Icons';
import { Button } from '../common/Button';
import {
  ActaAsistenciaPdfTemplate,
  type ActaPdfTemplateProps,
} from './ActaAsistenciaPdfTemplate';

export interface ModalExportarActaPdfProps {
  isOpen: boolean;
  onClose: () => void;
  data: ActaPdfTemplateProps | null;
  loading?: boolean;
}

export const ModalExportarActaPdf: React.FC<ModalExportarActaPdfProps> = ({
  isOpen,
  onClose,
  data,
  loading = false,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    const originalTitle = document.title;
    if (data) {
      const sanitizedDate = (data.fecha || 'sesion').replace(/[/, ]+/g, '_');
      const materiaSlug = (data.materiaNombre || 'Clase').replace(/[/, ]+/g, '_');
      document.title = `Acta_Asistencia_${materiaSlug}_${data.grupo}_${sanitizedDate}`;
    }
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-[#CBD5E1] w-full max-w-[920px] max-h-[92vh] flex flex-col overflow-hidden text-left my-auto">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]"></span>
            <h3 className="text-sm font-bold text-[#0F172A]">
              Vista Previa de Impresión / Exportación a PDF
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={<PrinterIcon className="w-4 h-4" />}
              onClick={handlePrint}
              disabled={loading || !data}
            >
              Imprimir / Guardar como PDF
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-md transition-colors"
              aria-label="Cerrar"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F1F5F9]">
          {loading ? (
            <div className="py-20 text-center">
              <span className="inline-block w-6 h-6 border-2 border-[#0F3C6E] border-t-transparent rounded-full animate-spin"></span>
              <p className="text-xs text-[#475569] font-medium mt-2">
                Preparando documento oficial para exportación...
              </p>
            </div>
          ) : data ? (
            <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0]">
              <ActaAsistenciaPdfTemplate {...data} />
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-[#94A3B8]">
              No hay datos disponibles para mostrar en este momento.
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B] shrink-0 print:hidden">
          <span>
            En el diálogo del navegador, selecciona la opción <strong className="text-[#0F172A]">Guardar como PDF</strong> o tu impresora habitual.
          </span>
          <Button variant="secondary" size="xs" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
