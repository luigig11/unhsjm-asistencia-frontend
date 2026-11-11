
import React, { useMemo, useState } from 'react'

type AcademicInstance = {
  id: string
  nombre: string
  periodoEscolar: string
  bloque: string
  fecha_inicio: string
  fecha_fin: string
  activo: boolean
}

type AcademicGroup = {
  id: string
  codigo: string
  nombre: string
  cupo: number
  instanciaId: string
}

type GroupSubject = {
  id: string
  grupoId: string
  materia: string
  codigoMateria: string
  docente: string
  inscritos: number
  cupo_limite: number
}

type ModalType = 'grupo' | 'materia' | null

const DEMO_INSTANCES: AcademicInstance[] = [
  {
    id: 'inst-2026-t1',
    nombre: 'Primer Trimestre 2026',
    periodoEscolar: 'Año Lectivo 2026',
    bloque: 'Trimestre I',
    fecha_inicio: '2026-01-12',
    fecha_fin: '2026-04-10',
    activo: true,
  },
  {
    id: 'inst-2026-t2',
    nombre: 'Segundo Trimestre 2026',
    periodoEscolar: 'Año Lectivo 2026',
    bloque: 'Trimestre II',
    fecha_inicio: '2026-04-20',
    fecha_fin: '2026-07-17',
    activo: true,
  },
  {
    id: 'inst-2026-t3',
    nombre: 'Tercer Trimestre 2026',
    periodoEscolar: 'Año Lectivo 2026',
    bloque: 'Trimestre III',
    fecha_inicio: '2026-07-27',
    fecha_fin: '2026-10-23',
    activo: true,
  },
]

const INITIAL_GROUPS: AcademicGroup[] = [
  {
    id: 'grupo-1',
    codigo: 'IS-01',
    nombre: 'Ingeniería en Sistemas - A',
    cupo: 35,
    instanciaId: 'inst-2026-t1',
  },
  {
    id: 'grupo-2',
    codigo: 'IS-02',
    nombre: 'Ingeniería en Sistemas - B',
    cupo: 30,
    instanciaId: 'inst-2026-t1',
  },
  {
    id: 'grupo-3',
    codigo: 'AD-01',
    nombre: 'Administración - A',
    cupo: 30,
    instanciaId: 'inst-2026-t1',
  },
  {
    id: 'grupo-4',
    codigo: 'IS-03',
    nombre: 'Ingeniería en Sistemas - A',
    cupo: 35,
    instanciaId: 'inst-2026-t2',
  },
]

const INITIAL_SUBJECTS: GroupSubject[] = [
  {
    id: 'oferta-1',
    grupoId: 'grupo-1',
    materia: 'Programación Orientada a Objetos',
    codigoMateria: 'IS-204',
    docente: 'Carlos Mendoza',
    inscritos: 28,
    cupo_limite: 35,
  },
  {
    id: 'oferta-2',
    grupoId: 'grupo-1',
    materia: 'Base de Datos II',
    codigoMateria: 'IS-206',
    docente: 'María López',
    inscritos: 32,
    cupo_limite: 35,
  },
  {
    id: 'oferta-3',
    grupoId: 'grupo-1',
    materia: 'Redes de Computadoras',
    codigoMateria: 'IS-208',
    docente: 'José Ramírez',
    inscritos: 25,
    cupo_limite: 30,
  },
  {
    id: 'oferta-4',
    grupoId: 'grupo-2',
    materia: 'Programación Orientada a Objetos',
    codigoMateria: 'IS-204',
    docente: 'Ana Castillo',
    inscritos: 26,
    cupo_limite: 30,
  },
  {
    id: 'oferta-5',
    grupoId: 'grupo-3',
    materia: 'Administración General',
    codigoMateria: 'AD-101',
    docente: 'Roberto Pérez',
    inscritos: 21,
    cupo_limite: 30,
  },
  {
    id: 'oferta-6',
    grupoId: 'grupo-4',
    materia: 'Ingeniería de Software',
    codigoMateria: 'IS-301',
    docente: 'Carlos Mendoza',
    inscritos: 18,
    cupo_limite: 35,
  },
]

const formatDate = (value: string) => {
  if (!value) return '—'

  return new Date(`${value}T12:00:00`).toLocaleDateString('es-NI', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const Pantalla08OfertaAcademica: React.FC = () => {
  const [instances] = useState(DEMO_INSTANCES)
  const [selectedInstanceId, setSelectedInstanceId] = useState(
    'inst-2026-t1',
  )

  const [groups, setGroups] = useState(INITIAL_GROUPS)
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS)

  const [selectedGroupId, setSelectedGroupId] = useState('grupo-1')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<ModalType>(null)
  const [notice, setNotice] = useState('')

  const [groupCode, setGroupCode] = useState('')
  const [groupName, setGroupName] = useState('')
  const [groupCapacity, setGroupCapacity] = useState('30')

  const [subjectName, setSubjectName] = useState('')
  const [subjectCode, setSubjectCode] = useState('')
  const [teacherName, setTeacherName] = useState('')
  const [subjectCapacity, setSubjectCapacity] = useState('30')

  const selectedInstance = instances.find(
    (item) => item.id === selectedInstanceId,
  )

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const belongsToInstance = group.instanciaId === selectedInstanceId
      const matchesSearch = `${group.codigo} ${group.nombre}`
        .toLowerCase()
        .includes(search.toLowerCase())

      return belongsToInstance && matchesSearch
    })
  }, [groups, selectedInstanceId, search])

  const selectedGroup = groups.find(
    (group) => group.id === selectedGroupId,
  )

  const groupSubjects = subjects.filter(
    (subject) => subject.grupoId === selectedGroupId,
  )

  const totalCapacity = groupSubjects.reduce(
    (total, subject) => total + subject.cupo_limite,
    0,
  )

  const totalEnrolled = groupSubjects.reduce(
    (total, subject) => total + subject.inscritos,
    0,
  )

  const handleInstanceChange = (instanceId: string) => {
    setSelectedInstanceId(instanceId)

    const firstGroup = groups.find(
      (group) => group.instanciaId === instanceId,
    )

    setSelectedGroupId(firstGroup?.id ?? '')
    setSearch('')
  }

  const handleCreateGroup = (event: React.FormEvent) => {
    event.preventDefault()

    if (!groupCode.trim() || !groupName.trim() || Number(groupCapacity) <= 0) {
      return
    }

    const newGroup: AcademicGroup = {
      id: `grupo-${Date.now()}`,
      codigo: groupCode.trim(),
      nombre: groupName.trim(),
      cupo: Number(groupCapacity),
      instanciaId: selectedInstanceId,
    }

    setGroups((previous) => [...previous, newGroup])
    setSelectedGroupId(newGroup.id)

    setGroupCode('')
    setGroupName('')
    setGroupCapacity('30')
    setModal(null)
    setNotice('Grupo creado correctamente en los datos de demostración.')
  }

  const handleCreateSubject = (event: React.FormEvent) => {
    event.preventDefault()

    if (
      !subjectName.trim() ||
      !subjectCode.trim() ||
      !teacherName.trim() ||
      Number(subjectCapacity) <= 0 ||
      !selectedGroupId
    ) {
      return
    }

    const newSubject: GroupSubject = {
      id: `oferta-${Date.now()}`,
      grupoId: selectedGroupId,
      materia: subjectName.trim(),
      codigoMateria: subjectCode.trim(),
      docente: teacherName.trim(),
      inscritos: 0,
      cupo_limite: Number(subjectCapacity),
    }

    setSubjects((previous) => [...previous, newSubject])

    setSubjectName('')
    setSubjectCode('')
    setTeacherName('')
    setSubjectCapacity('30')
    setModal(null)
    setNotice('Materia asignada correctamente en los datos de demostración.')
  }

  const openGroup = (groupId: string) => {
    setSelectedGroupId(groupId)
    setNotice('')
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-4 md:p-7">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* ENCABEZADO */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1D63B8]">
              <span>Gestión académica</span>
              <span className="text-gray-400">/</span>
              <span>Oferta académica</span>
            </div>

            <h1 className="text-2xl font-bold text-[#0F3C6E] md:text-3xl">
              Oferta Académica y Grupos
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Administración de instancias, secciones y carga docente.
            </p>
          </div>

          <span className="w-fit rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
            MODO DEMOSTRACIÓN
          </span>
        </div>

        {/* SELECTOR DE INSTANCIA */}
        <section className="rounded-lg border border-[#E2E8F0] bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-[#0F3C6E]">
                Instancia académica
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Seleccioná el trimestre o período lectivo que deseas consultar.
              </p>
            </div>

            <span className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#1D63B8]">
              {selectedInstance?.bloque ?? 'Sin instancia'}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <label className="mb-2 block text-xs font-semibold text-gray-600">
                Seleccionar instancia
              </label>

              <select
                value={selectedInstanceId}
                onChange={(event) => handleInstanceChange(event.target.value)}
                className="w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1D63B8]"
              >
                {instances.map((instance) => (
                  <option key={instance.id} value={instance.id}>
                    {instance.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-xs text-gray-500">Período escolar</p>
              <p className="mt-1 font-semibold text-[#0F3C6E]">
                {selectedInstance?.periodoEscolar ?? '—'}
              </p>
            </div>

            <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-xs text-gray-500">Duración de la instancia</p>
              <p className="mt-1 text-sm font-semibold text-[#0F3C6E]">
                {formatDate(selectedInstance?.fecha_inicio ?? '')}
                {' — '}
                {formatDate(selectedInstance?.fecha_fin ?? '')}
              </p>
            </div>
          </div>
        </section>

        {/* RESUMEN */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-4">
            <p className="text-sm text-gray-500">Grupos de la instancia</p>
            <p className="mt-2 text-2xl font-bold text-[#0F3C6E]">
              {groups.filter(
                (group) => group.instanciaId === selectedInstanceId,
              ).length}
            </p>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white p-4">
            <p className="text-sm text-gray-500">Materias del grupo seleccionado</p>
            <p className="mt-2 text-2xl font-bold text-[#0F3C6E]">
              {groupSubjects.length}
            </p>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white p-4">
            <p className="text-sm text-gray-500">Inscritos en sus materias</p>
            <p className="mt-2 text-2xl font-bold text-[#0F3C6E]">
              {totalEnrolled}
              <span className="ml-2 text-sm font-normal text-gray-400">
                / {totalCapacity}
              </span>
            </p>
          </div>
        </div>

        {notice && (
          <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <span>{notice}</span>
            <button
              onClick={() => setNotice('')}
              className="font-semibold"
              aria-label="Cerrar mensaje"
            >
              ×
            </button>
          </div>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid items-start gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">

          {/* PANEL DE GRUPOS */}
          <section className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
            <div className="border-b border-[#E2E8F0] p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-[#0F3C6E]">
                    Grupos y secciones
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Seleccioná un grupo para consultar su oferta.
                  </p>
                </div>

                <button
                  onClick={() => setModal('grupo')}
                  className="rounded-md bg-[#0F3C6E] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1D63B8]"
                >
                  + Grupo
                </button>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar código o grupo..."
                  className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#1D63B8]"
                />
              </div>
            </div>

            <div className="space-y-2 p-3">
              {filteredGroups.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-400">
                  No hay grupos para esta búsqueda.
                </div>
              )}

              {filteredGroups.map((group) => {
                const isSelected = selectedGroupId === group.id
                const subjectsCount = subjects.filter(
                  (subject) => subject.grupoId === group.id,
                ).length

                return (
                  <button
                    key={group.id}
                    onClick={() => openGroup(group.id)}
                    className={`w-full rounded-md border p-3 text-left transition ${
                      isSelected
                        ? 'border-[#1D63B8] bg-blue-50'
                        : 'border-[#E2E8F0] bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? 'text-[#1D63B8]' : 'text-gray-500'
                        }`}
                      >
                        {group.codigo}
                      </span>

                      {isSelected && (
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-[#1D63B8]">
                          Seleccionado
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm font-semibold text-[#0F3C6E]">
                      {group.nombre}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>Cupo: {group.cupo}</span>
                      <span>{subjectsCount} materias ofertadas</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* TABLA DE MATERIAS */}
          <section className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
            <div className="flex flex-col justify-between gap-3 border-b border-[#E2E8F0] p-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1D63B8]">
                  Carga académica
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#0F3C6E]">
                  {selectedGroup?.nombre ?? 'Seleccioná un grupo'}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {selectedGroup
                    ? `Código: ${selectedGroup.codigo} · Cupo del grupo: ${selectedGroup.cupo}`
                    : 'No hay un grupo seleccionado.'}
                </p>
              </div>

              <button
                onClick={() => setModal('materia')}
                disabled={!selectedGroup}
                className="rounded-md bg-[#1D63B8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0F3C6E] disabled:cursor-not-allowed disabled:opacity-40"
              >
                + Asignar materia
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Asignatura</th>
                    <th className="px-5 py-4 font-semibold">Docente titular</th>
                    <th className="px-5 py-4 font-semibold">Ocupación</th>
                    <th className="px-5 py-4 font-semibold">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0]">
                  {groupSubjects.map((subject) => {
                    const percentage =
                      subject.cupo_limite > 0
                        ? Math.min(
                            100,
                            (subject.inscritos / subject.cupo_limite) * 100,
                          )
                        : 0

                    const isFull =
                      subject.inscritos >= subject.cupo_limite

                    return (
                      <tr key={subject.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#0F3C6E]">
                            {subject.materia}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {subject.codigoMateria}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#1D63B8]">
                              {subject.docente
                                .split(' ')
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join('')}
                            </div>
                            <span className="text-gray-700">
                              {subject.docente}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                            <span className="font-semibold text-[#0F3C6E]">
                              {subject.inscritos} / {subject.cupo_limite}
                            </span>

                            <span
                              className={
                                isFull
                                  ? 'font-semibold text-red-600'
                                  : 'text-gray-500'
                              }
                            >
                              {isFull ? 'Completo' : 'Disponible'}
                            </span>
                          </div>

                          <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full ${
                                isFull ? 'bg-red-500' : 'bg-[#1D63B8]'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-col items-start gap-2">
                            <button
                              onClick={() =>
                                setNotice(
                                  'La configuración de horarios estará disponible al integrar la P09.',
                                )
                              }
                              className="text-xs font-semibold text-[#1D63B8] hover:underline"
                            >
                              Configurar horario →
                            </button>

                            <button
                              onClick={() =>
                                setNotice(
                                  'La inscripción de alumnos estará disponible al integrar la P10.',
                                )
                              }
                              className="text-xs font-semibold text-[#1D63B8] hover:underline"
                            >
                              Inscribir alumnos →
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                  {groupSubjects.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-12 text-center text-sm text-gray-400"
                      >
                        Este grupo todavía no tiene materias asignadas.
                        <p className="mt-1 text-xs">
                          Utilizá «Asignar materia» para agregar una oferta.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3 text-xs text-gray-500">
              La ocupación representa los estudiantes inscritos respecto al
              cupo límite de cada materia por grupo.
            </div>
          </section>
        </div>

        {/* MODALES DE DEMOSTRACIÓN */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-lg rounded-lg border border-[#E2E8F0] bg-white">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] p-5">
                <div>
                  <h2 className="font-bold text-[#0F3C6E]">
                    {modal === 'grupo'
                      ? 'Registrar grupo o sección'
                      : 'Asignar materia al grupo'}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Los cambios se guardarán únicamente en esta demostración.
                  </p>
                </div>

                <button
                  onClick={() => setModal(null)}
                  className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                  aria-label="Cerrar modal"
                >
                  ×
                </button>
              </div>

              {modal === 'grupo' ? (
                <form onSubmit={handleCreateGroup} className="space-y-4 p-5">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      Código del grupo
                    </label>
                    <input
                      required
                      value={groupCode}
                      onChange={(event) => setGroupCode(event.target.value)}
                      placeholder="Ej. IS-04"
                      className="w-full rounded-md border border-[#E2E8F0] px-3 py-2.5 text-sm outline-none focus:border-[#1D63B8]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      Nombre del grupo
                    </label>
                    <input
                      required
                      value={groupName}
                      onChange={(event) => setGroupName(event.target.value)}
                      placeholder="Ej. Ingeniería en Sistemas - C"
                      className="w-full rounded-md border border-[#E2E8F0] px-3 py-2.5 text-sm outline-none focus:border-[#1D63B8]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      Cupo del grupo
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={groupCapacity}
                      onChange={(event) => setGroupCapacity(event.target.value)}
                      className="w-full rounded-md border border-[#E2E8F0] px-3 py-2.5 text-sm outline-none focus:border-[#1D63B8]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 border-t border-[#E2E8F0] pt-4">
                    <button
                      type="button"
                      onClick={() => setModal(null)}
                      className="rounded-md border border-[#E2E8F0] px-4 py-2 text-sm text-gray-600"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-[#0F3C6E] px-4 py-2 text-sm font-semibold text-white"
                    >
                      Crear grupo
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCreateSubject} className="space-y-4 p-5">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      Asignatura de la malla
                    </label>
                    <input
                      required
                      value={subjectName}
                      onChange={(event) => setSubjectName(event.target.value)}
                      placeholder="Nombre de la asignatura"
                      className="w-full rounded-md border border-[#E2E8F0] px-3 py-2.5 text-sm outline-none focus:border-[#1D63B8]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      Código de materia
                    </label>
                    <input
                      required
                      value={subjectCode}
                      onChange={(event) => setSubjectCode(event.target.value)}
                      placeholder="Ej. IS-210"
                      className="w-full rounded-md border border-[#E2E8F0] px-3 py-2.5 text-sm outline-none focus:border-[#1D63B8]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      Docente titular
                    </label>
                    <input
                      required
                      value={teacherName}
                      onChange={(event) => setTeacherName(event.target.value)}
                      placeholder="Nombre del docente"
                      className="w-full rounded-md border border-[#E2E8F0] px-3 py-2.5 text-sm outline-none focus:border-[#1D63B8]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      Cupo límite de la materia
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={subjectCapacity}
                      onChange={(event) =>
                        setSubjectCapacity(event.target.value)
                      }
                      className="w-full rounded-md border border-[#E2E8F0] px-3 py-2.5 text-sm outline-none focus:border-[#1D63B8]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 border-t border-[#E2E8F0] pt-4">
                    <button
                      type="button"
                      onClick={() => setModal(null)}
                      className="rounded-md border border-[#E2E8F0] px-4 py-2 text-sm text-gray-600"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-[#0F3C6E] px-4 py-2 text-sm font-semibold text-white"
                    >
                      Asignar materia
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
