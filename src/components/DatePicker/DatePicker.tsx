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
  const minYear = 1930;
  const years = Array.from({ length: currentYear - minYear + 1 }, (_, i) => minYear + i);

  return (
    <div className="relative z-[300] flex flex-col">
      <label className="mb-1 text-xs font-medium text-zinc-400">{label}</label>
      <Popover className="relative">
        <Popover.Button className="flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-700/70 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 shadow-sm">
          <span>{value ? format(new Date(value), 'dd/MM/yyyy') : 'Seleccionar fecha'}</span>
          <FaCalendarAlt className="text-zinc-500" />
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
          <Popover.Panel className="absolute z-[1000] mt-2 w-72 rounded-xl border border-zinc-700/80 bg-zinc-900 p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between text-zinc-200">
              <button
                onClick={() => setViewDate(subMonths(viewDate, 1))}
                className="rounded-md p-1 hover:bg-zinc-800"
              >
                <FaChevronLeft />
              </button>

              <div className="relative flex items-center gap-4">
                <span className="font-semibold">{format(viewDate, 'MMMM')}</span>
                <button
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                  className="flex items-center gap-2 text-sm hover:text-amber-200"
                >
                  {year}
                  <FaChevronDown className="text-xs" />
                </button>

                {yearDropdownOpen && (
                  <div className="absolute right-0 top-6 z-[1100] max-h-48 w-24 overflow-y-auto rounded-md border border-zinc-700/80 bg-zinc-900 shadow-lg">
                    {years.map((y) => (
                      <button
                        key={y}
                        onClick={() => {
                          setViewDate(setYear(viewDate, y));
                          setYearDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-1 text-left text-sm hover:bg-zinc-800 ${
                          y === year ? 'font-semibold text-amber-200' : 'text-zinc-300'
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
                className="rounded-md p-1 hover:bg-zinc-800"
              >
                <FaChevronRight />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-sm text-zinc-200">
              {[...Array(daysInMonth)].map((_, i) => {
                const date = new Date(year, month, i + 1);
                const iso = date.toISOString().split('T')[0];
                const isSelected = value === iso;

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(date)}
                    className={`rounded-md px-2 py-1 transition ${
                      isSelected
                        ? 'bg-[#5a3320] text-amber-100'
                        : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
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
