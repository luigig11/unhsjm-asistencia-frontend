import { apiClient } from './client';

export interface DireccionDto {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export interface CreateDireccionDto {
  codigo: string;
  nombre: string;
  activo?: boolean;
}

export type DireccionFilterParams = {
  search?: string;
  activo?: boolean;
};

export interface CarreraDto {
  id: string;
  idDireccion: string;
  direccionNombre: string;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export interface CreateCarreraDto {
  idDireccion: string;
  codigo: string;
  nombre: string;
  activo?: boolean;
}

export type CarreraFilterParams = {
  search?: string;
  idDireccion?: string;
  activo?: boolean;
};

export interface ModalidadDto {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export type ModalidadFilterParams = {
  search?: string;
  activo?: boolean;
};

export interface MateriaDto {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export interface CreateMateriaDto {
  codigo: string;
  nombre: string;
  activo?: boolean;
}

export type MateriaFilterParams = {
  search?: string;
  activo?: boolean;
};

export interface CentroUniversitarioDto {
  id: string;
  codigo: string;
  nombre: string;
  ubicacion?: string | null;
  activo: boolean;
}

export type CentroUniversitarioFilterParams = {
  search?: string;
  activo?: boolean;
};

export interface AulaDto {
  id: string;
  idTipoAula: string;
  tipoAulaNombre: string;
  codigo: string;
  nombre: string;
  capacidad: number;
  ubicacion?: string | null;
  activo: boolean;
}

export type AulaFilterParams = {
  idTipoAula?: string;
  search?: string;
  activo?: boolean;
};

export interface DiaDto {
  id: number;
  nombre: string;
}

export interface MotivoAusenciaDto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  justificaInasistencia: boolean;
  aplicaA: string;
  activo: boolean;
}

export type MotivoAusenciaFilterParams = {
  aplicaA?: string;
  activo?: boolean;
};

export const listarDirecciones = (params?: DireccionFilterParams): Promise<DireccionDto[]> => {
  return apiClient.get<DireccionDto[]>('/direcciones', params);
};

export const crearDireccion = (data: CreateDireccionDto): Promise<DireccionDto> => {
  return apiClient.post<DireccionDto>('/direcciones', data);
};

export const listarCarreras = (params?: CarreraFilterParams): Promise<CarreraDto[]> => {
  return apiClient.get<CarreraDto[]>('/carreras', params);
};

export const crearCarrera = (data: CreateCarreraDto): Promise<CarreraDto> => {
  return apiClient.post<CarreraDto>('/carreras', data);
};

export const listarModalidades = (params?: ModalidadFilterParams): Promise<ModalidadDto[]> => {
  return apiClient.get<ModalidadDto[]>('/modalidades', params);
};

export const listarMaterias = (params?: MateriaFilterParams): Promise<MateriaDto[]> => {
  return apiClient.get<MateriaDto[]>('/materias', params);
};

export const crearMateria = (data: CreateMateriaDto): Promise<MateriaDto> => {
  return apiClient.post<MateriaDto>('/materias', data);
};

export const listarCentrosUniversitarios = (params?: CentroUniversitarioFilterParams): Promise<CentroUniversitarioDto[]> => {
  return apiClient.get<CentroUniversitarioDto[]>('/centros-universitarios', params);
};

export const listarAulas = (params?: AulaFilterParams): Promise<AulaDto[]> => {
  return apiClient.get<AulaDto[]>('/aulas', params);
};

export const listarDias = (): Promise<DiaDto[]> => {
  return apiClient.get<DiaDto[]>('/dias');
};

export const listarMotivosAusencia = (params?: MotivoAusenciaFilterParams): Promise<MotivoAusenciaDto[]> => {
  return apiClient.get<MotivoAusenciaDto[]>('/motivos-ausencia', params);
};
