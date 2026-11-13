import { apiClient } from './client';

export interface PeriodoEscolarDto {
  id: string;
  nombrePeriodoEscolar: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

export interface CreatePeriodoEscolarDto {
  nombrePeriodoEscolar: string;
  fechaInicio: string;
  fechaFin: string;
  activo?: boolean;
}

export type PeriodoEscolarFilterParams = {
  activo?: boolean;
};

export interface FeriadoDto {
  id: string;
  idPeriodoEscolar: string;
  idTipoEvento: string;
  tipoEventoCodigo: string;
  tipoEventoNombre: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

export interface CreateFeriadoDto {
  idPeriodoEscolar: string;
  idTipoEvento: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activo?: boolean;
}

export type FeriadoFilterParams = {
  idPeriodoEscolar?: string;
  idTipoEvento?: string;
  activo?: boolean;
};

export interface InstanciaAcademicaDto {
  id: string;
  idPeriodoEscolar: string;
  nombrePeriodoEscolar: string;
  idDetallePlanAcademico: string;
  planCodigo: string;
  cicloNombre: string;
  periodoNombre: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

export interface CreateInstanciaDto {
  idPeriodoEscolar: string;
  idDetallePlanAcademico: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activo?: boolean;
}

export type InstanciaAcademicaFilterParams = {
  idPeriodoEscolar?: string;
  idPlanAcademico?: string;
  activo?: boolean;
};

export interface GrupoDto {
  id: string;
  idInstanciaAcademica: string;
  instanciaNombre: string;
  codigo: string;
  nombre: string;
  cupo: number;
  activo: boolean;
}

export interface CreateGrupoDto {
  idInstanciaAcademica: string;
  codigo: string;
  nombre: string;
  cupo: number;
  activo?: boolean;
}

export type GrupoFilterParams = {
  idInstanciaAcademica?: string;
  activo?: boolean;
};

export interface MateriaPorGrupoDto {
  id: string;
  idGrupo: string;
  grupoCodigo: string;
  idMallaCurricular: string;
  idMateria: string;
  materiaCodigo: string;
  materiaNombre: string;
  idDocente: string;
  docenteNombreCompleto: string;
  cupoLimite: number;
  totalInscritos: number;
  activo: boolean;
}

export interface CreateMateriaPorGrupoDto {
  idGrupo: string;
  idMallaCurricular: string;
  idDocente: string;
  cupoLimite: number;
  activo?: boolean;
}

export type MateriaPorGrupoFilterParams = {
  idGrupo?: string;
  idDocente?: string;
  activo?: boolean;
};

export interface CalendarioSemanalDto {
  id: string;
  idMateriaPorGrupo: string;
  idAula: string;
  aulaCodigo: string;
  aulaNombre: string;
  idDia: number;
  diaNombre: string;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
}

export interface CreateCalendarioSemanalDto {
  idMateriaPorGrupo: string;
  idAula: string;
  idDia: number;
  horaInicio: string;
  horaFin: string;
  activo?: boolean;
}

export type CalendarioSemanalFilterParams = {
  idMateriaPorGrupo: string;
  activo?: boolean;
};

export interface SesionCalendarioDto {
  id: string;
  idMateriaPorGrupo: string;
  idAula: string;
  aulaCodigo: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  estadoAsistencia?: string | null;
}

export interface CreateCalendarioDto {
  idMateriaPorGrupo: string;
  idAula: string;
  fechaInicio: string;
  fechaFin: string;
  activo?: boolean;
}

export type SesionCalendarioFilterParams = {
  idMateriaPorGrupo?: string;
  fecha?: string;
  activo?: boolean;
};

export interface InscripcionGrupoDto {
  id: string;
  idMateriaPorGrupo: string;
  idEstudiante: string;
  codigoUnico: string;
  carnet: string;
  nombres: string;
  primerApellido: string;
  segundoApellido?: string | null;
  fechaInscripcion: string;
  activo: boolean;
}

export interface CreateInscripcionGrupoDto {
  idMateriaPorGrupo: string;
  idEstudiante: string;
  fechaInscripcion?: string;
  activo?: boolean;
}

export type InscripcionGrupoFilterParams = {
  idMateriaPorGrupo: string;
  idEstudiante?: string;
  activo?: boolean;
};

export const listarPeriodosEscolares = (params?: PeriodoEscolarFilterParams): Promise<PeriodoEscolarDto[]> => {
  return apiClient.get<PeriodoEscolarDto[]>('/periodos-escolares', params);
};

export const crearPeriodoEscolar = (data: CreatePeriodoEscolarDto): Promise<PeriodoEscolarDto> => {
  return apiClient.post<PeriodoEscolarDto>('/periodos-escolares', data);
};

export const listarFeriados = (params?: FeriadoFilterParams): Promise<FeriadoDto[]> => {
  return apiClient.get<FeriadoDto[]>('/feriados', params);
};

export const crearFeriado = (data: CreateFeriadoDto): Promise<FeriadoDto> => {
  return apiClient.post<FeriadoDto>('/feriados', data);
};

export const listarInstanciasAcademicas = (params?: InstanciaAcademicaFilterParams): Promise<InstanciaAcademicaDto[]> => {
  return apiClient.get<InstanciaAcademicaDto[]>('/instancias-academicas', params);
};

export const crearInstanciaAcademica = (data: CreateInstanciaDto): Promise<InstanciaAcademicaDto> => {
  return apiClient.post<InstanciaAcademicaDto>('/instancias-academicas', data);
};

export const listarGrupos = (params?: GrupoFilterParams): Promise<GrupoDto[]> => {
  return apiClient.get<GrupoDto[]>('/grupos', params);
};

export const crearGrupo = (data: CreateGrupoDto): Promise<GrupoDto> => {
  return apiClient.post<GrupoDto>('/grupos', data);
};

export const listarMateriasPorGrupo = (params?: MateriaPorGrupoFilterParams): Promise<MateriaPorGrupoDto[]> => {
  return apiClient.get<MateriaPorGrupoDto[]>('/materias-por-grupo', params);
};

export const crearMateriaPorGrupo = (data: CreateMateriaPorGrupoDto): Promise<MateriaPorGrupoDto> => {
  return apiClient.post<MateriaPorGrupoDto>('/materias-por-grupo', data);
};

export const listarCalendarioSemanal = (params?: CalendarioSemanalFilterParams): Promise<CalendarioSemanalDto[]> => {
  return apiClient.get<CalendarioSemanalDto[]>('/calendarios-semanales', params);
};

export const crearCalendarioSemanal = (data: CreateCalendarioSemanalDto): Promise<CalendarioSemanalDto> => {
  return apiClient.post<CalendarioSemanalDto>('/calendarios-semanales', data);
};

export const actualizarCalendarioSemanal = (
  id: string,
  data: Partial<CreateCalendarioSemanalDto>
): Promise<CalendarioSemanalDto> => {
  return apiClient.put<CalendarioSemanalDto>(`/calendarios-semanales/${id}`, data);
};

export const eliminarCalendarioSemanal = (id: string): Promise<void> => {
  return apiClient.delete<void>(`/calendarios-semanales/${id}`);
};

export const listarSesionesCalendario = (params?: SesionCalendarioFilterParams): Promise<SesionCalendarioDto[]> => {
  return apiClient.get<SesionCalendarioDto[]>('/calendarios', params);
};

export const listarInscripcionesPorCurso = (params: InscripcionGrupoFilterParams): Promise<InscripcionGrupoDto[]> => {
  return apiClient.get<InscripcionGrupoDto[]>('/inscripciones-grupo', params);
};

export const crearInscripcionGrupo = (data: CreateInscripcionGrupoDto): Promise<InscripcionGrupoDto> => {
  return apiClient.post<InscripcionGrupoDto>('/inscripciones-grupo', data);
};

export const eliminarInscripcionGrupo = (id: string): Promise<void> => {
  return apiClient.delete<void>(`/inscripciones-grupo/${id}`);
};
