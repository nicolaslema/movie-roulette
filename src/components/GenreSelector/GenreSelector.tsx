import { Listbox } from '@headlessui/react';
import { Fragment } from 'react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import type { Genre } from '../../types/MovieTypes';

type Props = {
  genres: Genre[];
  selectedGenre: number | null;
  onChange: (id: number | null) => void;
};

export default function GenreSelector({ genres, selectedGenre, onChange }: Props) {
  const selected = selectedGenre
    ? genres.find((g) => g.id === selectedGenre)
    : null;

  return (
    <div className="relative w-full max-w-sm">
      <Listbox value={selectedGenre} onChange={onChange}>
        {({ open }) => (
          <>
            <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-neutral-900/70 py-2 pl-4 pr-10 text-left text-white border border-zinc-600/40 shadow-md hover:border-zinc-400/50 transition">
              <span className="block truncate">
                {selected ? selected.name : 'Todos los géneros'}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <FaChevronDown className="h-3 w-3 text-zinc-400" />
              </span>
            </Listbox.Button>

            <Listbox.Options className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-neutral-900/90 border border-zinc-700/40 shadow-lg backdrop-blur-sm">
              <Listbox.Option
                as={Fragment}
                key="all"
                value={null}
              >
                {({ active, selected }) => (
                  <li
                    className={`cursor-pointer select-none px-4 py-2 text-sm ${
                      active ? 'bg-zinc-800 text-white' : 'text-zinc-300'
                    }`}
                  >
                    {selected && <FaCheck className="inline mr-2 text-green-400" />}
                    Todos los géneros
                  </li>
                )}
              </Listbox.Option>

              {genres.map((genre) => (
                <Listbox.Option
                  as={Fragment}
                  key={genre.id}
                  value={genre.id}
                >
                  {({ active, selected }) => (
                    <li
                      className={`cursor-pointer select-none px-4 py-2 text-sm ${
                        active ? 'bg-zinc-800 text-white' : 'text-zinc-300'
                      }`}
                    >
                      {selected && <FaCheck className="inline mr-2 text-green-400" />}
                      {genre.name}
                    </li>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </>
        )}
      </Listbox>
    </div>
  );
}

