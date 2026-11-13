import React from 'react';

export interface Group {
  id: string;
  materia: string;
  codigoMateria: string;
  grupo: string;
  docente: string;
  periodo: string;
  cupoLimite: number;
}

interface EnrollmentHeaderProps {
  groups: Group[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
  selectedGroup: Group;
  occupied: number;
  available: number;
  percentage: number;
}

export const EnrollmentHeader: React.FC<EnrollmentHeaderProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  selectedGroup,
  occupied,
  available,
  percentage,
}) => {
  return (
    <div className="space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Matrícula de Estudiantes
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Inscripción de estudiantes en asignaturas por grupo y control de capacidad máxima
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="select-grupo-enrollment" className="text-xs font-semibold text-[#475569]">
            Grupo:
          </label>
          <select
            id="select-grupo-enrollment"
            value={selectedGroupId}
            onChange={(e) => onSelectGroup(e.target.value)}
            className="h-9 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
          >
            {groups.length === 0 ? (
              <option value="">Sin grupos registrados</option>
            ) : (
              groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.grupo} — {g.materia}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-lg p-4 text-left space-y-2 shadow-sm">
          <span className="font-mono text-xs font-bold text-[#0F3C6E] bg-[#EBF3FC] px-2 py-0.5 rounded border border-[#1D63B8]/20">
            {selectedGroup.codigoMateria || 'N/A'}
          </span>
          <h2 className="text-sm font-bold text-[#0F172A] leading-snug">
            {selectedGroup.materia}
          </h2>
          <div className="text-xs text-[#64748B] space-y-0.5">
            <p>Docente: <span className="text-[#0F172A] font-medium">{selectedGroup.docente}</span></p>
            <p>Período: <span className="text-[#0F172A] font-medium">{selectedGroup.periodo}</span></p>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-lg p-4 text-left flex flex-col justify-between space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#0F172A]">Ocupación del Grupo</span>
            <span className="font-mono font-bold text-[#0F3C6E]">
              {occupied} / {selectedGroup.cupoLimite} inscritos
            </span>
          </div>

          <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden border border-[#E2E8F0]">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                percentage >= 90 ? 'bg-[#D97706]' : 'bg-[#0F3C6E]'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Disponibles: <strong className="text-[#0F172A]">{available}</strong></span>
            <span>Porcentaje: <strong className="text-[#0F172A]">{Math.round(percentage)}%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
