import React from 'react';
import { ChevronDownIcon } from '../common/Icons';

interface ScheduleFiltersProps {
  groups: string[];
  selectedGroup: string;
  onSelectGroup: (group: string) => void;
  days: string[];
  selectedDay: string;
  onSelectDay: (day: string) => void;
}

export const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  groups,
  selectedGroup,
  onSelectGroup,
  days,
  selectedDay,
  onSelectDay,
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#475569]">
            Filtrar por Grupo / Sección
          </label>
          <div className="relative">
            <select
              value={selectedGroup}
              onChange={(e) => onSelectGroup(e.target.value)}
              className="w-full appearance-none px-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
            >
              <option value="Todos">Todos los grupos</option>
              {groups.map((g) => (
                <option key={g} value={g}>
                  Grupo {g}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#475569]">
              <ChevronDownIcon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#475569]">
            Filtrar por Día de la Semana
          </label>
          <div className="relative">
            <select
              value={selectedDay}
              onChange={(e) => onSelectDay(e.target.value)}
              className="w-full appearance-none px-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] outline-none focus:border-[#1D63B8] cursor-pointer"
            >
              <option value="Todos">Toda la semana (Lunes a Domingo)</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#475569]">
              <ChevronDownIcon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
