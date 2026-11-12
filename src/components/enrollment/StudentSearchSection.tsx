import React from 'react';
import { SearchIcon } from '../../components/common/Icons';

export interface Student {
  id: number;
  codigo_unico: string;
  nombre: string;
  carrera: string;
  activo: boolean;
}

interface StudentSearchSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  suggestions: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  onEnroll: () => void;
  feedback: string;
  isAvailable: boolean;
}

export const StudentSearchSection: React.FC<StudentSearchSectionProps> = ({
  search,
  onSearchChange,
  suggestions,
  selectedStudent,
  onSelectStudent,
  onEnroll,
  feedback,
  isAvailable,
}) => {
  return (
    <section className="bg-white border border-[#E2E8F0] rounded-lg p-4 sm:p-5 text-left space-y-4">
      <div>
        <h3 className="text-sm font-bold text-[#0F172A]">
          Inscribir Estudiante
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          Busca por nombre o código único (CETEC) para matricularlo con un clic
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
        <div className="relative">
          <label className="block text-xs font-semibold text-[#475569] mb-1">
            Buscar en el padrón de estudiantes
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
              <SearchIcon className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Escribe el nombre o código único..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1D63B8]"
            />
          </div>

          {/* Menú desplegable con sugerencias de autocompletado */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#CBD5E1] rounded-md shadow-md z-20 max-h-48 overflow-y-auto divide-y divide-[#E2E8F0]">
              {suggestions.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => onSelectStudent(student)}
                  className="w-full p-2.5 text-left text-xs hover:bg-[#EBF3FC] transition-colors cursor-pointer block"
                >
                  <p className="font-bold text-[#0F172A]">{student.nombre}</p>
                  <p className="font-mono text-[11px] text-[#64748B]">
                    {student.codigo_unico} · {student.carrera}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onEnroll}
          disabled={!selectedStudent || !isAvailable}
          className={`h-9 px-4 rounded-md text-xs font-semibold transition-colors shadow-xs cursor-pointer ${
            selectedStudent && isAvailable
              ? 'bg-[#0F3C6E] hover:bg-[#0A294D] text-white'
              : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed border border-[#CBD5E1]'
          }`}
        >
          Confirmar Inscripción
        </button>
      </div>

      {/* Tarjeta de estudiante seleccionado */}
      {selectedStudent && (
        <div className="p-3 bg-[#EBF3FC]/60 border border-[#1D63B8]/30 rounded-md text-xs flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold text-[#1D63B8] uppercase">
              Estudiante a inscribir:
            </span>
            <p className="font-bold text-[#0F172A]">{selectedStudent.nombre}</p>
            <p className="font-mono text-[11px] text-[#475569]">
              Código: {selectedStudent.codigo_unico} · {selectedStudent.carrera}
            </p>
          </div>
          <span className="text-[10px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#86EFAC]">
            Listo para matricular
          </span>
        </div>
      )}

      {/* Alerta de feedback */}
      {feedback && (
        <div
          className={`p-2.5 rounded-md text-xs border ${
            feedback.includes('registrada')
              ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
              : 'bg-[#FEF3C7] text-[#B45309] border-[#FCD34D]'
          }`}
        >
          {feedback}
        </div>
      )}
    </section>
  );
};
