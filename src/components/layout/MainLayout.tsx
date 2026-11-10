import React, { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  onNavigate?: (screenKey: string) => void;
  activeScreen?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  onNavigate,
  activeScreen,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex">
      {/* Sidebar compartido único para todas las pantallas privadas */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onNavigate={onNavigate}
        activeScreen={activeScreen}
      />

      {/* Área dinámica donde se inyecta la pantalla activa */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
};
