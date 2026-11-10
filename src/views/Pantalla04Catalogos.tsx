import React, { useState } from 'react';
import { CatalogNav, CATALOG_TABS } from '../components/catalogs/CatalogNav';
import { CatalogContentView } from '../components/catalogs/CatalogContentView';
import { StandardCatalogModal } from '../components/catalogs/StandardCatalogModal';
import type { CatalogItem } from '../components/catalogs/StandardCatalogModal';

export const Pantalla04Catalogos: React.FC = () => {
  // Pestaña activa del submenú lateral izquierdo (por defecto 'direccion')
  const [activeTabId, setActiveTabId] = useState<string>('direccion');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estado del Modal D (Formulario Estándar de Catálogo)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  // Configuración de la pestaña actual
  const currentTab =
    CATALOG_TABS.find((tab) => tab.id === activeTabId) || CATALOG_TABS[0];

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CatalogItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Cabecera Superior Limpia */}
      <header className="h-16 bg-[#FFFFFF] border-b border-slate-200 px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="text-left">
          <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-tight">
            Hub Maestro de Catálogos Institucionales
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Administración centralizada de infraestructura, estructura organizacional y parámetros curriculares
          </p>
        </div>
      </header>

      {/* Contenedor Principal: Submenú vertical izquierdo + Área de tabla derecha */}
      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row gap-6 overflow-y-auto">
        {/* 1. Submenú vertical izquierdo para alternar entre los 12 catálogos sin recargar */}
        <CatalogNav
          activeTabId={activeTabId}
          onSelectTab={(tabId) => {
            setActiveTabId(tabId);
            setSearchTerm('');
          }}
        />

        {/* 2. Área derecha con barra de búsqueda, botón "+ Nuevo Registro" y tabla limpia */}
        <CatalogContentView
          currentTab={currentTab}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onOpenCreateModal={handleOpenCreateModal}
          onEditItem={handleOpenEditModal}
        />
      </main>

      {/* Modal D: Formulario Estándar de Catálogo (codigo, nombre, activo) */}
      <StandardCatalogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        catalogTitle={currentTab.name}
        itemToEdit={editingItem}
      />
    </>
  );
};

export default Pantalla04Catalogos;
