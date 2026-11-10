import React, { useState } from 'react';
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from '../common/Icons';

interface LoginFormProps {
  onForgotPassword: () => void;
  onSuccess?: () => void;
}

interface FeedbackMessage {
  type: 'error' | 'success';
  title: string;
  detail: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onForgotPassword,
  onSuccess,
}) => {
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberSession, setRememberSession] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      errors.identifier = 'Ingresa tu correo institucional o usuario.';
    }

    if (!password) {
      errors.password = 'Ingresa tu contraseña de acceso.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    if (!validateForm()) {
      setFeedback({
        type: 'error',
        title: 'Campos requeridos incompletos',
        detail: 'Por favor, completa tus credenciales para iniciar sesión.',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback({
        type: 'success',
        title: 'Acceso verificado',
        detail: 'Iniciando sesión en la plataforma institucional...',
      });
      onSuccess?.();
    }, 500);
  };

  return (
    <section className="lg:col-span-7 p-6 sm:p-8 lg:p-10 bg-[#FFFFFF] flex flex-col justify-between text-left">
      <div>
        {/* Encabezado */}
        <div className="pb-5 mb-6 border-b border-slate-200">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1D63B8]">
            Acceso al Sistema
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] mt-0.5">
            Iniciar Sesión
          </h2>
        </div>

        {/* Mensajes de Feedback */}
        {feedback && (
          <div
            role="alert"
            className={`mb-5 p-3.5 rounded-lg border text-xs flex items-start justify-between gap-3 ${
              feedback.type === 'error'
                ? 'bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C]'
                : 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]'
            }`}
          >
            <div className="flex items-start gap-2">
              {feedback.type === 'error' ? (
                <AlertCircleIcon className="w-4 h-4 text-[#C81E2B] shrink-0 mt-0.5" />
              ) : (
                <CheckCircleIcon className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{feedback.title}</p>
                <p className="mt-0.5 leading-relaxed">{feedback.detail}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-current opacity-70 hover:opacity-100 p-0.5"
              aria-label="Cerrar alerta"
            >
              ✕
            </button>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Correo Electrónico */}
          <div>
            <label
              htmlFor="login-identifier"
              className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="inset-y-0 left-0 pl-3 flex items-center pointer-events-none absolute text-[#94A3B8]">
                <MailIcon className="w-4 h-4" />
              </span>
              <input
                id="login-identifier"
                type="email"
                autoComplete="username"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (fieldErrors.identifier) {
                    setFieldErrors({ ...fieldErrors, identifier: undefined });
                  }
                }}
                placeholder="correo@unhsjm.edu.ni"
                className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] rounded-md border transition-colors focus:outline-none ${
                  fieldErrors.identifier
                    ? 'border-[#C81E2B] bg-[#FEE2E2]/20 focus:border-[#C81E2B]'
                    : 'border-slate-200 focus:border-[#1D63B8]'
                }`}
              />
            </div>
            {fieldErrors.identifier && (
              <p className="mt-1.5 text-xs font-medium text-[#C81E2B]">
                {fieldErrors.identifier}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#475569]"
              >
                Contraseña
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-medium text-[#1D63B8] hover:text-[#0F3C6E] hover:underline focus:outline-none"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div className="relative">
              <span className="inset-y-0 left-0 pl-3 flex items-center pointer-events-none absolute text-[#94A3B8]">
                <LockIcon className="w-4 h-4" />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors({ ...fieldErrors, password: undefined });
                  }
                }}
                placeholder="Ingresa tu contraseña"
                className={`w-full pl-9 pr-20 py-2.5 text-sm bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] rounded-md border transition-colors focus:outline-none ${
                  fieldErrors.password
                    ? 'border-[#C81E2B] bg-[#FEE2E2]/20 focus:border-[#C81E2B]'
                    : 'border-slate-200 focus:border-[#1D63B8]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-1.5 my-1.5 px-2.5 rounded text-xs font-medium text-[#475569] hover:text-[#0F3C6E] hover:bg-slate-100 border border-transparent hover:border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                {showPassword ? (
                  <>
                    <EyeOffIcon className="w-3.5 h-3.5" />
                    <span>Ocultar</span>
                  </>
                ) : (
                  <>
                    <EyeIcon className="w-3.5 h-3.5" />
                    <span>Ver</span>
                  </>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1.5 text-xs font-medium text-[#C81E2B]">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Recordar sesión */}
          <div className="flex items-center pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0F3C6E] focus:ring-0 accent-[#0F3C6E]"
              />
              <span className="text-xs text-[#475569] font-medium">
                Recordar sesión
              </span>
            </label>
          </div>

          {/* Botón Iniciar Sesión */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-md text-sm font-semibold text-white border transition-colors flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-[#1D63B8] border-[#1D63B8] cursor-wait'
                  : 'bg-[#0F3C6E] border-[#0F3C6E] hover:bg-[#0A294D] active:bg-[#0A294D]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Pie del Formulario */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-[#475569]">
        <span>Soporte Técnico · Registro Académico</span>
        <span className="font-mono text-[11px] text-[#0F3C6E]">
          UNHSJM
        </span>
      </div>
    </section>
  );
};
