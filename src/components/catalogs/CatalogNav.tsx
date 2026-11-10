import React from 'react';

export interface CatalogTabConfig {
  id: string;
  name: string;
  count?: number;
  extraHeader1?: string;
  extraHeader2?: string;
}

export const CATALOG_TABS: CatalogTabConfig[] = [
  { id: 'direccion', name: 'Direcciones Académicas' },
  { id: 'carrera', name: 'Carreras Universitarias', extraHeader1: 'Dirección' },
  { id: 'materia', name: 'Materias (Catálogo Global)' },
  { id: 'modalidad', name: 'Modalidades de Estudio' },
  { id: 'ciclo_academico', name: 'Ciclos / Años Lectivos', extraHeader1: 'Orden' },
  { id: 'tipo_periodo_academico', name: 'Tipos de Período', extraHeader1: 'Duración (Meses)', extraHeader2: 'Horas Mín/Máx' },
  { id: 'periodo_academico', name: 'Períodos Académicos', extraHeader1: 'Régimen', extraHeader2: 'Orden' },
  { id: 'tipo_aula', name: 'Tipos de Aula' },
  { id: 'aula', name: 'Aulas Físicas / Laboratorios', extraHeader1: 'Capacidad', extraHeader2: 'Tipo Recinto' },
  { id: 'estudiante', name: 'Estudiantes', extraHeader1: 'Carnet', extraHeader2: 'Carrera' },
  { id: 'tipo_evento', name: 'Tipos de Evento' },
  { id: 'motivo_ausencia', name: 'Motivos de Ausencia', extraHeader1: 'Aplica a', extraHeader2: 'Justifica Falta' },
];

interface CatalogNavProps {
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
}

export const CatalogNav: React.FC<CatalogNavProps> = ({
  activeTabId,
  onSelectTab,
}) => {
  return (
    <div className="w-full lg:w-64 bg-[#FFFFFF] border border-slate-200 rounded-lg p-2 shrink-0 text-left">
      <div className="px-3 py-2 border-b border-slate-100 mb-1">
        <span className="text-xs font-bold text-[#0F3C6E] uppercase tracking-wider">
          Directorios Maestros
        </span>
      </div>

      <nav className="space-y-0.5">
        {CATALOG_TABS.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                isActive
                  ? 'bg-[#0F3C6E] text-white font-semibold'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <span className="truncate">{tab.name}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-1" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
