import { apiClient, setSession, clearSession } from './client';

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  idRol: string;
  cedula?: string;
  nombre: string;
  apellido: string;
  genero: string;
  fechaNacimiento?: string;
}

export interface RefreshTokenRequestDto {
  accessToken: string;
  refreshToken: string;
}

export interface UsuarioSesionDto {
  id: string;
  idUser?: string | null;
  idRol: string;
  rolCode: string;
  idDocente?: string | null;
  cedula?: string | null;
  nombre: string;
  apellido: string;
  genero?: string | null;
  activo: boolean;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  usuario: UsuarioSesionDto;
}

export interface RolResumenDto {
  id: string;
  code: string;
  nombre: string;
}

export interface DocenteResumenPerfilDto {
  id: string;
  codigoEmpleado: string;
  idDireccion: string;
  tipoContratacion: string;
}

export interface PermisoPerfilDto {
  entidad: string;
  operacionesPermitidas: string[];
}

export interface UserProfileDto {
  idUsuario: string;
  idUser?: string | null;
  email: string;
  cedula?: string | null;
  nombre: string;
  apellido: string;
  genero: string;
  fechaNacimiento?: string | null;
  rol: RolResumenDto;
  docente?: DocenteResumenPerfilDto | null;
  permisos: PermisoPerfilDto[];
}

export interface RefreshResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface UsuarioItemDto {
  id: string;
  id_user?: string | null;
  id_rol: string;
  rol_nombre: string;
  cedula?: string | null;
  nombre: string;
  apellido: string;
  genero: 'F' | 'M';
  fecha_nacimiento?: string | null;
  activo: boolean;
  tiene_perfil_docente: boolean;
  id_docente?: string | null;
}

export interface PagedUsuariosResult {
  total: number;
  items: UsuarioItemDto[];
}

export interface UsuarioFilterParams {
  search?: string;
  id_rol?: string;
  activo?: boolean;
  page?: number;
  pageSize?: number;
}

export interface UpdateUsuarioDto {
  id_rol: string;
  cedula?: string;
  nombre: string;
  apellido: string;
  genero: string;
  fecha_nacimiento?: string;
  activo: boolean;
}

export interface RolItemDto {
  id: string;
  code: string;
  nombre: string;
  activo: boolean;
}

export const login = async (data: LoginRequestDto): Promise<AuthResponseDto> => {
  const response = await apiClient.post<AuthResponseDto>('/auth/login', data);
  if (response.accessToken) {
    setSession(response.accessToken, response.refreshToken);
    sessionStorage.setItem('auth_user', JSON.stringify(response.usuario));
  }
  return response;
};

export const register = async (data: RegisterRequestDto): Promise<AuthResponseDto> => {
  const response = await apiClient.post<AuthResponseDto>('/auth/register', data);
  if (response.accessToken) {
    setSession(response.accessToken, response.refreshToken);
    sessionStorage.setItem('auth_user', JSON.stringify(response.usuario));
  }
  return response;
};

export const refreshToken = async (data: RefreshTokenRequestDto): Promise<RefreshResponseDto> => {
  const response = await apiClient.post<RefreshResponseDto>('/auth/refresh', data);
  if (response.access_token) {
    setSession(response.access_token, response.refresh_token);
  }
  return response;
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post<void>('/auth/logout');
  } finally {
    clearSession();
  }
};

export const getPerfilActual = (): Promise<UserProfileDto> => {
  return apiClient.get<UserProfileDto>('/auth/me');
};

export const getUsuarioLocal = (): UsuarioSesionDto | null => {
  const raw = sessionStorage.getItem('auth_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UsuarioSesionDto;
  } catch {
    return null;
  }
};

export const listarUsuarios = (params?: UsuarioFilterParams): Promise<PagedUsuariosResult> => {
  return apiClient.get<PagedUsuariosResult>('/usuarios', params);
};

export const obtenerUsuarioPorId = (id: string): Promise<unknown> => {
  return apiClient.get(`/usuarios/${id}`);
};

export const actualizarUsuario = (id: string, data: UpdateUsuarioDto): Promise<unknown> => {
  return apiClient.put(`/usuarios/${id}`, data);
};

export const eliminarUsuario = (id: string): Promise<void> => {
  return apiClient.delete<void>(`/usuarios/${id}`);
};

export const listarRoles = (params?: { activo?: boolean }): Promise<RolItemDto[]> => {
  return apiClient.get<RolItemDto[]>('/roles', params);
};
