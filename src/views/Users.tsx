import React, { useState } from 'react';
import { UserFilters } from '../components/users/UserFilters';
import { UserTable } from '../components/users/UserTable';
import type { UserItem } from '../components/users/UserTable';
import { UserDrawer } from '../components/users/UserDrawer';

export const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDirection, setSelectedDirection] = useState<string>('');

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  const handleOpenCreateDrawer = () => {
    setEditingUser(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (user: UserItem) => {
    setEditingUser(user);
    setIsDrawerOpen(true);
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
        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          selectedDirection={selectedDirection}
          onDirectionChange={setSelectedDirection}
          onOpenCreateDrawer={handleOpenCreateDrawer}
        />

        <UserTable onEditUser={handleOpenEditDrawer} />
      </main>

      <UserDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userToEdit={editingUser}
      />
    </>
  );
};

export default Users;
