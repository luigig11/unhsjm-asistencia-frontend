import { apiClient } from './client';

export interface SesionDetalleActa {
  id_calendario: string;
  id_materia_por_grupo: string;
  materia_codigo: string;
  materia_nombre: string;
  grupo_codigo: string;
  aula_codigo: string;
  docente_titular_nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface CabeceraAsistenciaActa {
  id?: string;
  docente_asignado_asistio?: boolean;
  id_docente_sustituto?: string;
  docente_sustituto_nombre?: string;
  id_motivo_ausencia?: string;
  fecha_registro_docente?: string;
}

export interface EstudianteActaItem {
  id_asistencia_detalle?: string;
  id_inscripcion_grupo: string;
  id_estudiante: string;
  codigo_unico: string;
  carnet: string;
  nombre_completo: string;
  asistio: boolean;
  id_motivo_ausencia?: string;
  fecha_registro_estudiante?: string;
}

export interface ActaAsistenciaSesion {
  sesion: SesionDetalleActa;
  cabecera_asistencia: CabeceraAsistenciaActa;
  estudiantes: EstudianteActaItem[];
}

export interface DetalleGuardarAsistenciaDto {
  id_inscripcion_grupo: string;
  asistio: boolean;
  id_motivo_ausencia?: string;
}

export interface GuardarActaAsistenciaDto {
  docente_asignado_asistio: boolean;
  id_docente_sustituto?: string;
  id_motivo_ausencia?: string;
  detalles: DetalleGuardarAsistenciaDto[];
}

export interface ResumenGuardarActa {
  presentes: number;
  ausentes: number;
  justificados: number;
}

export interface ResultadoGuardarActa {
  id_asistencia: string;
  id_calendario: string;
  docente_asignado_asistio: boolean;
  id_docente_sustituto?: string;
  id_motivo_ausencia?: string;
  fecha_registro_docente: string;
  resumen: ResumenGuardarActa;
}

export interface UpdateAsistenciaDetalleDto {
  asistio: boolean;
  id_motivo_ausencia?: string;
}

export interface AsistenciaDetalleActualizado {
  id: string;
  id_asistencia: string;
  id_inscripcion_grupo: string;
  asistio: boolean;
  id_motivo_ausencia?: string;
  fecha_registro_estudiante?: string;
}

export interface CursoSabana {
  id_materia_por_grupo: string;
  materia_codigo: string;
  materia_nombre: string;
  grupo_codigo: string;
  docente_nombre: string;
  instancia_nombre: string;
}

export interface SesionColumna {
  id_calendario: string;
  numero_encuentro: number;
  fecha_inicio: string;
  acta_registrada: boolean;
}

export interface MarcajeEstudiante {
  id_calendario: string;
  estado: 'P' | 'A' | 'J' | 'PENDIENTE';
  motivo_ausencia_nombre?: string;
  fecha_registro_estudiante?: string;
}

export interface EstadisticasAlumno {
  total_presentes: number;
  total_ausentes_injustificados: number;
  total_justificados: number;
  porcentaje_asistencia: number;
  alerta_riesgo: 'VERDE' | 'AMARILLO' | 'ROJO';
}

export interface AlumnoFilaSabana {
  id_inscripcion_grupo: string;
  id_estudiante: string;
  codigo_unico: string;
  carnet: string;
  nombre_completo: string;
  marcajes: MarcajeEstudiante[];
  estadisticas: EstadisticasAlumno;
}

export interface SabanaAsistencia {
  curso: CursoSabana;
  sesiones_columnas: SesionColumna[];
  alumnos_filas: AlumnoFilaSabana[];
}

export const obtenerActaAsistenciaSesion = async (
  idCalendario: string
): Promise<ActaAsistenciaSesion> => {
  return apiClient.get<ActaAsistenciaSesion>(`calendarios/${idCalendario}/acta-asistencia`);
};

export const guardarActaAsistenciaSesion = async (
  idCalendario: string,
  dto: GuardarActaAsistenciaDto
): Promise<ResultadoGuardarActa> => {
  return apiClient.put<ResultadoGuardarActa>(`calendarios/${idCalendario}/acta-asistencia`, dto);
};

export const actualizarAsistenciaEstudianteIndividual = async (
  idDetalle: string,
  dto: UpdateAsistenciaDetalleDto
): Promise<AsistenciaDetalleActualizado> => {
  return apiClient.patch<AsistenciaDetalleActualizado>(`asistencias-detalle/${idDetalle}`, dto);
};

export const eliminarActaAsistencia = async (
  idAsistencia: string
): Promise<void> => {
  return apiClient.delete<void>(`asistencias/${idAsistencia}`);
};

export const obtenerSabanaAsistenciaGrupo = async (
  idMateriaPorGrupo: string
): Promise<SabanaAsistencia> => {
  return apiClient.get<SabanaAsistencia>(`materias-por-grupo/${idMateriaPorGrupo}/sabana-asistencia`);
};
