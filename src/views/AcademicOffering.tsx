import React, { useState, useMemo } from 'react';
import { OfferingHeader } from '../components/offering/OfferingHeader';
import type { AcademicInstance } from '../components/offering/OfferingHeader';
import { GroupSidebar } from '../components/offering/GroupSidebar';
import type { AcademicGroup } from '../components/offering/GroupSidebar';
import { GroupSubjectTable } from '../components/offering/GroupSubjectTable';
import type { GroupSubject } from '../components/offering/GroupSubjectTable';
import { ModalCrearGrupo } from '../components/offering/ModalCrearGrupo';
import { ModalAsignarMateria } from '../components/offering/ModalAsignarMateria';

export const AcademicOffering: React.FC = () => {
  const [instances] = useState<AcademicInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>('');

  const [groups, setGroups] = useState<AcademicGroup[]>([]);
  const [subjects, setSubjects] = useState<GroupSubject[]>([]);

  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [groupSearch, setGroupSearch] = useState<string>('');

  const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState<boolean>(false);

  const selectedInstance = instances.find((inst) => inst.id === selectedInstanceId);

  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const matchesInstance = !selectedInstanceId || g.instanciaId === selectedInstanceId;
      const q = groupSearch.toLowerCase().trim();
      const matchesSearch = !q || g.codigo.toLowerCase().includes(q) || g.nombre.toLowerCase().includes(q);
      return matchesInstance && matchesSearch;
    });
  }, [groups, selectedInstanceId, groupSearch]);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const currentSubjects = useMemo(() => {
    return subjects.filter((s) => s.grupoId === selectedGroupId);
  }, [subjects, selectedGroupId]);

  const totalCapacity = currentSubjects.reduce((acc, s) => acc + s.cupo_limite, 0);
  const totalEnrolled = currentSubjects.reduce((acc, s) => acc + s.inscritos, 0);

  const handleCreateGroup = (data: { codigo: string; nombre: string; cupo: number }) => {
    const newGroup: AcademicGroup = {
      id: `grupo-${Date.now()}`,
      codigo: data.codigo,
      nombre: data.nombre,
      cupo: data.cupo,
      instanciaId: selectedInstanceId || 'inst-1',
    };
    setGroups((prev) => [...prev, newGroup]);
    setSelectedGroupId(newGroup.id);
  };

  const handleAddSubject = (data: { materia: string; codigoMateria: string; docente: string; cupo_limite: number }) => {
    if (!selectedGroupId) return;
    const newSub: GroupSubject = {
      id: `sub-${Date.now()}`,
      grupoId: selectedGroupId,
      materia: data.materia,
      codigoMateria: data.codigoMateria,
      docente: data.docente,
      inscritos: 0,
      cupo_limite: data.cupo_limite,
    };
    setSubjects((prev) => [...prev, newSub]);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto flex-1 p-4 sm:p-6 space-y-5">
      <OfferingHeader
        instances={instances}
        selectedInstanceId={selectedInstanceId}
        selectedInstance={selectedInstance}
        onSelectInstance={(id) => {
          setSelectedInstanceId(id);
          const firstInInstance = groups.find((g) => g.instanciaId === id);
          setSelectedGroupId(firstInInstance?.id || '');
        }}
        onOpenCreateGroup={() => setIsGroupModalOpen(true)}
        groupsCount={filteredGroups.length}
        subjectsCount={currentSubjects.length}
        totalEnrolled={totalEnrolled}
        totalCapacity={totalCapacity}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-5 items-start">
        <GroupSidebar
          groups={filteredGroups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
          searchTerm={groupSearch}
          onSearchChange={setGroupSearch}
          getSubjectCount={(gId) => subjects.filter((s) => s.grupoId === gId).length}
        />

        <GroupSubjectTable
          selectedGroupName={selectedGroup?.nombre}
          selectedGroupCode={selectedGroup?.codigo}
          subjects={currentSubjects}
          onOpenAddSubject={() => setIsSubjectModalOpen(true)}
        />
      </div>

      <ModalCrearGrupo
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onSave={handleCreateGroup}
      />

      <ModalAsignarMateria
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSave={handleAddSubject}
        defaultCapacity={selectedGroup?.cupo || 35}
      />
    </div>
  );
};

export default AcademicOffering;
