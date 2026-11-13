import React, { useState, useEffect } from 'react';
import type { UserItem } from './UserTable';
import type { OpcionRol, OpcionDireccion } from './UserFilters';

export interface UserDrawerSubmitData {
  id?: string;
  email?: string;
  password?: string;
  idRol: string;
  cedula: string;
  nombre: string;
  apellido: string;
  genero: 'F' | 'M';
  fechaNacimiento?: string;
  activo: boolean;
  esDocente: boolean;
  idDocente?: string;
  idDireccion?: string;
  codigoEmpleado?: string;
  telefono?: string;
  tipoContratacion?: 'FIJO' | 'TEMPORAL';
}

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: UserItem | null;
  roles?: OpcionRol[];
  direcciones?: OpcionDireccion[];
  onSave?: (userData: UserDrawerSubmitData) => Promise<void>;
  loading?: boolean;
}

export const UserDrawer: React.FC<UserDrawerProps> = ({
  isOpen,
  onClose,
  userToEdit,
  roles = [],
  direcciones = [],
  onSave,
  loading = false,
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('Unan2026*');
  const [cedula, setCedula] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [apellido, setApellido] = useState<string>('');
  const [genero, setGenero] = useState<'F' | 'M'>('M');
  const [fechaNacimiento, setFechaNacimiento] = useState<string>('');
  const [idRol, setIdRol] = useState<string>('');
  const [activo, setActivo] = useState<boolean>(true);

  const [esDocente, setEsDocente] = useState<boolean>(false);
  const [codigoEmpleado, setCodigoEmpleado] = useState<string>('');
  const [idDireccion, setIdDireccion] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [tipoContratacion, setTipoContratacion] = useState<'FIJO' | 'TEMPORAL'>('FIJO');

  useEffect(() => {
    if (userToEdit) {
      setCedula(userToEdit.cedula || '');
      setNombre(userToEdit.nombre || '');
      setApellido(userToEdit.apellido || '');
      setGenero(userToEdit.genero || 'M');
      setFechaNacimiento(userToEdit.fecha_nacimiento ? userToEdit.fecha_nacimiento.slice(0, 10) : '');
      setIdRol(userToEdit.id_rol || (roles[0]?.id ?? ''));
      setActivo(userToEdit.activo ?? true);

      setEsDocente(userToEdit.es_docente ?? false);
      setCodigoEmpleado(userToEdit.codigo_empleado || '');
      setIdDireccion(userToEdit.id_direccion || (direcciones[0]?.id ?? ''));
      setTelefono(userToEdit.telefono || '');
      setTipoContratacion(userToEdit.tipo_contratacion || 'FIJO');
    } else {
      setEmail('');
      setPassword('Unan2026*');
      setCedula('');
      setNombre('');
      setApellido('');
      setGenero('M');
      setFechaNacimiento('');
      setIdRol(roles[0]?.id ?? '');
      setActivo(true);

      setEsDocente(false);
      setCodigoEmpleado('');
      setIdDireccion(direcciones[0]?.id ?? '');
      setTelefono('');
      setTipoContratacion('FIJO');
    }
  }, [userToEdit, isOpen, roles, direcciones]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSave) {
      await onSave({
        id: userToEdit?.id,
        email: !userToEdit ? email : undefined,
        password: !userToEdit ? password : undefined,
        idRol: idRol || (roles[0]?.id ?? ''),
        cedula,
        nombre,
        apellido,
        genero,
        fechaNacimiento: fechaNacimiento || undefined,
        activo,
        esDocente,
        idDocente: userToEdit?.id_docente,
        idDireccion: esDocente ? idDireccion || (direcciones[0]?.id ?? '') : undefined,
        codigoEmpleado: esDocente ? codigoEmpleado : undefined,
        telefono: esDocente ? telefono : undefined,
        tipoContratacion: esDocente ? tipoContratacion : undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#FFFFFF] h-full shadow-lg border-l border-slate-200 flex flex-col justify-between overflow-hidden text-left">
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#0F3C6E] uppercase tracking-wider border-b border-slate-200 pb-2">
              1. Datos de Usuario
            </h3>

            {!userToEdit && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@unhsjm.edu.ni"
                    className="w-full px-3.5 py-2 text-xs bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                    Contraseña Inicial *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full px-3.5 py-2 text-xs bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Cédula de Identidad *
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Nombre *
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
                  Apellido *
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Rol del Sistema
              </label>
              <select
                value={idRol}
                onChange={(e) => setIdRol(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8] cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre} ({r.code})
                  </option>
                ))}
              </select>
            </div>

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

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#0F3C6E] uppercase tracking-wider">
                  2. Extensión Docente
                </h3>
                <p className="text-[11px] text-[#475569]">
                  Habilita el expediente académico para impartir asignaturas
                </p>
              </div>
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

            {esDocente && (
              <div className="space-y-3 bg-[#F8FAFC] p-3.5 border border-slate-200 rounded-lg">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1">
                    Código de Empleado *
                  </label>
                  <input
                    type="text"
                    required={esDocente}
                    value={codigoEmpleado}
                    onChange={(e) => setCodigoEmpleado(e.target.value)}
                    placeholder="ej. DOC-DANILO-01"
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1">
                    Dirección Académica Adscrita *
                  </label>
                  <select
                    value={idDireccion}
                    onChange={(e) => setIdDireccion(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8] cursor-pointer"
                  >
                    {direcciones.map((dir) => (
                      <option key={dir.id} value={dir.id}>
                        {dir.nombre} ({dir.codigo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+505 8822-1144"
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#FFFFFF] border border-slate-200 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1D63B8]"
                  />
                </div>

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

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-md text-xs font-semibold text-[#0F172A] bg-[#FFFFFF] border border-slate-200 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-[#0F3C6E] hover:bg-[#0A294D] border border-[#0F3C6E] transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Expediente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
