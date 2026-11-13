import React, { useState } from 'react';
import { MailIcon } from '../common/Icons';
import { Button } from '../common/Button';

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIdentifier?: string;
}

export const PasswordRecoveryModal: React.FC<PasswordRecoveryModalProps> = ({
  isOpen,
  onClose,
  initialIdentifier = '',
}) => {
  // Estado del correo a recuperar
  const [recoveryIdentifier, setRecoveryIdentifier] = useState<string>(initialIdentifier);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Validación y envío de solicitud
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanRecovery = recoveryIdentifier.trim();
    if (!cleanRecovery) {
      setErrorMessage('Ingresa el correo electrónico vinculado a tu cuenta.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        'Si el correo se encuentra registrado, recibirás las instrucciones para restablecer tu contraseña.'
      );
    }, 500);
  };

  // Cierre y reseteo de mensajes
  const handleClose = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    onClose();
  };

  return (
    /* Fondo oscuro con desenfoque suave */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      {/* Tarjeta modal flotante */}
      <div className="w-full max-w-md bg-[#FFFFFF] border border-slate-200 rounded-lg shadow-sm overflow-hidden text-left">
        {/* Cabecera del modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            {/* Categoría */}
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1D63B8]">
              Recuperación de Cuenta
            </span>
            {/* Título */}
            <h3 className="text-lg font-bold text-[#0F172A] mt-0.5">
              Restablecer Contraseña
            </h3>
          </div>
          {/* Botón de cierre en la esquina */}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Cerrar modal"
          >
            ✕
          </Button>
        </div>

        {/* Formulario de recuperación */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {/* Texto instructivo */}
          <p className="text-xs text-[#475569] leading-relaxed">
            Ingresa tu correo electrónico institucional para enviarte las instrucciones de restablecimiento de contraseña.
          </p>

          {/* Alerta de error */}
          {errorMessage && (
            <div className="p-3 rounded-md bg-[#FEE2E2] border border-[#FCA5A5] text-xs text-[#B91C1C]">
              {errorMessage}
            </div>
          )}

          {/* Alerta de éxito */}
          {successMessage && (
            <div className="p-3 rounded-md bg-[#DCFCE7] border border-[#86EFAC] text-xs text-[#15803D]">
              {successMessage}
            </div>
          )}

          {/* Campo de correo */}
          <div>
            {/* Etiqueta */}
            <label
              htmlFor="modal-recovery-identifier"
              className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5"
            >
              Correo Electrónico Institucional
            </label>
            <div className="relative">
              {/* Ícono de correo */}
              <span className="inset-y-0 left-0 pl-3 flex items-center pointer-events-none absolute text-[#94A3B8]">
                <MailIcon className="w-4 h-4" />
              </span>
              {/* Input */}
              <input
                id="modal-recovery-identifier"
                type="email"
                value={recoveryIdentifier}
                onChange={(e) => {
                  setRecoveryIdentifier(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="correo@unhsjm.edu.ni"
                className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] rounded-md border transition-colors focus:outline-none ${
                  errorMessage
                    ? 'border-[#C81E2B] bg-[#FEE2E2]/20 focus:border-[#C81E2B]'
                    : 'border-slate-200 focus:border-[#1D63B8]'
                }`}
              />
            </div>
          </div>

          {/* Fila de botones de acción */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleClose}
              className="sm:w-1/2"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="sm:w-1/2"
            >
              Enviar instrucciones
            </Button>
          </div>
        </form>

        {/* Pie del modal */}
        <div className="px-6 py-3 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between text-[11px] text-[#475569]">
          <span>Soporte Técnico Institucional</span>
          <span className="font-mono text-[#0F3C6E]">UNHSJM</span>
        </div>
      </div>
    </div>
  );
};
