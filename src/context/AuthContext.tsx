import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UsuarioSesionDto,
  LoginRequestDto,
  AuthResponseDto,
} from '../api/auth';
import {
  login as apiLogin,
  logout as apiLogout,
  getUsuarioLocal,
  getPerfilActual,
} from '../api/auth';
import { getAccessToken } from '../api/client';

interface AuthContextType {
  user: UsuarioSesionDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequestDto) => Promise<AuthResponseDto>;
  logout: () => Promise<void>;
  hasRole: (allowedRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UsuarioSesionDto | null>(() => getUsuarioLocal());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getPerfilActual();
        const sessionUser: UsuarioSesionDto = {
          id: profile.idUsuario,
          idUser: profile.idUser,
          idRol: profile.rol.id,
          rolCode: profile.rol.code,
          idDocente: profile.docente?.id,
          cedula: profile.cedula,
          nombre: profile.nombre,
          apellido: profile.apellido,
          genero: profile.genero,
          activo: true,
        };
        setUser(sessionUser);
        sessionStorage.setItem('auth_user', JSON.stringify(sessionUser));
      } catch {
        const local = getUsuarioLocal();
        setUser(local);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginRequestDto): Promise<AuthResponseDto> => {
    const response = await apiLogin(data);
    setUser(response.usuario);
    return response;
  };

  const logout = async (): Promise<void> => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  };

  const hasRole = (allowedRoles: string[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.rolCode);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
