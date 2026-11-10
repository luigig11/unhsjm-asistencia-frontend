import React, { useState } from 'react';
import { CurriculumHeader } from '../components/curriculum/CurriculumHeader';
import { CurriculumKanban } from '../components/curriculum/CurriculumKanban';
import { ModalMallaCurricular } from '../components/curriculum/ModalMallaCurricular';
import type { CicloAcademicoGroup } from '../components/curriculum/CurriculumKanban';
import type { SubjectMalla } from '../components/curriculum/SubjectCard';

// Malla Curricular oficial para ISI (Primer Año: I y II Semestre)
const INITIAL_CICLOS: CicloAcademicoGroup[] = [
  {
    id: 'ciclo-1',
    ciclo_nombre: 'Primer Año — Formación Básica e Introductoria',
    orden: 1,
    bloques: [
      {
        id: 'b-sem-1',
        nombre: 'I Semestre',
        duracion_semanas: 16,
        duracion_meses: 6,
        materias: [
          {
            id: 'm-1',
            materia_id: 'mat-ing-tec',
            codigo: 'ING-101',
            nombre: 'Inglés Técnico',
            creditos: 3,
            cantidad_horas_materia: 48,
            encuentros_totales: 16,
            encuentros_por_semana: 1,
            obligatoria: true,
            prerequisitos: [],
          },
          {
            id: 'm-2',
            materia_id: 'mat-fts',
            codigo: 'FTS-101',
            nombre: 'Fundamentos de Tecnología y Sistemas',
            creditos: 4,
            cantidad_horas_materia: 64,
            encuentros_totales: 16,
            encuentros_por_semana: 1,
            obligatoria: true,
            prerequisitos: [],
          },
          {
            id: 'm-3',
            materia_id: 'mat-mat-intro',
            codigo: 'MAT-100',
            nombre: 'Matemática Introductoria',
            creditos: 4,
            cantidad_horas_materia: 64,
            encuentros_totales: 16,
            encuentros_por_semana: 1,
            obligatoria: true,
            prerequisitos: [],
          },
          {
            id: 'm-4',
            materia_id: 'mat-tec-com',
            codigo: 'COM-101',
            nombre: 'Técnicas y Estrategias de Comunicación',
            creditos: 3,
            cantidad_horas_materia: 48,
            encuentros_totales: 16,
            encuentros_por_semana: 1,
            obligatoria: true,
            prerequisitos: [],
          },
          {
            id: 'm-5',
            materia_id: 'mat-filo',
            codigo: 'HUM-101',
            nombre: 'Filosofía',
            creditos: 3,
            cantidad_horas_materia: 48,
            encuentros_totales: 16,
            encuentros_por_semana: 1,
            obligatoria: true,
            prerequisitos: [],
          },
          {
            id: 'm-6',
            materia_id: 'mat-hist-nic',
            codigo: 'HUM-102',
            nombre: 'Historia de Nicaragua',
            creditos: 3,
            cantidad_horas_materia: 48,
            encuentros_totales: 16,
            encuentros_por_semana: 1,
            obligatoria: true,
            prerequisitos: [],
          },
        ],
      },
      {
        id: 'b-sem-2',
        nombre: 'II Semestre',
        duracion_semanas: 16,
        duracion_meses: 6,
        bloque_predecesor: 'I Semestre',
        materias: [
          {
            id: 'm-7',
            materia_id: 'mat-fund-prog',
            codigo: 'PROG-101',
            nombre: 'Fundamentos de Programación',
            creditos: 4,
            cantidad_horas_materia: 64,
            encuentros_totales: 16,
            encuentros_por_semana: 1,
            obligatoria: true,
            prerequisitos: ['FTS-101'],
          },
          {
            id: 'm-8',
            materia_id: 'mat-intro-elec',
            codigo: 'ELC-101',
            nombre: 'Introducción a la Electrónica',
            creditos: 4,
            cantidad_horas_materia: 64,
            encuentros_totales: 16,
            encuentros_por_semana: 1,
            obligatoria: true,
            prerequisitos: ['MAT-100'],
          },
          {
            id: 'm-9',
            materia_id: 'mat-calc-1',
            codigo: 'MAT-101',
            nombre: 'Cálculo I',
            creditos: 4,
            cantidad_horas_materia: 64,
            encuentros_totales: 16,
            encuentros_por_semana: 1,
            obligatoria: true,
            prerequisitos: ['MAT-100'],
          },
          {
            id: 'm-10',
            materia_id: 'mat-comp-red',
            codigo: 'COM-102',
            nombre: 'Composición y Redacción Técnica',
            creditos: 3,
            cantidad_horas_materia: 48,
            encuentros_totales: 16,
            encuentros_por_semana: 1,
            obligatoria: true,
            prerequisitos: ['COM-101'],
          },
          {
            id: 'm-11',
            materia_id: 'mat-cur-int',
            codigo: 'CLI-101',
            nombre: 'Curso Libre de Integración',
            creditos: 2,
            cantidad_horas_materia: 32,
            encuentros_totales: 16,
            encuentros_por_semana: 1,
            obligatoria: false,
            prerequisitos: [],
          },
          {
            id: 'm-12',
            materia_id: 'mat-cur-hum-1',
            codigo: 'CLH-101',
            nombre: 'Curso Libre General y Humanístico I',
            creditos: 2,
            cantidad_horas_materia: 32,
            encuentros_totales: 16,
            encuentros_por_semana: 1,
            obligatoria: false,
            prerequisitos: [],
          },
        ],
      },
    ],
  },
];

interface Pantalla06ConstructorMallaProps {
  onBackToPlans?: () => void;
}

export const Pantalla06ConstructorMalla: React.FC<Pantalla06ConstructorMallaProps> = ({
  onBackToPlans,
}) => {
  const [ciclos, setCiclos] = useState<CicloAcademicoGroup[]>(INITIAL_CICLOS);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [targetBloqueId, setTargetBloqueId] = useState<string>('');
  const [editingSubject, setEditingSubject] = useState<SubjectMalla | null>(null);

  // Abrir Modal A para agregar una nueva asignatura a un bloque
  const handleOpenAddModal = (bloqueId: string) => {
    setTargetBloqueId(bloqueId);
    setEditingSubject(null);
    setModalOpen(true);
  };

  // Abrir Modal A para editar una asignatura existente
  const handleOpenEditModal = (subject: SubjectMalla) => {
    setEditingSubject(subject);
    setModalOpen(true);
  };

  // Guardar asignatura desde el Modal A
  const handleSaveSubject = (data: Partial<SubjectMalla>) => {
    if (editingSubject) {
      // Edición de materia existente
      setCiclos((prev) =>
        prev.map((c) => ({
          ...c,
          bloques: c.bloques.map((b) => ({
            ...b,
            materias: b.materias.map((m) =>
              m.id === editingSubject.id ? ({ ...m, ...data } as SubjectMalla) : m
            ),
          })),
        }))
      );
    } else {
      // Creación de nueva materia en targetBloqueId
      setCiclos((prev) =>
        prev.map((c) => ({
          ...c,
          bloques: c.bloques.map((b) => {
            if (b.id === targetBloqueId) {
              return {
                ...b,
                materias: [...b.materias, data as SubjectMalla],
              };
            }
            return b;
          }),
        }))
      );
    }
  };

  // Contadores totales para el header
  const totalCiclos = ciclos.length;
  const totalTrimestres = ciclos.reduce((acc, c) => acc + c.bloques.length, 0);
  const totalMaterias = ciclos.reduce(
    (acc, c) => acc + c.bloques.reduce((subAcc, b) => subAcc + b.materias.length, 0),
    0
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* Cabecera Fija del Plan Académico */}
      <CurriculumHeader
        planCodigo="ISI-2026"
        carreraNombre="Ingeniería en Sistemas de Información"
        modalidad="Regular / Diurna"
        totalCiclos={totalCiclos}
        totalTrimestres={totalTrimestres}
        totalMaterias={totalMaterias}
        vigencia="2026 — 2030"
        onBackToPlans={onBackToPlans}
      />

      {/* Constructor Kanban Visual organizado por Años y Períodos */}
      <CurriculumKanban
        ciclos={ciclos}
        onAddSubjectToBloque={handleOpenAddModal}
        onEditSubject={handleOpenEditModal}
      />

      {/* Modal A - Asignatura en Malla Curricular */}
      <ModalMallaCurricular
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSubject}
        initialData={editingSubject}
        bloqueNombre={
          editingSubject
            ? 'Editar Asignatura'
            : targetBloqueId
            ? 'Nuevo Registro'
            : 'Período'
        }
      />
    </div>
  );
};
