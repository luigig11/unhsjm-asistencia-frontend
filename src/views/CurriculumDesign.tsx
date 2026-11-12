import React, { useState } from 'react';
import { CurriculumHeader } from '../components/curriculum/CurriculumHeader';
import { CurriculumKanban } from '../components/curriculum/CurriculumKanban';
import { ModalMallaCurricular } from '../components/curriculum/ModalMallaCurricular';
import type { CicloAcademicoGroup } from '../components/curriculum/CurriculumKanban';
import type { SubjectMalla } from '../components/curriculum/SubjectCard';

interface CurriculumDesignProps {
  onBackToPlans?: () => void;
}

export const CurriculumDesign: React.FC<CurriculumDesignProps> = ({
  onBackToPlans,
}) => {
  const [ciclos, setCiclos] = useState<CicloAcademicoGroup[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [targetBloqueId, setTargetBloqueId] = useState<string>('');
  const [editingSubject, setEditingSubject] = useState<SubjectMalla | null>(null);

  const handleOpenAddModal = (bloqueId: string) => {
    setTargetBloqueId(bloqueId);
    setEditingSubject(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (subject: SubjectMalla) => {
    setEditingSubject(subject);
    setModalOpen(true);
  };

  const handleSaveSubject = (data: Partial<SubjectMalla>) => {
    if (editingSubject) {
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

  const totalCiclos = ciclos.length;
  const totalTrimestres = ciclos.reduce((acc, c) => acc + c.bloques.length, 0);
  const totalMaterias = ciclos.reduce(
    (acc, c) => acc + c.bloques.reduce((subAcc, b) => subAcc + b.materias.length, 0),
    0
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
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

      <CurriculumKanban
        ciclos={ciclos}
        onAddSubjectToBloque={handleOpenAddModal}
        onEditSubject={handleOpenEditModal}
      />

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

export default CurriculumDesign;
