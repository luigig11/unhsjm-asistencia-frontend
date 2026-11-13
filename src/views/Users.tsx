import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserFilters, type OpcionRol, type OpcionDireccion } from '../components/users/UserFilters';
import { UserTable, type UserItem } from '../components/users/UserTable';
import { UserDrawer, type UserDrawerSubmitData } from '../components/users/UserDrawer';
import {
  listarUsuarios,
  listarRoles,
  register,
  actualizarUsuario,
} from '../api/auth';
import {
  listarDocentes,
  crearDocente,
  actualizarDocente,
} from '../api/docente';
import { listarDirecciones } from '../api/catalogos';
import { AlertCircleIcon } from '../components/common/Icons';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<OpcionRol[]>([]);
  const [direcciones, setDirecciones] = useState<OpcionDireccion[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDirection, setSelectedDirection] = useState<string>('');

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarCatalogos = useCallback(async () => {
    try {
      const [rolesRes, dirRes] = await Promise.allSettled([
        listarRoles({ activo: true }),
        listarDirecciones({ activo: true }),
      ]);

      if (rolesRes.status === 'fulfilled' && Array.isArray(rolesRes.value)) {
        setRoles(
          rolesRes.value.map((r) => ({
            id: r.id,
            code: r.code,
            nombre: r.nombre,
          }))
        );
      }

      if (dirRes.status === 'fulfilled' && Array.isArray(dirRes.value)) {
        setDirecciones(
          dirRes.value.map((d) => ({
            id: d.id,
            codigo: d.codigo,
            nombre: d.nombre,
          }))
        );
      }
    } catch {}
  }, []);

  useEffect(() => {
    cargarCatalogos();
  }, [cargarCatalogos]);

  const cargarUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, docentesRes] = await Promise.allSettled([
        listarUsuarios({
          search: searchTerm || undefined,
          id_rol: selectedRole || undefined,
        }),
        listarDocentes({ activo: true }),
      ]);

      const docentesMap = new Map();
      if (docentesRes.status === 'fulfilled' && Array.isArray(docentesRes.value)) {
        for (const doc of docentesRes.value) {
          docentesMap.set(doc.id_usuario, doc);
        }
      }

      if (usersRes.status === 'fulfilled' && usersRes.value?.items) {
        const mappedUsers: UserItem[] = usersRes.value.items.map((u) => {
          const doc = docentesMap.get(u.id);

          return {
            id: u.id,
            id_rol: u.id_rol,
            cedula: u.cedula || '',
            nombre: u.nombre,
            apellido: u.apellido,
            genero: u.genero || 'M',
            fecha_nacimiento: u.fecha_nacimiento || undefined,
            rol_nombre: u.rol_nombre,
            es_docente: Boolean(u.tiene_perfil_docente || doc),
            id_docente: doc ? doc.id : u.id_docente || undefined,
            id_direccion: doc?.id_direccion,
            direccion_nombre: doc?.direccion_nombre,
            codigo_empleado: doc?.codigo_empleado,
            telefono: doc?.telefono,
            tipo_contratacion: doc?.tipo_contratacion,
            activo: u.activo,
          };
        });

        setUsers(mappedUsers);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar usuarios.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedRole]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const filteredUsers = useMemo(() => {
    if (!selectedDirection) return users;
    return users.filter((u) => u.id_direccion === selectedDirection);
  }, [users, selectedDirection]);

  const handleOpenCreateDrawer = () => {
    setEditingUser(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (user: UserItem) => {
    setEditingUser(user);
    setIsDrawerOpen(true);
  };

  const handleSaveUser = async (data: UserDrawerSubmitData) => {
    setSaving(true);
    setError(null);
    try {
      if (!data.id) {
        const regRes = await register({
          email: data.email || `${data.nombre.toLowerCase()}.${data.apellido.toLowerCase()}@unhsjm.edu.ni`,
          password: data.password || 'Unan2026*',
          idRol: data.idRol,
          cedula: data.cedula,
          nombre: data.nombre,
          apellido: data.apellido,
          genero: data.genero,
          fechaNacimiento: data.fechaNacimiento,
        });

        const newUserId = regRes.usuario?.id;
        if (data.esDocente && newUserId && data.idDireccion && data.codigoEmpleado) {
          await crearDocente({
            id_usuario: newUserId,
            id_direccion: data.idDireccion,
            codigo_empleado: data.codigoEmpleado,
            telefono: data.telefono,
            tipo_contratacion: data.tipoContratacion || 'FIJO',
            activo: data.activo,
          });
        }
      } else {
        await actualizarUsuario(data.id, {
          id_rol: data.idRol,
          cedula: data.cedula,
          nombre: data.nombre,
          apellido: data.apellido,
          genero: data.genero,
          fecha_nacimiento: data.fechaNacimiento,
          activo: data.activo,
        });

        if (data.esDocente && data.idDireccion && data.codigoEmpleado) {
          if (data.idDocente) {
            await actualizarDocente(data.idDocente, {
              id_direccion: data.idDireccion,
              codigo_empleado: data.codigoEmpleado,
              telefono: data.telefono,
              tipo_contratacion: data.tipoContratacion || 'FIJO',
              activo: data.activo,
            });
          } else {
            await crearDocente({
              id_usuario: data.id,
              id_direccion: data.idDireccion,
              codigo_empleado: data.codigoEmpleado,
              telefono: data.telefono,
              tipo_contratacion: data.tipoContratacion || 'FIJO',
              activo: data.activo,
            });
          }
        }
      }

      setIsDrawerOpen(false);
      await cargarUsuarios();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el usuario o expediente.';
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
            Gestión de Usuarios y Expediente Docente
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Administración de cuentas, asignación de roles y habilitación de perfiles docentes
          </p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-4 max-w-[1600px] w-full mx-auto overflow-y-auto">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5 text-rose-800 text-xs font-medium">
              <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={cargarUsuarios}
              className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-white border border-rose-300 rounded hover:bg-rose-100 transition-colors shrink-0"
            >
              Reintentar
            </button>
          </div>
        )}

        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          selectedDirection={selectedDirection}
          onDirectionChange={setSelectedDirection}
          roles={roles}
          direcciones={direcciones}
          onOpenCreateDrawer={handleOpenCreateDrawer}
        />

        <UserTable
          users={filteredUsers}
          loading={loading}
          onEditUser={handleOpenEditDrawer}
        />
      </main>

      <UserDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userToEdit={editingUser}
        roles={roles}
        direcciones={direcciones}
        onSave={handleSaveUser}
        loading={saving}
      />
    </>
  );
};

export default Users;
