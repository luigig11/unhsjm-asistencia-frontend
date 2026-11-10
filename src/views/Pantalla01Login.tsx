import React, { useState } from 'react';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { LoginBrandingPanel } from '../components/auth/LoginBrandingPanel';
import { LoginForm } from '../components/auth/LoginForm';
import { PasswordRecoveryModal } from '../components/auth/PasswordRecoveryModal';

interface Pantalla01LoginProps {
  onLoginSuccess?: () => void;
}

export const Pantalla01Login: React.FC<Pantalla01LoginProps> = ({
  onLoginSuccess,
}) => {
  const [isRecoveryOpen, setIsRecoveryOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between">
      {/* Franja superior institucional */}
      <PublicHeader />

      {/* Contenedor central Split-Screen */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-[#FFFFFF] border border-slate-200 rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Mitad Izquierda: Identidad UNHSJM */}
          <LoginBrandingPanel />

          {/* Mitad Derecha: Formulario de Acceso */}
          <LoginForm
            onForgotPassword={() => setIsRecoveryOpen(true)}
            onSuccess={onLoginSuccess}
          />
        </div>
      </main>

      {/* Pie de página */}
      <PublicFooter />

      {/* Modal de recuperación */}
      <PasswordRecoveryModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
      />
    </div>
  );
};

export default Pantalla01Login;
