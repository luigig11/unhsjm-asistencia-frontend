import React, { useState, useMemo } from 'react';
import { EnrollmentHeader } from '../components/enrollment/EnrollmentHeader';
import type { Group } from '../components/enrollment/EnrollmentHeader';
import { StudentSearchSection } from '../components/enrollment/StudentSearchSection';
import type { Student } from '../components/enrollment/StudentSearchSection';
import { EnrolledStudentsTable } from '../components/enrollment/EnrolledStudentsTable';
import type { Enrollment } from '../components/enrollment/EnrolledStudentsTable';

const GROUPS: Group[] = [];
const STUDENTS: Student[] = [];

export const StudentEnrollment: React.FC = () => {
  const [groupId, setGroupId] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [feedback, setFeedback] = useState<string>('');

  const selectedGroup = GROUPS.find((g) => g.id === groupId) ?? {
    id: 0,
    materia: 'Sin materia asignada',
    codigoMateria: 'N/A',
    grupo: 'Sin grupo',
    docente: 'Sin docente asignado',
    periodo: 'N/A',
    cupoLimite: 0,
  };

  const groupEnrollments = useMemo(() => {
    return enrollments.filter((item) => item.grupoId === groupId && item.activo);
  }, [enrollments, groupId]);

  const enrolledIds = useMemo(() => {
    return groupEnrollments.map((item) => item.estudianteId);
  }, [groupEnrollments]);

  const suggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query || selectedStudentId !== null) return [];

    return STUDENTS.filter((student) => {
      const matches =
        student.nombre.toLowerCase().includes(query) ||
        student.codigo_unico.toLowerCase().includes(query);
      return matches && student.activo && !enrolledIds.includes(student.id);
    }).slice(0, 6);
  }, [search, selectedStudentId, enrolledIds]);

  const selectedStudent = STUDENTS.find((s) => s.id === selectedStudentId) ?? null;

  const occupied = groupEnrollments.length;
  const cupoLimite = selectedGroup.cupoLimite || 1;
  const available = Math.max(selectedGroup.cupoLimite - occupied, 0);
  const percentage = selectedGroup.cupoLimite > 0 ? Math.min((occupied / cupoLimite) * 100, 100) : 0;

  const handleEnrollStudent = () => {
    if (!selectedStudent) {
      setFeedback('Primero selecciona un estudiante de la lista.');
      return;
    }
    if (available <= 0) {
      setFeedback('El grupo alcanzó su cupo límite.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const newEnrollment: Enrollment = {
      id: Date.now(),
      estudianteId: selectedStudent.id,
      grupoId: groupId,
      fechaInscripcion: today,
      activo: true,
    };

    setEnrollments((prev) => [...prev, newEnrollment]);
    setFeedback(`Inscripción registrada para ${selectedStudent.nombre}.`);
    setSearch('');
    setSelectedStudentId(null);
  };

  const handleRemoveEnrollment = (enrId: number) => {
    setEnrollments((prev) => prev.filter((e) => e.id !== enrId));
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto flex-1 p-4 sm:p-6 space-y-5">
      <EnrollmentHeader
        groups={GROUPS}
        selectedGroupId={groupId}
        onSelectGroup={(newId) => {
          setGroupId(newId);
          setSearch('');
          setSelectedStudentId(null);
          setFeedback('');
        }}
        selectedGroup={selectedGroup}
        occupied={occupied}
        available={available}
        percentage={percentage}
      />

      <StudentSearchSection
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setSelectedStudentId(null);
          setFeedback('');
        }}
        suggestions={suggestions}
        selectedStudent={selectedStudent}
        onSelectStudent={(stu) => {
          setSelectedStudentId(stu.id);
          setSearch(stu.nombre);
        }}
        onEnroll={handleEnrollStudent}
        feedback={feedback}
        isAvailable={available > 0}
      />

      <EnrolledStudentsTable
        enrollments={groupEnrollments}
        students={STUDENTS}
        onRemoveEnrollment={handleRemoveEnrollment}
      />
    </div>
  );
};

export default StudentEnrollment;
