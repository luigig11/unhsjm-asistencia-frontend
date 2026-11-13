import { apiClient } from './client';

export interface PeriodoActivoResumen {
  id: string;
  nombre: string;
}

export type EstadoActaSesion = 'PENDIENTE' | 'PRESENTE' | 'AUSENTE' | 'SUSTITUTO';

export interface SesionHoyDashboard {
  id_calendario: string;
  materia_nombre: string;
  grupo_codigo: string;
  aula_codigo: string;
  docente_nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado_acta: EstadoActaSesion;
}

export interface ProximoEventoDashboard {
  id_feriado: string;
  nombre: string;
  tipo_evento: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface DashboardResumen {
  periodo_escolar_activo?: PeriodoActivoResumen;
  total_grupos_ofertados: number;
  total_sesiones_hoy: number;
  alertas_ausencia_docente_hoy: number;
  sesiones_hoy: SesionHoyDashboard[];
  proximos_eventos: ProximoEventoDashboard[];
}

export interface DocenteSesionHoy {
  id_calendario?: string;
  idCalendario?: string;
  id_materia_por_grupo?: string;
  idMateriaPorGrupo?: string;
  materia_codigo?: string;
  materiaCodigo?: string;
  materia_nombre?: string;
  materiaNombre?: string;
  grupo_codigo?: string;
  grupoCodigo?: string;
  aula_codigo?: string;
  aulaCodigo?: string;
  aula_ubicacion?: string;
  aulaUbicacion?: string;
  fecha_inicio?: string;
  fechaInicio?: string;
  fecha_fin?: string;
  fechaFin?: string;
  id_asistencia?: string;
  idAsistencia?: string;
  acta_registrada?: boolean;
  actaRegistrada?: boolean;
  es_sustituto?: boolean;
  esSustituto?: boolean;
}

export interface DocenteCurso {
  id_materia_por_grupo: string;
  instancia_nombre: string;
  grupo_codigo: string;
  materia_codigo: string;
  materia_nombre: string;
  total_inscritos: number;
  cupo_limite: number;
}

export type DashboardFilterParams = {
  id_periodo_escolar?: string;
};

export type DocenteCursosParams = {
  id_instancia_academica?: string;
};

export const obtenerResumenDashboard = async (
  filtro?: DashboardFilterParams
): Promise<DashboardResumen> => {
  return apiClient.get<DashboardResumen>('dashboard/resumen', filtro);
};

export const obtenerAgendaHoyDocente = async (
  idDocente?: string
): Promise<DocenteSesionHoy[]> => {
  return apiClient.get<DocenteSesionHoy[]>(
    'docentes/me/sesiones-hoy',
    idDocente ? { idDocente } : undefined
  );
};

export const obtenerMisCursosDocente = async (
  filtro?: DocenteCursosParams
): Promise<DocenteCurso[]> => {
  return apiClient.get<DocenteCurso[]>('docentes/me/cursos', filtro);
};
