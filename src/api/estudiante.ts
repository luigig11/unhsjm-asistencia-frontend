import { apiClient } from './client';

export type EstudianteFilterParams = {
  search?: string;
  codigo_unico?: string;
  carnet?: string;
  id_carrera?: string;
  id_plan_academico?: string;
  activo?: boolean;
  page?: number;
  pageSize?: number;
};

export interface EstudianteItem {
  id: string;
  codigo_unico: string;
  carnet: string;
  cedula?: string;
  nombres: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo?: string;
  telefono?: string;
  fecha_ingreso: string;
  id_carrera: string;
  carrera_nombre: string;
  id_plan_academico: string;
  plan_codigo: string;
  activo: boolean;
}

export interface EstudianteDetalle {
  id: string;
  codigo_unico: string;
  id_carrera: string;
  id_plan_academico: string;
  carnet: string;
  cedula?: string;
  nombres: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo?: string;
  telefono?: string;
  fecha_ingreso: string;
  activo: boolean;
}

export interface PagedEstudiantesResult {
  total: number;
  items: EstudianteItem[];
}

export interface CreateEstudianteDto {
  codigo_unico: string;
  id_carrera: string;
  id_plan_academico: string;
  carnet: string;
  cedula?: string;
  nombres: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo?: string;
  telefono?: string;
  fecha_ingreso: string;
  activo?: boolean;
}

export interface UpdateEstudianteDto {
  codigo_unico: string;
  id_carrera: string;
  id_plan_academico: string;
  carnet: string;
  cedula?: string;
  nombres: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo?: string;
  telefono?: string;
  fecha_ingreso: string;
  activo: boolean;
}

export const listarEstudiantes = async (
  filtro?: EstudianteFilterParams
): Promise<PagedEstudiantesResult> => {
  return apiClient.get<PagedEstudiantesResult>('estudiantes', filtro);
};

export const obtenerEstudiantePorId = async (
  id: string
): Promise<EstudianteDetalle> => {
  return apiClient.get<EstudianteDetalle>(`estudiantes/${id}`);
};

export const crearEstudiante = async (
  dto: CreateEstudianteDto
): Promise<EstudianteDetalle> => {
  return apiClient.post<EstudianteDetalle>('estudiantes', dto);
};

export const actualizarEstudiante = async (
  id: string,
  dto: UpdateEstudianteDto
): Promise<EstudianteDetalle> => {
  return apiClient.put<EstudianteDetalle>(`estudiantes/${id}`, dto);
};

export const eliminarEstudiante = async (
  id: string
): Promise<void> => {
  return apiClient.delete<void>(`estudiantes/${id}`);
};
