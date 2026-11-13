import { apiClient } from './client';

export interface SesionDetalleActa {
  idCalendario?: string;
  id_calendario?: string;
  idMateriaPorGrupo?: string;
  id_materia_por_grupo?: string;
  materiaCodigo?: string;
  materia_codigo?: string;
  materiaNombre?: string;
  materia_nombre?: string;
  grupoCodigo?: string;
  grupo_codigo?: string;
  aulaCodigo?: string;
  aula_codigo?: string;
  aulaNombre?: string;
  aula_nombre?: string;
  docenteTitularNombre?: string;
  docente_titular_nombre?: string;
  fechaInicio?: string;
  fecha_inicio?: string;
  fechaFin?: string;
  fecha_fin?: string;
}

export interface CabeceraAsistenciaActa {
  id?: string;
  docenteAsignadoAsistio?: boolean;
  docente_asignado_asistio?: boolean;
  idDocenteSustituto?: string;
  id_docente_sustituto?: string;
  docenteSustitutoNombre?: string;
  docente_sustituto_nombre?: string;
  idMotivoAusencia?: string;
  id_motivo_ausencia?: string;
  fechaRegistroDocente?: string;
  fecha_registro_docente?: string;
}

export interface EstudianteActaItem {
  idAsistenciaDetalle?: string;
  id_asistencia_detalle?: string;
  idInscripcionGrupo?: string;
  id_inscripcion_grupo?: string;
  idEstudiante?: string;
  id_estudiante?: string;
  codigoUnico?: string;
  codigo_unico?: string;
  carnet: string;
  nombreCompleto?: string;
  nombre_completo?: string;
  asistio: boolean;
  idMotivoAusencia?: string;
  id_motivo_ausencia?: string;
  fechaRegistroEstudiante?: string;
  fecha_registro_estudiante?: string;
}

export interface ActaAsistenciaSesion {
  sesion: SesionDetalleActa;
  cabeceraAsistencia?: CabeceraAsistenciaActa;
  cabecera_asistencia?: CabeceraAsistenciaActa;
  estudiantes: EstudianteActaItem[];
}

export interface DetalleGuardarAsistenciaDto {
  idInscripcionGrupo?: string;
  id_inscripcion_grupo?: string;
  asistio: boolean;
  idMotivoAusencia?: string;
  id_motivo_ausencia?: string;
}

export interface GuardarActaAsistenciaDto {
  docenteAsignadoAsistio?: boolean;
  docente_asignado_asistio?: boolean;
  idDocenteSustituto?: string;
  id_docente_sustituto?: string;
  idMotivoAusencia?: string;
  id_motivo_ausencia?: string;
  detalles: DetalleGuardarAsistenciaDto[];
}

export interface ResumenGuardarActa {
  presentes: number;
  ausentes: number;
  justificados: number;
}

export interface ResultadoGuardarActa {
  id_asistencia?: string;
  idAsistencia?: string;
  id_calendario?: string;
  idCalendario?: string;
  docente_asignado_asistio?: boolean;
  docenteAsignadoAsistio?: boolean;
  id_docente_sustituto?: string;
  idDocenteSustituto?: string;
  id_motivo_ausencia?: string;
  idMotivoAusencia?: string;
  fecha_registro_docente?: string;
  fechaRegistroDocente?: string;
  resumen: ResumenGuardarActa;
}

export interface UpdateAsistenciaDetalleDto {
  asistio: boolean;
  id_motivo_ausencia?: string;
  idMotivoAusencia?: string;
}

export interface AsistenciaDetalleActualizado {
  id: string;
  id_asistencia?: string;
  idAsistencia?: string;
  id_inscripcion_grupo?: string;
  idInscripcionGrupo?: string;
  asistio: boolean;
  id_motivo_ausencia?: string;
  idMotivoAusencia?: string;
  fecha_registro_estudiante?: string;
  fechaRegistroEstudiante?: string;
}

export interface CursoSabana {
  id_materia_por_grupo?: string;
  idMateriaPorGrupo?: string;
  materia_codigo?: string;
  materiaCodigo?: string;
  materia_nombre?: string;
  materiaNombre?: string;
  grupo_codigo?: string;
  grupoCodigo?: string;
  docente_nombre?: string;
  docenteNombre?: string;
  instancia_nombre?: string;
  instanciaNombre?: string;
}

export interface SesionColumna {
  id_calendario?: string;
  idCalendario?: string;
  numero_encuentro?: number;
  numeroEncuentro?: number;
  fecha_inicio?: string;
  fechaInicio?: string;
  acta_registrada?: boolean;
  actaRegistrada?: boolean;
}

export interface MarcajeEstudiante {
  id_calendario?: string;
  idCalendario?: string;
  estado: 'P' | 'A' | 'J' | 'PENDIENTE';
  motivo_ausencia_nombre?: string;
  motivoAusenciaNombre?: string;
  fecha_registro_estudiante?: string;
  fechaRegistroEstudiante?: string;
}

export interface EstadisticasAlumno {
  total_presentes?: number;
  totalPresentes?: number;
  total_ausentes_injustificados?: number;
  totalAusentesInjustificados?: number;
  total_justificados?: number;
  totalJustificados?: number;
  porcentaje_asistencia?: number;
  porcentajeAsistencia?: number;
  alerta_riesgo?: 'VERDE' | 'AMARILLO' | 'ROJO';
  alertaRiesgo?: 'VERDE' | 'AMARILLO' | 'ROJO';
}

export interface AlumnoFilaSabana {
  id_inscripcion_grupo?: string;
  idInscripcionGrupo?: string;
  id_estudiante?: string;
  idEstudiante?: string;
  codigo_unico?: string;
  codigoUnico?: string;
  carnet: string;
  nombre_completo?: string;
  nombreCompleto?: string;
  marcajes: MarcajeEstudiante[];
  estadisticas: EstadisticasAlumno;
}

export interface SabanaAsistencia {
  curso: CursoSabana;
  sesiones_columnas?: SesionColumna[];
  sesionesColumnas?: SesionColumna[];
  alumnos_filas?: AlumnoFilaSabana[];
  alumnosFilas?: AlumnoFilaSabana[];
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
