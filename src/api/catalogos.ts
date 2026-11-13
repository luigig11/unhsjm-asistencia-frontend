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

export interface CreateAulaDto {
  idTipoAula: string;
  codigo: string;
  nombre: string;
  capacidad: number;
  ubicacion?: string | null;
  activo?: boolean;
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

export interface CreateMotivoAusenciaDto {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  justificaInasistencia: boolean;
  aplicaA: string;
  activo?: boolean;
}

export type MotivoAusenciaFilterParams = {
  aplicaA?: string;
  activo?: boolean;
};

export interface CicloAcademicoDto {
  id: string;
  codigo: string;
  nombre: string;
  orden: number;
  activo: boolean;
}

export interface TipoPeriodoAcademicoDto {
  id: string;
  codigo: string;
  nombre: string;
  duracionMesesMinimo: number;
  duracionMesesMaximo: number;
  duracionHorasMinimo: number;
  duracionHorasMaximo: number;
  activo: boolean;
}

export interface PeriodoAcademicoDto {
  id: string;
  idTipoPeriodoAcademico: string;
  tipoPeriodoNombre?: string;
  codigo: string;
  nombre: string;
  orden: number;
  activo: boolean;
}

export interface TipoAulaDto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}

export interface TipoEventoDto {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export const listarDirecciones = (params?: DireccionFilterParams): Promise<DireccionDto[]> => {
  return apiClient.get<DireccionDto[]>('/direcciones', params);
};

export const crearDireccion = (data: CreateDireccionDto): Promise<DireccionDto> => {
  return apiClient.post<DireccionDto>('/direcciones', data);
};

export const actualizarDireccion = (id: string, data: Partial<CreateDireccionDto>): Promise<DireccionDto> => {
  return apiClient.put<DireccionDto>(`/direcciones/${id}`, data);
};

export const listarCarreras = (params?: CarreraFilterParams): Promise<CarreraDto[]> => {
  return apiClient.get<CarreraDto[]>('/carreras', params);
};

export const crearCarrera = (data: CreateCarreraDto): Promise<CarreraDto> => {
  return apiClient.post<CarreraDto>('/carreras', data);
};

export const actualizarCarrera = (id: string, data: Partial<CreateCarreraDto>): Promise<CarreraDto> => {
  return apiClient.put<CarreraDto>(`/carreras/${id}`, data);
};

export const listarModalidades = (params?: ModalidadFilterParams): Promise<ModalidadDto[]> => {
  return apiClient.get<ModalidadDto[]>('/modalidades', params);
};

export const crearModalidad = (data: { codigo: string; nombre: string; activo?: boolean }): Promise<ModalidadDto> => {
  return apiClient.post<ModalidadDto>('/modalidades', data);
};

export const actualizarModalidad = (id: string, data: { codigo?: string; nombre?: string; activo?: boolean }): Promise<ModalidadDto> => {
  return apiClient.put<ModalidadDto>(`/modalidades/${id}`, data);
};

export const listarMaterias = (params?: MateriaFilterParams): Promise<MateriaDto[]> => {
  return apiClient.get<MateriaDto[]>('/materias', params);
};

export const crearMateria = (data: CreateMateriaDto): Promise<MateriaDto> => {
  return apiClient.post<MateriaDto>('/materias', data);
};

export const actualizarMateria = (id: string, data: Partial<CreateMateriaDto>): Promise<MateriaDto> => {
  return apiClient.put<MateriaDto>(`/materias/${id}`, data);
};

export const listarCentrosUniversitarios = (params?: CentroUniversitarioFilterParams): Promise<CentroUniversitarioDto[]> => {
  return apiClient.get<CentroUniversitarioDto[]>('/centros-universitarios', params);
};

export const listarAulas = (params?: AulaFilterParams): Promise<AulaDto[]> => {
  return apiClient.get<AulaDto[]>('/aulas', params);
};

export const crearAula = (data: CreateAulaDto): Promise<AulaDto> => {
  return apiClient.post<AulaDto>('/aulas', data);
};

export const actualizarAula = (id: string, data: Partial<CreateAulaDto>): Promise<AulaDto> => {
  return apiClient.put<AulaDto>(`/aulas/${id}`, data);
};

export const listarDias = (): Promise<DiaDto[]> => {
  return apiClient.get<DiaDto[]>('/dias');
};

export const listarMotivosAusencia = (params?: MotivoAusenciaFilterParams): Promise<MotivoAusenciaDto[]> => {
  return apiClient.get<MotivoAusenciaDto[]>('/motivos-ausencia', params);
};

export const crearMotivoAusencia = (data: CreateMotivoAusenciaDto): Promise<MotivoAusenciaDto> => {
  return apiClient.post<MotivoAusenciaDto>('/motivos-ausencia', data);
};

export const actualizarMotivoAusencia = (id: string, data: Partial<CreateMotivoAusenciaDto>): Promise<MotivoAusenciaDto> => {
  return apiClient.put<MotivoAusenciaDto>(`/motivos-ausencia/${id}`, data);
};

export const listarCiclosAcademicos = (params?: { activo?: boolean }): Promise<CicloAcademicoDto[]> => {
  return apiClient.get<CicloAcademicoDto[]>('/ciclos-academicos', params);
};

export const listarTiposPeriodoAcademico = (params?: { activo?: boolean }): Promise<TipoPeriodoAcademicoDto[]> => {
  return apiClient.get<TipoPeriodoAcademicoDto[]>('/tipos-periodo-academico', params);
};

export const listarPeriodosAcademicos = (params?: { idTipoPeriodo?: string; activo?: boolean }): Promise<PeriodoAcademicoDto[]> => {
  return apiClient.get<PeriodoAcademicoDto[]>('/periodos-academicos', params);
};

export const listarTiposAula = (params?: { activo?: boolean }): Promise<TipoAulaDto[]> => {
  return apiClient.get<TipoAulaDto[]>('/tipos-aula', params);
};

export const listarTiposEvento = (params?: { activo?: boolean }): Promise<TipoEventoDto[]> => {
  return apiClient.get<TipoEventoDto[]>('/tipos-evento', params);
};
