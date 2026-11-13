import React from 'react';
import { Button } from '../common/Button';

export interface UserItem {
  id: string;
  id_rol?: string;
  cedula: string;
  nombre: string;
  apellido: string;
  genero: 'F' | 'M';
  fecha_nacimiento?: string;
  rol_nombre: string;
  rol_code?: 'ADMIN' | 'DIRECTOR' | 'DOCENTE';
  id_direccion?: string;
  direccion_nombre?: string;
  es_docente: boolean;
  id_docente?: string;
  codigo_empleado?: string;
  telefono?: string;
  tipo_contratacion?: 'FIJO' | 'TEMPORAL';
  activo: boolean;
}

interface UserTableProps {
  users?: UserItem[];
  loading?: boolean;
  onEditUser?: (user: UserItem) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users = [],
  loading = false,
  onEditUser,
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-slate-200 rounded-lg overflow-hidden text-left shadow-sm">
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
            {loading ? (
              <tr>
                <td colSpan={6} className="py-14 px-6 text-center text-xs text-[#475569]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#1D63B8] border-t-transparent rounded-full animate-spin" />
                    <span>Cargando usuarios registrados...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
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
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#0F172A] text-xs">
                      {user.nombre} {user.apellido}
                    </p>
                    <p className="font-mono text-[11px] text-[#475569] mt-0.5">
                      {user.cedula || 'Sin cédula'}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-block font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EBF3FC] text-[#0F3C6E] border border-[#93C5FD]">
                      {user.rol_nombre}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {user.es_docente ? (
                      <div>
                        <p className="text-xs font-medium text-[#0F172A]">
                          {user.direccion_nombre || 'Dirección Asignada'}
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

                  <td className="py-3 px-4">
                    {user.es_docente && user.tipo_contratacion ? (
                      <span className="font-mono text-xs text-[#475569]">
                        {user.tipo_contratacion}
                      </span>
                    ) : (
                      <span className="text-xs text-[#94A3B8]">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        user.activo
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-[#475569] border-slate-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.activo ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onEditUser?.(user)}
                      className="text-[#0F3C6E] hover:text-[#1D63B8]"
                    >
                      Editar
                    </Button>
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
