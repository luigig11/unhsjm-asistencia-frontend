import { apiClient } from './client';

export type TipoContratacion = 'FIJO' | 'TEMPORAL';

export type DocenteFilterParams = {
  search?: string;
  id_direccion?: string;
  tipo_contratacion?: TipoContratacion;
  activo?: boolean;
};

export interface DocenteItem {
  id: string;
  id_usuario: string;
  nombre_completo: string;
  cedula?: string;
  id_direccion: string;
  direccion_nombre: string;
  codigo_empleado: string;
  telefono?: string;
  tipo_contratacion: TipoContratacion;
  activo: boolean;
}

export interface DocenteUsuarioResumen {
  nombre: string;
  apellido: string;
  cedula?: string;
  genero: 'F' | 'M';
}

export interface DocenteDetalle {
  id: string;
  id_usuario: string;
  usuario: DocenteUsuarioResumen;
  id_direccion: string;
  codigo_empleado: string;
  telefono?: string;
  tipo_contratacion: TipoContratacion;
  activo: boolean;
}

export interface CreateDocenteDto {
  id_usuario: string;
  id_direccion: string;
  codigo_empleado: string;
  telefono?: string;
  tipo_contratacion: TipoContratacion;
  activo?: boolean;
}

export interface UpdateDocenteDto {
  id_direccion: string;
  codigo_empleado: string;
  telefono?: string;
  tipo_contratacion: TipoContratacion;
  activo: boolean;
}

export const listarDocentes = async (
  filtro?: DocenteFilterParams
): Promise<DocenteItem[]> => {
  return apiClient.get<DocenteItem[]>('docentes', filtro);
};

export const obtenerDocentePorId = async (
  id: string
): Promise<DocenteDetalle> => {
  return apiClient.get<DocenteDetalle>(`docentes/${id}`);
};

export const crearDocente = async (
  dto: CreateDocenteDto
): Promise<DocenteDetalle> => {
  return apiClient.post<DocenteDetalle>('docentes', dto);
};

export const actualizarDocente = async (
  id: string,
  dto: UpdateDocenteDto
): Promise<DocenteDetalle> => {
  return apiClient.put<DocenteDetalle>(`docentes/${id}`, dto);
};

export const eliminarDocente = async (
  id: string
): Promise<void> => {
  return apiClient.delete<void>(`docentes/${id}`);
};
