// src/components/DatePicker.tsx
import { Popover, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
} from 'react-icons/fa';
import {
  format,
  getDaysInMonth,
  addMonths,
  subMonths,
  setYear,
} from 'date-fns';

type Props = {
  label: string;
  value: string | null;
  onChange: (date: string) => void;


};

export default function DatePicker({ label, value, onChange }: Props) {
  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState<Date>(initialDate);
  const [, setSelectedDate] = useState<Date | null>(initialDate);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);



  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    onChange(date.toISOString().split('T')[0]);
  };

  const daysInMonth = getDaysInMonth(viewDate);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

const currentYear = new Date().getFullYear();
const minYear = 1930; // Año mínimo fijo
const years = Array.from({ length: currentYear - minYear + 1 }, (_, i) => minYear + i);



  return (
    <div className="flex flex-col">
      <label className="text-xs text-zinc-400 mb-1">{label}</label>
      <Popover className="relative">
        <Popover.Button className="w-full bg-neutral-900/70 text-white px-3 py-2 rounded-md border border-zinc-600/40 flex items-center justify-between gap-4">
          <span>{value ? format(new Date(value), 'dd/MM/yyyy') : 'Seleccionar fecha'}</span>
          <FaCalendarAlt className="text-zinc-400" />
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute z-20 mt-2 w-72 rounded-xl bg-neutral-900 border border-zinc-700 shadow-lg p-4">
            {/* Header de navegación */}
            <div className="flex items-center justify-between mb-4 text-white">
              <button
                onClick={() => setViewDate(subMonths(viewDate, 1))}
                className="p-1 hover:bg-zinc-800 rounded-md"
              >
                <FaChevronLeft />
              </button>

              <div className="flex items-center gap-4 relative">
                <span className="font-semibold">{format(viewDate, 'MMMM')}</span>
                <button
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                  className="flex items-center gap-4 text-sm hover:text-red-400"
                >
                  {year}
                  <FaChevronDown className="text-xs" />
                </button>

                {yearDropdownOpen && (
                  <div className="absolute top-6 right-0 z-20 bg-neutral-900 border border-zinc-700 rounded-md shadow-lg max-h-48 overflow-y-auto w-24">
                    {years.map((y) => (
                      <button
                        key={y}
                        onClick={() => {
                          setViewDate(setYear(viewDate, y));
                          setYearDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-1 text-left text-sm hover:bg-zinc-800 ${
                          y === year ? 'text-red-400 font-semibold' : 'text-zinc-300'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setViewDate(addMonths(viewDate, 1))}
                className="p-1 hover:bg-zinc-800 rounded-md"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-2 text-sm text-white">
              {[...Array(daysInMonth)].map((_, i) => {
                const date = new Date(year, month, i + 1);
                const iso = date.toISOString().split('T')[0];
                const isSelected = value === iso;

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(date)}
                    className={`px-2 py-1 rounded-md hover:bg-zinc-700 transition ${
                      isSelected ? 'bg-red-600 text-white' : 'bg-neutral-800 text-zinc-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
}
