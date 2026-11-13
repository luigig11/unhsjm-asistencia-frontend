import React from 'react';

export interface StudentPrintItem {
  id?: string;
  codigo_unico: string;
  carnet?: string;
  nombre: string;
  estado: 'Presente' | 'Ausente' | 'Justificada' | 'Pendiente';
  motivo?: string;
}

export interface ActaPdfTemplateProps {
  id?: string;
  materiaNombre: string;
  materiaCodigo: string;
  docenteTitular: string;
  docenteSustituto?: string;
  motivoSustituto?: string;
  grupo: string;
  aula: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estadoActa?: string;
  estudiantes: StudentPrintItem[];
}

export const ActaAsistenciaPdfTemplate: React.FC<ActaPdfTemplateProps> = ({
  materiaNombre,
  docenteTitular,
  docenteSustituto,
  motivoSustituto,
  grupo,
  aula,
  fecha,
  horaInicio,
  horaFin,
  estudiantes,
}) => {
  const totalEstudiantes = estudiantes.length;
  const presentesCount = estudiantes.filter((e) => e.estado === 'Presente').length;
  const ausentesCount = estudiantes.filter((e) => e.estado === 'Ausente').length;
  const justificadasCount = estudiantes.filter((e) => e.estado === 'Justificada').length;
  const porcentaje = totalEstudiantes > 0 ? Math.round((presentesCount / totalEstudiantes) * 100) : 0;

  const fechaImpresion = new Date().toLocaleDateString('es-NI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div id="printable-acta" className="bg-white text-[#0F172A] p-6 max-w-[850px] mx-auto text-left font-sans">
      <div className="border-b-2 border-[#0F3C6E] pb-4 mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 shrink-0 flex items-center justify-center border border-[#CBD5E1] rounded p-1 bg-white">
            <img
              src="/Logos/Logo_Color_Sin_Letras.png"
              alt="UNHSJM"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#0F3C6E] tracking-tight uppercase leading-snug">
              Universidad Nacional Héroes San José de las Mulas
            </h1>
            <p className="text-xs font-semibold text-[#475569]">
              Dirección de Ciencias Básicas y Tecnologías · Turno Dominical
            </p>
            <p className="text-[11px] font-bold text-[#1D63B8] uppercase tracking-wider mt-0.5">
              Acta Oficial de Pase de Lista y Control de Asistencia
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 border-l border-[#E2E8F0] pl-4">
          <p className="text-[10px] uppercase font-semibold text-[#64748B]">Documento Oficial</p>
          <p className="text-xs font-bold text-[#0F3C6E]">Ciclo Lectivo 2026</p>
          <p className="text-[10px] text-[#64748B] mt-0.5">UNHSJM</p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md p-3.5 mb-5 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4">
          <div>
            <p className="text-[10px] uppercase font-semibold text-[#64748B]">Asignatura / Clase</p>
            <p className="font-bold text-[#0F172A] leading-tight">{materiaNombre || '—'}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-semibold text-[#64748B]">Docente Titular</p>
            <p className="font-bold text-[#0F172A] leading-tight">{docenteTitular || '—'}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-semibold text-[#64748B]">Grupo Académico</p>
            <p className="font-bold text-[#0F172A] leading-tight">Grupo {grupo || '—'}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-semibold text-[#64748B]">Aula Asignada</p>
            <p className="font-bold text-[#0F172A] leading-tight">{aula || '—'}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-semibold text-[#64748B]">Horario de Clase</p>
            <p className="font-mono font-bold text-[#0F172A] leading-tight">{horaInicio} - {horaFin}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-semibold text-[#64748B]">Fecha de Sesión</p>
            <p className="font-bold text-[#0F172A] capitalize leading-tight">{fecha || '—'}</p>
          </div>
        </div>

        {docenteSustituto && (
          <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
            <p className="text-[#92400E]">
              <span className="font-bold">Docente Sustituto:</span> {docenteSustituto}
            </p>
            {motivoSustituto && (
              <p className="text-[#64748B]">
                <span className="font-semibold">Incidencia:</span> {motivoSustituto}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 mb-5">
        <div className="border border-[#BBF7D0] bg-[#F0FDF4] rounded p-2 text-center">
          <p className="text-[10px] uppercase font-bold text-[#166534]">Asistencias</p>
          <p className="text-xl font-extrabold text-[#15803D]">{presentesCount}</p>
        </div>

        <div className="border border-[#FECACA] bg-[#FEF2F2] rounded p-2 text-center">
          <p className="text-[10px] uppercase font-bold text-[#991B1B]">Inasistencias</p>
          <p className="text-xl font-extrabold text-[#C81E2B]">{ausentesCount}</p>
        </div>

        <div className="border border-[#FDE68A] bg-[#FFFBEB] rounded p-2 text-center">
          <p className="text-[10px] uppercase font-bold text-[#92400E]">Justificaciones</p>
          <p className="text-xl font-extrabold text-[#D97706]">{justificadasCount}</p>
        </div>

        <div className="border border-[#BFDBFE] bg-[#EFF6FF] rounded p-2 text-center">
          <p className="text-[10px] uppercase font-bold text-[#1E40AF]">Asistencia Total</p>
          <p className="text-xl font-extrabold text-[#1D63B8]">{porcentaje}%</p>
        </div>
      </div>

      <div className="border border-[#CBD5E1] rounded-md overflow-hidden mb-8">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0F3C6E] text-white">
              <th className="py-2 px-2.5 font-bold w-10 text-center border-r border-[#1D63B8]">#</th>
              <th className="py-2 px-2.5 font-bold w-28 border-r border-[#1D63B8]">Código Único</th>
              <th className="py-2 px-2.5 font-bold w-24 border-r border-[#1D63B8]">Carnet</th>
              <th className="py-2 px-3 font-bold">Apellidos y Nombres</th>
              <th className="py-2 px-3 font-bold w-32 text-center border-l border-[#1D63B8]">Estado</th>
              <th className="py-2 px-3 font-bold w-48 border-l border-[#1D63B8]">Motivo / Justificación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {estudiantes.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-[#94A3B8]">
                  No hay estudiantes registrados para esta sesión.
                </td>
              </tr>
            ) : (
              estudiantes.map((est, idx) => {
                const isP = est.estado === 'Presente';
                const isJ = est.estado === 'Justificada';
                const isA = est.estado === 'Ausente';

                return (
                  <tr key={est.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                    <td className="py-2 px-2.5 text-center font-mono text-[#64748B] border-r border-[#E2E8F0]">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-2.5 font-mono font-bold text-[#0F3C6E] border-r border-[#E2E8F0]">
                      {est.codigo_unico}
                    </td>
                    <td className="py-2 px-2.5 font-mono text-[#475569] border-r border-[#E2E8F0]">
                      {est.carnet || '—'}
                    </td>
                    <td className="py-2 px-3 font-bold text-[#0F172A]">
                      {est.nombre}
                    </td>
                    <td className="py-2 px-3 text-center border-l border-[#E2E8F0]">
                      {isP && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                          PRESENTE
                        </span>
                      )}
                      {isJ && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
                          JUSTIFICADA
                        </span>
                      )}
                      {isA && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEF2F2] text-[#C81E2B] border border-[#FECACA]">
                          AUSENTE
                        </span>
                      )}
                      {!isP && !isJ && !isA && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]">
                          PENDIENTE
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-[11px] text-[#475569] border-l border-[#E2E8F0]">
                      {est.motivo ? (
                        <span className="font-medium text-[#92400E]">{est.motivo}</span>
                      ) : (
                        <span className="text-[#94A3B8]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-8 mt-8 border-t border-[#CBD5E1]">
        <div className="grid grid-cols-2 gap-12 text-center text-xs">
          <div>
            <div className="border-b border-[#0F172A] w-4/5 mx-auto mb-2 pb-8"></div>
            <p className="font-bold text-[#0F172A]">{docenteTitular}</p>
            <p className="text-[11px] text-[#64748B]">Docente Titular Asignado</p>
          </div>

          <div>
            <div className="border-b border-[#0F172A] w-4/5 mx-auto mb-2 pb-8"></div>
            <p className="font-bold text-[#0F172A]">Registro y Control Académico</p>
            <p className="text-[11px] text-[#64748B]">Sello y Validación Institucional UNHSJM</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#94A3B8]">
        <p>Sistema de Control de Asistencia y Gestión Académica · UNHSJM</p>
        <p>Fecha de emisión: {fechaImpresion}</p>
      </div>

      <style>
        {`
          @media print {
            @page {
              size: portrait;
              margin: 10mm 12mm;
            }
            body {
              background: white !important;
              color: black !important;
            }
            body * {
              visibility: hidden;
            }
            #printable-acta,
            #printable-acta * {
              visibility: visible;
            }
            #printable-acta {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              max-width: none !important;
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
              border: none !important;
            }
            tr {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            th, td {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `}
      </style>
    </div>
  );
};
