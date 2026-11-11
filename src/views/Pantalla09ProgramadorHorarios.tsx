import { useMemo, useState } from 'react';

type Schedule = {
  id: number;
  grupo: string;
  materia: string;
  docente: string;
  aula: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
};

const DIAS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

const GRUPOS = ['IS-01', 'IS-02', 'IS-03', 'AD-01'];

const MATERIAS = [
  'Programación I',
  'Base de Datos',
  'Redes de Computadoras',
  'Ingeniería de Software',
  'Sistemas Operativos',
];

const DOCENTES = [
  'Carlos Martínez',
  'María López',
  'Roberto Sánchez',
  'Ana García',
];

const AULAS = ['Aula 101', 'Aula 102', 'Laboratorio 1', 'Laboratorio 2'];

const HORAS = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 1,
    grupo: 'IS-01',
    materia: 'Programación I',
    docente: 'Carlos Martínez',
    aula: 'Laboratorio 1',
    dia: 'Lunes',
    horaInicio: '07:00',
    horaFin: '09:00',
  },
  {
    id: 2,
    grupo: 'IS-01',
    materia: 'Base de Datos',
    docente: 'María López',
    aula: 'Aula 101',
    dia: 'Martes',
    horaInicio: '09:00',
    horaFin: '11:00',
  },
  {
    id: 3,
    grupo: 'IS-02',
    materia: 'Redes de Computadoras',
    docente: 'Roberto Sánchez',
    aula: 'Laboratorio 2',
    dia: 'Lunes',
    horaInicio: '09:00',
    horaFin: '11:00',
  },
  {
    id: 4,
    grupo: 'AD-01',
    materia: 'Ingeniería de Software',
    docente: 'Ana García',
    aula: 'Aula 102',
    dia: 'Miércoles',
    horaInicio: '10:00',
    horaFin: '12:00',
  },
  {
    id: 5,
    grupo: 'IS-03',
    materia: 'Sistemas Operativos',
    docente: 'Carlos Martínez',
    aula: 'Laboratorio 1',
    dia: 'Jueves',
    horaInicio: '13:00',
    horaFin: '15:00',
  },
];

const EMPTY_FORM = {
  grupo: 'IS-01',
  materia: 'Programación I',
  docente: 'Carlos Martínez',
  aula: 'Aula 101',
  dia: 'Lunes',
  horaInicio: '07:00',
  horaFin: '09:00',
};

export const Pantalla09ProgramadorHorarios = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(
    INITIAL_SCHEDULES
  );

  const [selectedGroup, setSelectedGroup] = useState('Todos');
  const [selectedDay, setSelectedDay] = useState('Todos');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const matchesGroup =
        selectedGroup === 'Todos' ||
        schedule.grupo === selectedGroup;

      const matchesDay =
        selectedDay === 'Todos' ||
        schedule.dia === selectedDay;

      return matchesGroup && matchesDay;
    });
  }, [schedules, selectedGroup, selectedDay]);

  const openNewModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (schedule: Schedule) => {
    setEditingId(schedule.id);
    setForm({
      grupo: schedule.grupo,
      materia: schedule.materia,
      docente: schedule.docente,
      aula: schedule.aula,
      dia: schedule.dia,
      horaInicio: schedule.horaInicio,
      horaFin: schedule.horaFin,
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setError('');
  };

  const handleSave = () => {
    if (
      !form.grupo ||
      !form.materia ||
      !form.docente ||
      !form.aula ||
      !form.dia ||
      !form.horaInicio ||
      !form.horaFin
    ) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (form.horaInicio >= form.horaFin) {
      setError('La hora de inicio debe ser anterior a la hora de finalización.');
      return;
    }

    const overlaps = schedules.some((schedule) => {
      if (schedule.id === editingId) return false;
      if (schedule.dia !== form.dia) return false;

      const sameGroup = schedule.grupo === form.grupo;
      const sameTeacher = schedule.docente === form.docente;
      const sameRoom = schedule.aula === form.aula;

      const timeOverlap =
        form.horaInicio < schedule.horaFin &&
        form.horaFin > schedule.horaInicio;

      return (
        timeOverlap &&
        (sameGroup || sameTeacher || sameRoom)
      );
    });

    if (overlaps) {
      setError(
        'Existe un cruce de horario para el grupo, docente o aula seleccionada.'
      );
      return;
    }

    if (editingId !== null) {
      setSchedules((previous) =>
        previous.map((schedule) =>
          schedule.id === editingId
            ? { ...form, id: editingId }
            : schedule
        )
      );
    } else {
      setSchedules((previous) => [
        ...previous,
        {
          ...form,
          id: Math.max(0, ...previous.map((item) => item.id)) + 1,
        },
      ]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      '¿Estás seguro de eliminar este horario?'
    );

    if (confirmed) {
      setSchedules((previous) =>
        previous.filter((schedule) => schedule.id !== id)
      );
    }
  };

  const totalGroups = new Set(
    schedules.map((schedule) => schedule.grupo)
  ).size;

  const totalSubjects = new Set(
    schedules.map((schedule) => schedule.materia)
  ).size;

  const getSchedules = (day: string, hour: string) => {
    return filteredSchedules.filter(
      (schedule) =>
        schedule.dia === day &&
        schedule.horaInicio === hour
    );
  };

  const inputClass =
    'w-full border border-[#CBD5E1] rounded-md px-3 py-2 text-sm text-[#334155] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D63B8]';

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-6 text-[#334155]">

      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="mb-1">
            <span className="text-xs font-semibold text-[#1D63B8] uppercase tracking-wider">
              Gestión académica
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#0F3C6E]">
            Programador de Horarios
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Organización de horarios, grupos, docentes y aulas.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          className="bg-[#0F3C6E] hover:bg-[#1D63B8] text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-colors"
        >
          + Programar horario
        </button>
      </div>

      {/* INDICADORES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium">
            Horarios programados
          </p>
          <p className="text-2xl font-bold text-[#0F3C6E] mt-2">
            {schedules.length}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium">
            Grupos con horario
          </p>
          <p className="text-2xl font-bold text-[#0F3C6E] mt-2">
            {totalGroups}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium">
            Materias programadas
          </p>
          <p className="text-2xl font-bold text-[#0F3C6E] mt-2">
            {totalSubjects}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium">
            Días utilizados
          </p>
          <p className="text-2xl font-bold text-[#0F3C6E] mt-2">
            {new Set(schedules.map((item) => item.dia)).size}
          </p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Filtrar por grupo
            </label>
            <select
              value={selectedGroup}
              onChange={(event) =>
                setSelectedGroup(event.target.value)
              }
              className={inputClass}
            >
              <option value="Todos">Todos los grupos</option>
              {GRUPOS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Filtrar por día
            </label>
            <select
              value={selectedDay}
              onChange={(event) =>
                setSelectedDay(event.target.value)
              }
              className={inputClass}
            >
              <option value="Todos">Todos los días</option>
              {DIAS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VISTA SEMANAL */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-[#0F3C6E]">
              Calendario semanal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Seleccioná un bloque para consultar o editar su horario.
            </p>
          </div>

          <span className="text-xs bg-blue-50 text-[#1D63B8] px-3 py-1.5 rounded-md font-semibold">
            Vista de demostración
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[75px_repeat(6,minmax(0,1fr))] bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <div className="p-3 text-xs font-bold text-slate-500">
                Hora
              </div>

              {DIAS.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-xs font-bold text-[#0F3C6E] border-l border-[#E2E8F0]"
                >
                  {day}
                </div>
              ))}
            </div>

            {HORAS.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-[75px_repeat(6,minmax(0,1fr))] min-h-[90px] border-b border-[#E2E8F0]"
              >
                <div className="p-3 text-xs font-semibold text-slate-500">
                  {hour}
                </div>

                {DIAS.map((day) => {
                  const items = getSchedules(day, hour);

                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="p-1.5 border-l border-[#E2E8F0] space-y-1"
                    >
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="w-full text-left bg-blue-50 border border-blue-200 rounded-md p-2 hover:bg-blue-100 transition-colors"
                          title="Editar horario"
                        >
                          <p className="text-[10px] font-bold text-[#0F3C6E]">
                            {item.grupo}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-700 leading-tight mt-1">
                            {item.materia}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {item.horaInicio} - {item.horaFin}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {item.aula}
                          </p>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LISTADO DE HORARIOS */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0]">
          <h2 className="font-bold text-[#0F3C6E]">
            Horarios registrados
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Detalle de las clases programadas.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Grupo</th>
                <th className="px-4 py-3">Materia</th>
                <th className="px-4 py-3">Docente</th>
                <th className="px-4 py-3">Día</th>
                <th className="px-4 py-3">Horario</th>
                <th className="px-4 py-3">Aula</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredSchedules.map((schedule) => (
                <tr
                  key={schedule.id}
                  className="border-t border-[#E2E8F0] hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-semibold text-[#0F3C6E]">
                    {schedule.grupo}
                  </td>
                  <td className="px-4 py-3">{schedule.materia}</td>
                  <td className="px-4 py-3">{schedule.docente}</td>
                  <td className="px-4 py-3">{schedule.dia}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {schedule.horaInicio} - {schedule.horaFin}
                  </td>
                  <td className="px-4 py-3">{schedule.aula}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(schedule)}
                        className="text-[#1D63B8] hover:underline text-xs font-semibold"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(schedule.id)}
                        className="text-[#C81E2B] hover:underline text-xs font-semibold"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSchedules.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-sm text-slate-400"
                  >
                    No hay horarios registrados para estos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE PROGRAMACIÓN */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E2E8F0]">
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0F3C6E]">
                  {editingId !== null
                    ? 'Editar horario'
                    : 'Programar nuevo horario'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Completá los datos de la programación académica.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-red-600 text-2xl"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Grupo
                  </label>
                  <select
                    value={form.grupo}
                    onChange={(event) =>
                      setForm({ ...form, grupo: event.target.value })
                    }
                    className={inputClass}
                  >
                    {GRUPOS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Materia
                  </label>
                  <select
                    value={form.materia}
                    onChange={(event) =>
                      setForm({ ...form, materia: event.target.value })
                    }
                    className={inputClass}
                  >
                    {MATERIAS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Docente
                  </label>
                  <select
                    value={form.docente}
                    onChange={(event) =>
                      setForm({ ...form, docente: event.target.value })
                    }
                    className={inputClass}
                  >
                    {DOCENTES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Aula
                  </label>
                  <select
                    value={form.aula}
                    onChange={(event) =>
                      setForm({ ...form, aula: event.target.value })
                    }
                    className={inputClass}
                  >
                    {AULAS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Día
                  </label>
                  <select
                    value={form.dia}
                    onChange={(event) =>
                      setForm({ ...form, dia: event.target.value })
                    }
                    className={inputClass}
                  >
                    {DIAS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Hora de inicio
                  </label>
                  <select
                    value={form.horaInicio}
                    onChange={(event) =>
                      setForm({ ...form, horaInicio: event.target.value })
                    }
                    className={inputClass}
                  >
                    {HORAS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Hora de finalización
                  </label>
                  <select
                    value={form.horaFin}
                    onChange={(event) =>
                      setForm({ ...form, horaFin: event.target.value })
                    }
                    className={inputClass}
                  >
                    {HORAS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                    <option value="19:00">19:00</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 p-3 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-xs text-[#0F3C6E]">
                  <strong>Validación automática:</strong> el sistema verifica
                  que no existan cruces de horario para el grupo, docente
                  o aula seleccionada.
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 bg-[#0F3C6E] hover:bg-[#1D63B8] text-white rounded-md text-sm font-semibold"
                >
                  {editingId !== null
                    ? 'Guardar cambios'
                    : 'Registrar horario'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
