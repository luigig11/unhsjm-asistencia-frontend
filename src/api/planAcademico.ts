import { apiClient } from './client';

export type PlanFilterParams = {
  idDireccion?: string;
  idCarrera?: string;
  idModalidad?: string;
  idCentroUniversitario?: string;
  activo?: boolean;
};

export interface PlanItemDto {
  id: string;
  codigo: string;
  nombre: string;
  idCentroUniversitario: string;
  centroNombre: string;
  idCarrera: string;
  carreraNombre: string;
  idTipoPeriodoAcademico: string;
  tipoPeriodoNombre: string;
  idModalidad: string;
  modalidadNombre: string;
  cantidadCicloAcademico: number;
  cantidadPeriodoAcademico: number;
  activoDesde: string;
  activoHasta?: string | null;
  activo: boolean;
}

export interface PlanDetalleDto {
  id: string;
  codigo: string;
  nombre: string;
  idCentroUniversitario: string;
  idCarrera: string;
  idTipoPeriodoAcademico: string;
  idModalidad: string;
  cantidadCicloAcademico: number;
  cantidadPeriodoAcademico: number;
  activoDesde: string;
  activoHasta?: string | null;
  activo: boolean;
}

export interface CreatePlanAcademicoDto {
  idCentroUniversitario: string;
  idCarrera: string;
  idTipoPeriodoAcademico: string;
  idModalidad: string;
  codigo: string;
  nombre: string;
  cantidadCicloAcademico: number;
  cantidadPeriodoAcademico: number;
  activoDesde: string;
  activoHasta?: string | null;
  activo?: boolean;
}

export interface UpdatePlanAcademicoDto {
  idCentroUniversitario: string;
  idCarrera: string;
  idTipoPeriodoAcademico: string;
  idModalidad: string;
  codigo: string;
  nombre: string;
  cantidadCicloAcademico: number;
  cantidadPeriodoAcademico: number;
  activoDesde: string;
  activoHasta?: string | null;
  activo: boolean;
}

export interface PrerequisitoMallaDto {
  id: string;
  idMallaCurricularMateriaPrerequisito: string;
  materiaCodigo: string;
  materiaNombre: string;
}

export interface MateriaMallaDto {
  idMallaCurricular: string;
  idMateria: string;
  materiaCodigo: string;
  materiaNombre: string;
  creditos: number;
  cantidadHorasMateria: number;
  encuentrosTotales: number;
  encuentrosPorSemana: number;
  obligatoria: boolean;
  activo: boolean;
  prerequisitos: PrerequisitoMallaDto[];
}

export interface BloqueMallaDto {
  idDetallePlanAcademico: string;
  idPeriodoAcademico: string;
  periodoNombre: string;
  ordenPeriodo: number;
  duracionSemanas: number;
  duracionMeses: number;
  idDetallePredecesor?: string | null;
  materias: MateriaMallaDto[];
}

export interface CicloMallaDto {
  idCicloAcademico: string;
  cicloNombre: string;
  ordenCiclo: number;
  bloques: BloqueMallaDto[];
}

export interface PlanResumenMallaDto {
  id: string;
  codigo: string;
  nombre: string;
  carreraNombre: string;
  modalidadNombre: string;
}

export interface MallaCompletaDto {
  plan: PlanResumenMallaDto;
  ciclos: CicloMallaDto[];
}

export interface DetallePlanDto {
  id: string;
  idPlanAcademico: string;
  idCicloAcademico: string;
  cicloNombre: string;
  idPeriodoAcademico: string;
  periodoNombre: string;
  duracionSemanas: number;
  duracionMeses: number;
  idDetallePredecesor?: string | null;
  activo: boolean;
}

export interface CreateDetallePlanDto {
  idPlanAcademico: string;
  idCicloAcademico: string;
  idPeriodoAcademico: string;
  duracionSemanas: number;
  duracionMeses: number;
  idDetallePredecesor?: string | null;
  activo?: boolean;
}

export interface CreateMallaCurricularDto {
  idDetallePlanAcademico: string;
  idMateria: string;
  encuentrosTotales: number;
  encuentrosPorSemana: number;
  cantidadHorasMateria: number;
  creditos: number;
  obligatoria?: boolean;
  activo?: boolean;
  idsMallaPrerequisitos?: string[];
}

export const listarPlanes = (params?: PlanFilterParams): Promise<PlanItemDto[]> => {
  return apiClient.get<PlanItemDto[]>('/planes-academicos', params);
};

export const obtenerPlanPorId = (id: string): Promise<PlanDetalleDto> => {
  return apiClient.get<PlanDetalleDto>(`/planes-academicos/${id}`);
};

export const obtenerMallaCompleta = (id: string): Promise<MallaCompletaDto> => {
  return apiClient.get<MallaCompletaDto>(`/planes-academicos/${id}/malla-completa`);
};

export const crearPlanAcademico = (data: CreatePlanAcademicoDto): Promise<PlanDetalleDto> => {
  return apiClient.post<PlanDetalleDto>('/planes-academicos', data);
};
