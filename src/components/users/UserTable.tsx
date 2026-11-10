import React from 'react';

export interface UserItem {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  genero: 'F' | 'M';
  fecha_nacimiento?: string;
  rol_nombre: string;
  rol_code: 'ADMIN' | 'DIRECTOR' | 'DOCENTE';
  direccion_nombre?: string;
  es_docente: boolean;
  codigo_empleado?: string;
  telefono?: string;
  tipo_contratacion?: 'FIJO' | 'TEMPORAL';
  activo: boolean;
}

interface UserTableProps {
  users?: UserItem[];
  onEditUser?: (user: UserItem) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users = [],
  onEditUser,
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-slate-200 rounded-lg overflow-hidden text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
              <th className="py-2.5 px-4">Usuario / Cédula</th>
              <th className="py-2.5 px-4">Rol Asignado</th>
              <th className="py-2.5 px-4">Perfil Docente / Dirección</th>
              <th className="py-2.5 px-4">Contratación</th>
              <th className="py-2.5 px-4">Estado</th>
              <th className="py-2.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {users.length === 0 ? (
              /* Estado Vacío Limpio (Plantilla) */
              <tr>
                <td colSpan={6} className="py-14 px-6 text-center text-xs text-[#94A3B8]">
                  <div className="max-w-sm mx-auto space-y-1">
                    <p className="font-semibold text-[#475569] text-sm">
                      No se encontraron usuarios registrados
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      Utiliza el botón "Nuevo Usuario" para dar de alta perfiles personales y habilitar expedientes docentes.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
                  {/* Nombre y cédula */}
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#0F172A] text-sm">
                      {user.nombre} {user.apellido}
                    </p>
                    <p className="font-mono text-xs text-[#475569] mt-0.5">
                      {user.cedula}
                    </p>
                  </td>

                  {/* Rol */}
                  <td className="py-3 px-4">
                    <span className="inline-block font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EBF3FC] text-[#0F3C6E] border border-[#93C5FD]">
                      {user.rol_nombre}
                    </span>
                  </td>

                  {/* Extensión Docente y Dirección */}
                  <td className="py-3 px-4">
                    {user.es_docente ? (
                      <div>
                        <p className="text-xs font-medium text-[#0F172A]">
                          {user.direccion_nombre || 'Sin dirección asignada'}
                        </p>
                        <p className="font-mono text-[11px] text-[#475569]">
                          Cód: {user.codigo_empleado || '—'}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-[#94A3B8]">
                        Solo acceso administrativo
                      </span>
                    )}
                  </td>

                  {/* Contratación */}
                  <td className="py-3 px-4">
                    {user.es_docente && user.tipo_contratacion ? (
                      <span className="font-mono text-xs text-[#475569]">
                        {user.tipo_contratacion}
                      </span>
                    ) : (
                      <span className="text-xs text-[#94A3B8]">—</span>
                    )}
                  </td>

                  {/* Estado Activo/Inactivo */}
                  <td className="py-3 px-4">
                    {user.activo ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]" />
                        Inactivo
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onEditUser?.(user)}
                      className="px-2.5 py-1 text-xs font-medium text-[#0F3C6E] hover:text-[#1D63B8] hover:bg-slate-100 rounded transition-colors"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
