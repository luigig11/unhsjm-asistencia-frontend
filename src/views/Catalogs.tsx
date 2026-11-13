import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CatalogNav, CATALOG_TABS } from '../components/catalogs/CatalogNav';
import { CatalogContentView } from '../components/catalogs/CatalogContentView';
import { StandardCatalogModal } from '../components/catalogs/StandardCatalogModal';
import type { CatalogItem } from '../components/catalogs/StandardCatalogModal';
import {
  listarDirecciones,
  crearDireccion,
  actualizarDireccion,
  listarCarreras,
  listarMaterias,
  crearMateria,
  actualizarMateria,
  listarModalidades,
  crearModalidad,
  actualizarModalidad,
  listarCiclosAcademicos,
  listarTiposPeriodoAcademico,
  listarPeriodosAcademicos,
  listarTiposAula,
  listarAulas,
  listarTiposEvento,
  listarMotivosAusencia,
  crearMotivoAusencia,
  actualizarMotivoAusencia,
} from '../api/catalogos';
import { listarEstudiantes } from '../api/estudiante';
import { AlertCircleIcon } from '../components/common/Icons';

export const Catalogs: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>('direccion');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  const currentTab = useMemo(() => {
    return CATALOG_TABS.find((tab) => tab.id === activeTabId) || CATALOG_TABS[0];
  }, [activeTabId]);

  const cargarDatosTab = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let mapped: CatalogItem[] = [];

      switch (activeTabId) {
        case 'direccion': {
          const res = await listarDirecciones();
          mapped = res.map((d) => ({
            id: d.id,
            codigo: d.codigo,
            nombre: d.nombre,
            activo: d.activo,
          }));
          break;
        }
        case 'carrera': {
          const res = await listarCarreras();
          mapped = res.map((c) => ({
            id: c.id,
            codigo: c.codigo,
            nombre: c.nombre,
            activo: c.activo,
            extraCol1: c.direccionNombre,
          }));
          break;
        }
        case 'materia': {
          const res = await listarMaterias();
          mapped = res.map((m) => ({
            id: m.id,
            codigo: m.codigo,
            nombre: m.nombre,
            activo: m.activo,
          }));
          break;
        }
        case 'modalidad': {
          const res = await listarModalidades();
          mapped = res.map((m) => ({
            id: m.id,
            codigo: m.codigo,
            nombre: m.nombre,
            activo: m.activo,
          }));
          break;
        }
        case 'ciclo_academico': {
          const res = await listarCiclosAcademicos();
          mapped = res.map((c) => ({
            id: c.id,
            codigo: c.codigo,
            nombre: c.nombre,
            activo: c.activo,
            extraCol1: `Año / Nivel ${c.orden}`,
          }));
          break;
        }
        case 'tipo_periodo_academico': {
          const res = await listarTiposPeriodoAcademico();
          mapped = res.map((t) => ({
            id: t.id,
            codigo: t.codigo,
            nombre: t.nombre,
            activo: t.activo,
            extraCol1: `${t.duracionMesesMinimo} - ${t.duracionMesesMaximo} meses`,
            extraCol2: `${t.duracionHorasMinimo}h / ${t.duracionHorasMaximo}h`,
          }));
          break;
        }
        case 'periodo_academico': {
          const res = await listarPeriodosAcademicos();
          mapped = res.map((p) => ({
            id: p.id,
            codigo: p.codigo,
            nombre: p.nombre,
            activo: p.activo,
            extraCol1: p.tipoPeriodoNombre || 'Régimen',
            extraCol2: `Orden ${p.orden}`,
          }));
          break;
        }
        case 'tipo_aula': {
          const res = await listarTiposAula();
          mapped = res.map((t) => ({
            id: t.id,
            codigo: t.codigo,
            nombre: t.nombre,
            activo: t.activo,
          }));
          break;
        }
        case 'aula': {
          const res = await listarAulas();
          mapped = res.map((a) => ({
            id: a.id,
            codigo: a.codigo,
            nombre: a.nombre,
            activo: a.activo,
            extraCol1: `${a.capacidad} estudiantes`,
            extraCol2: a.tipoAulaNombre,
          }));
          break;
        }
        case 'estudiante': {
          const res = await listarEstudiantes();
          mapped = (res?.items || []).map((e) => ({
            id: e.id,
            codigo: e.codigo_unico,
            nombre: `${e.nombres} ${e.primer_apellido}`,
            activo: e.activo,
            extraCol1: e.carnet,
            extraCol2: e.carrera_nombre,
          }));
          break;
        }
        case 'tipo_evento': {
          const res = await listarTiposEvento();
          mapped = res.map((t) => ({
            id: t.id,
            codigo: t.codigo,
            nombre: t.nombre,
            activo: t.activo,
          }));
          break;
        }
        case 'motivo_ausencia': {
          const res = await listarMotivosAusencia();
          mapped = res.map((m) => ({
            id: m.id,
            codigo: m.codigo,
            nombre: m.nombre,
            activo: m.activo,
            extraCol1: m.aplicaA,
            extraCol2: m.justificaInasistencia ? 'Justifica Falta' : 'Injustificada',
          }));
          break;
        }
        default:
          break;
      }

      setItems(mapped);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al consultar catálogo institucional.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [activeTabId]);

  useEffect(() => {
    cargarDatosTab();
  }, [cargarDatosTab]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;

    return items.filter(
      (item) =>
        item.codigo.toLowerCase().includes(term) ||
        item.nombre.toLowerCase().includes(term) ||
        (item.extraCol1 && item.extraCol1.toLowerCase().includes(term)) ||
        (item.extraCol2 && item.extraCol2.toLowerCase().includes(term))
    );
  }, [items, searchTerm]);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CatalogItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (itemData: Partial<CatalogItem>) => {
    if (!itemData.codigo || !itemData.nombre) {
      alert('Debes ingresar el código y el nombre oficial.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (activeTabId === 'direccion') {
        if (itemData.id) {
          await actualizarDireccion(itemData.id, {
            codigo: itemData.codigo,
            nombre: itemData.nombre,
            activo: itemData.activo,
          });
        } else {
          await crearDireccion({
            codigo: itemData.codigo,
            nombre: itemData.nombre,
            activo: itemData.activo,
          });
        }
      } else if (activeTabId === 'materia') {
        if (itemData.id) {
          await actualizarMateria(itemData.id, {
            codigo: itemData.codigo,
            nombre: itemData.nombre,
            activo: itemData.activo,
          });
        } else {
          await crearMateria({
            codigo: itemData.codigo,
            nombre: itemData.nombre,
            activo: itemData.activo,
          });
        }
      } else if (activeTabId === 'modalidad') {
        if (itemData.id) {
          await actualizarModalidad(itemData.id, {
            codigo: itemData.codigo,
            nombre: itemData.nombre,
            activo: itemData.activo,
          });
        } else {
          await crearModalidad({
            codigo: itemData.codigo,
            nombre: itemData.nombre,
            activo: itemData.activo,
          });
        }
      } else if (activeTabId === 'motivo_ausencia') {
        if (itemData.id) {
          await actualizarMotivoAusencia(itemData.id, {
            codigo: itemData.codigo,
            nombre: itemData.nombre,
            activo: itemData.activo,
          });
        } else {
          await crearMotivoAusencia({
            codigo: itemData.codigo,
            nombre: itemData.nombre,
            aplicaA: 'DOCENTE',
            justificaInasistencia: true,
            activo: itemData.activo,
          });
        }
      }

      setIsModalOpen(false);
      await cargarDatosTab();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar elemento del catálogo.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
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

      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row gap-6 overflow-y-auto">
        <CatalogNav
          activeTabId={activeTabId}
          onSelectTab={(tabId) => {
            setActiveTabId(tabId);
            setSearchTerm('');
          }}
        />

        <div className="flex-1 flex flex-col gap-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5 text-rose-800 text-xs font-medium">
                <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={cargarDatosTab}
                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-white border border-rose-300 rounded hover:bg-rose-100 transition-colors shrink-0"
              >
                Reintentar
              </button>
            </div>
          )}

          <CatalogContentView
            currentTab={currentTab}
            items={filteredItems}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onOpenCreateModal={handleOpenCreateModal}
            onEditItem={handleOpenEditModal}
          />
        </div>
      </main>

      <StandardCatalogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        catalogTitle={currentTab.name}
        itemToEdit={editingItem}
        onSave={handleSaveItem}
        loading={saving}
      />
    </>
  );
};

export default Catalogs;
