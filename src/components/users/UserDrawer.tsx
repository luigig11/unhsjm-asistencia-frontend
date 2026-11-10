import React, { useState } from 'react';
import type { UserItem } from './UserTable';

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: UserItem | null;
  onSave?: (userData: Partial<UserItem>) => void;
}

export const UserDrawer: React.FC<UserDrawerProps> = ({
  isOpen,
  onClose,
  userToEdit,
  onSave,
}) => {
  // Sección 1: Datos de Usuario (usuario)
  const [cedula, setCedula] = useState<string>(userToEdit?.cedula || '');
  const [nombre, setNombre] = useState<string>(userToEdit?.nombre || '');
  const [apellido, setApellido] = useState<string>(userToEdit?.apellido || '');
  const [genero, setGenero] = useState<'F' | 'M'>(userToEdit?.genero || 'F');
  const [fechaNacimiento, setFechaNacimiento] = useState<string>(
    userToEdit?.fecha_nacimiento || ''
  );
  const [rolCode, setRolCode] = useState<'ADMIN' | 'DIRECTOR' | 'DOCENTE'>(
    userToEdit?.rol_code || 'DOCENTE'
  );
  const [activo, setActivo] = useState<boolean>(userToEdit?.activo ?? true);

  // Sección 2: Extensión Docente (docente)
  const [esDocente, setEsDocente] = useState<boolean>(
    userToEdit?.es_docente ?? false
  );
  const [codigoEmpleado, setCodigoEmpleado] = useState<string>(
    userToEdit?.codigo_empleado || ''
  );
  const [idDireccion, setIdDireccion] = useState<string>(
    userToEdit?.direccion_nombre || ''
  );
  const [telefono, setTelefono] = useState<string>(userToEdit?.telefono || '');
  const [tipoContratacion, setTipoContratacion] = useState<'FIJO' | 'TEMPORAL'>(
    userToEdit?.tipo_contratacion || 'FIJO'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave?.({
      cedula,
      nombre,
      apellido,
      genero,
      fecha_nacimiento: fechaNacimiento,
      rol_code: rolCode,
      activo,
      es_docente: esDocente,
      codigo_empleado: esDocente ? codigoEmpleado : undefined,
      direccion_nombre: esDocente ? idDireccion : undefined,
      telefono: esDocente ? telefono : undefined,
      tipo_contratacion: esDocente ? tipoContratacion : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      {/* Contenedor Slide-over Drawer lateral (480px en Desktop) */}
      <div className="w-full max-w-lg bg-[#FFFFFF] h-full shadow-lg border-l border-slate-200 flex flex-col justify-between overflow-hidden text-left">
        {/* Cabecera del Drawer */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1D63B8]">
              Expediente Institucional
            </span>
            <h2 className="text-lg font-bold text-[#0F172A] mt-0.5">
              {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Cerrar panel"
          >
            ✕
          </button>
        </div>

        {/* Formulario con Scroll Vertical */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECCIÓN 1: DATOS DE USUARIO */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#0F3C6E] uppercase tracking-wider border-b border-slate-200 pb-2">
              1. Datos de Usuario
            </h3>

            {/* Cédula */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Cédula de Identidad
              </label>
              <input
                type="text"
                required
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="ej. 001-120590-0045B"
                className="w-full px-3.5 py-2 text-xs font-mono bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
              />
            </div>

            {/* Nombres y Apellidos */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombres"
                  className="w-full px-3.5 py-2 text-xs bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Apellido
                </label>
                <input
                  type="text"
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Apellidos"
                  className="w-full px-3.5 py-2 text-xs bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                />
              </div>
            </div>

            {/* Género (Segmented Control F / M) + Fecha de Nacimiento */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Género
                </label>
                <div className="grid grid-cols-2 gap-1 bg-[#F8FAFC] border border-slate-200 rounded-md p-1">
                  <button
                    type="button"
                    onClick={() => setGenero('F')}
                    className={`py-1 text-xs font-semibold rounded text-center transition-colors cursor-pointer ${
                      genero === 'F'
                        ? 'bg-[#0F3C6E] text-white'
                        : 'text-[#475569] hover:text-[#0F172A]'
                    }`}
                  >
                    Femenino
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenero('M')}
                    className={`py-1 text-xs font-semibold rounded text-center transition-colors cursor-pointer ${
                      genero === 'M'
                        ? 'bg-[#0F3C6E] text-white'
                        : 'text-[#475569] hover:text-[#0F172A]'
                    }`}
                  >
                    Masculino
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                />
              </div>
            </div>

            {/* Rol de Acceso */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Rol del Sistema
              </label>
              <select
                value={rolCode}
                onChange={(e) =>
                  setRolCode(e.target.value as 'ADMIN' | 'DIRECTOR' | 'DOCENTE')
                }
                className="w-full px-3 py-2 text-xs font-medium bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
              >
                <option value="ADMIN">Administrador General</option>
                <option value="DIRECTOR">Director de Área / Coordinador</option>
                <option value="DOCENTE">Docente</option>
              </select>
            </div>

            {/* Switch Activo */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-[#475569]">
                Usuario Habilitado / Activo
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0F3C6E]"></div>
              </label>
            </div>
          </div>

          {/* SECCIÓN 2: EXTENSIÓN DOCENTE */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#0F3C6E] uppercase tracking-wider">
                  2. Extensión Docente
                </h3>
                <p className="text-[11px] text-[#475569]">
                  Habilita el expediente académico para asignación de cursos
                </p>
              </div>
              {/* Toggle ¿Habilitar perfil Docente? */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={esDocente}
                  onChange={(e) => setEsDocente(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1D63B8]"></div>
              </label>
            </div>

            {/* Campos condicionales del expediente docente */}
            {esDocente && (
              <div className="space-y-3 bg-[#F8FAFC] p-3.5 border border-slate-200 rounded-lg">
                {/* Código de Empleado */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1">
                    Código de Empleado
                  </label>
                  <input
                    type="text"
                    required={esDocente}
                    value={codigoEmpleado}
                    onChange={(e) => setCodigoEmpleado(e.target.value)}
                    placeholder="ej. EMP-0142"
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                  />
                </div>

                {/* Dirección Académica */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1">
                    Dirección Académica Adscrita
                  </label>
                  <select
                    value={idDireccion}
                    onChange={(e) => setIdDireccion(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                  >
                    <option value="">Seleccione una dirección...</option>
                    <option value="Ciencias Básicas y Tecnología">
                      Ciencias Básicas y Tecnología (DCByT)
                    </option>
                    <option value="Ciencias Económicas y Empresariales">
                      Ciencias Económicas y Empresariales (DCEE)
                    </option>
                    <option value="Ciencias y Humanidades">
                      Ciencias y Humanidades (DCH)
                    </option>
                  </select>
                </div>

                {/* Teléfono de Contacto */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+505 8888-0000"
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                  />
                </div>

                {/* Tipo de Contratación (FIJO / TEMPORAL) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1">
                    Régimen Contractual
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTipoContratacion('FIJO')}
                      className={`py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                        tipoContratacion === 'FIJO'
                          ? 'bg-[#0F3C6E] text-white border-[#0F3C6E]'
                          : 'bg-[#FFFFFF] text-[#475569] border-slate-200 hover:text-[#0F172A]'
                      }`}
                    >
                      Docente Fijo
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoContratacion('TEMPORAL')}
                      className={`py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                        tipoContratacion === 'TEMPORAL'
                          ? 'bg-[#0F3C6E] text-white border-[#0F3C6E]'
                          : 'bg-[#FFFFFF] text-[#475569] border-slate-200 hover:text-[#0F172A]'
                      }`}
                    >
                      Docente Temporal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Pie Fijo de Acciones */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-semibold text-[#0F172A] bg-[#FFFFFF] border border-slate-200 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={(e) => {
              const form = (e.currentTarget.closest('div')?.previousElementSibling as HTMLFormElement);
              form?.requestSubmit();
            }}
            className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-[#0F3C6E] hover:bg-[#0A294D] border border-[#0F3C6E] transition-colors cursor-pointer"
          >
            Guardar Expediente
          </button>
        </div>
      </div>
    </div>
  );
};
