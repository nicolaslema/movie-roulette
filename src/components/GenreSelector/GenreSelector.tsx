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
    <div className="relative z-[300] w-full max-w-sm">
      <Listbox value={selectedGenre} onChange={onChange}>
        <>
          <Listbox.Button className="relative w-full cursor-pointer rounded-xl border border-zinc-700/70 bg-zinc-900/80 py-2 pl-4 pr-10 text-left text-sm font-medium text-zinc-100 shadow-sm transition hover:border-amber-300/35">
            <span className="block truncate">
              {selected ? selected.name : 'Todos los generos'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <FaChevronDown className="h-3 w-3 text-zinc-500" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-[1000] mt-2 max-h-60 w-full overflow-auto rounded-xl border border-zinc-700/80 bg-zinc-900 shadow-lg">
            <Listbox.Option as={Fragment} key="all" value={null}>
              {({ active, selected }) => (
                <li
                  className={`cursor-pointer select-none px-4 py-2 text-sm ${
                    active ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-300'
                  }`}
                >
                  {selected && <FaCheck className="mr-2 inline text-amber-300" />}
                  Todos los generos
                </li>
              )}
            </Listbox.Option>

            {genres.map((genre) => (
              <Listbox.Option as={Fragment} key={genre.id} value={genre.id}>
                {({ active, selected }) => (
                  <li
                    className={`cursor-pointer select-none px-4 py-2 text-sm ${
                      active ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-300'
                    }`}
                  >
                    {selected && <FaCheck className="mr-2 inline text-amber-300" />}
                    {genre.name}
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </>
      </Listbox>
    </div>
  );
}
