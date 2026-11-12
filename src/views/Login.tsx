import React, { useState } from 'react';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { LoginBrandingPanel } from '../components/auth/LoginBrandingPanel';
import { LoginForm } from '../components/auth/LoginForm';
import { PasswordRecoveryModal } from '../components/auth/PasswordRecoveryModal';

interface LoginProps {
  onLoginSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
}) => {
  const [isRecoveryOpen, setIsRecoveryOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-[#FFFFFF] border border-slate-200 rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <LoginBrandingPanel />

          <LoginForm
            onForgotPassword={() => setIsRecoveryOpen(true)}
            onSuccess={onLoginSuccess}
          />
        </div>
      </main>

      <PublicFooter />

      <PasswordRecoveryModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
      />
    </div>
  );
};

export default Login;
