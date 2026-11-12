import React from 'react';

export interface Schedule {
  id: number;
  grupo: string;
  materia: string;
  docente: string;
  aula: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
}

interface ScheduleWeeklyGridProps {
  days: string[];
  hours: string[];
  selectedDay: string;
  getSchedules: (day: string, hour: string) => Schedule[];
  onEditSchedule: (schedule: Schedule) => void;
  onDeleteSchedule: (id: number) => void;
}

export const ScheduleWeeklyGrid: React.FC<ScheduleWeeklyGridProps> = ({
  days,
  hours,
  selectedDay,
  getSchedules,
  onEditSchedule,
  onDeleteSchedule,
}) => {
  const visibleDays = selectedDay === 'Todos' ? days : [selectedDay];

  return (
    <section className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden text-left">
      <div className="p-4 border-b border-[#E2E8F0]">
        <h2 className="text-sm font-bold text-[#0F172A]">
          Matriz Semanal de Horarios
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Grilla interactiva de bloques horarios organizados de Lunes a Domingo
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="p-3 font-semibold text-[#475569] border-r border-[#E2E8F0] w-24 text-center">
                Hora
              </th>
              {visibleDays.map((day) => (
                <th
                  key={day}
                  className="p-3 font-semibold text-[#0F172A] border-r border-[#E2E8F0] min-w-[170px] text-center"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour} className="border-b border-[#E2E8F0]">
                <td className="p-2.5 font-mono text-center font-medium text-[#64748B] bg-[#F8FAFC] border-r border-[#E2E8F0]">
                  {hour}
                </td>
                {visibleDays.map((day) => {
                  const items = getSchedules(day, hour);

                  return (
                    <td
                      key={`${day}-${hour}`}
                      className="p-1.5 border-r border-[#E2E8F0] align-top bg-white hover:bg-[#F8FAFC]/50 transition-colors"
                    >
                      {items.length === 0 ? (
                        <div className="h-10" />
                      ) : (
                        <div className="space-y-1.5">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded-md border border-[#1D63B8]/30 bg-[#EBF3FC] text-left space-y-1 shadow-2xs"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-mono text-[10px] font-bold text-[#0F3C6E] bg-white px-1.5 py-0.2 rounded border border-[#1D63B8]/20">
                                  {item.grupo}
                                </span>
                                <span className="font-mono text-[10px] text-[#475569]">
                                  {item.horaInicio} - {item.horaFin}
                                </span>
                              </div>

                              <p className="font-bold text-[#0F172A] leading-tight truncate">
                                {item.materia}
                              </p>

                              <p className="text-[11px] text-[#475569] truncate">
                                {item.docente}
                              </p>

                              <div className="flex items-center justify-between pt-1 border-t border-[#1D63B8]/15">
                                <span className="text-[10px] font-semibold text-[#0F3C6E]">
                                  {item.aula}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => onEditSchedule(item)}
                                    className="text-[10px] font-semibold text-[#1D63B8] hover:underline cursor-pointer"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDeleteSchedule(item.id)}
                                    className="text-[10px] font-semibold text-[#C81E2B] hover:underline cursor-pointer"
                                  >
                                    Quitar
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
