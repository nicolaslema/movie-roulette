import type { MovieOrSeries } from '../../types/MovieTypes';
import { FaDiceFive, FaTrash, FaXmark } from 'react-icons/fa6';

type Props = {
  items: MovieOrSeries[];
  onRemove: (id: number) => void;
  onClear: () => void;
  onPickRandom: () => void;
};

export default function SelectedList({ items, onRemove, onClear, onPickRandom }: Props) {
  return (
    <section
      id="selected-list-section"
      className="mt-10 rounded-[2rem] border border-zinc-700/50 bg-zinc-900/45 px-5 py-8 shadow-[0_24px_70px_-38px_rgba(0,0,0,0.8)] backdrop-blur-md sm:px-8 lg:px-10"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">Tu Curatoria</p>
          <h3 className="text-3xl font-semibold text-zinc-100">Lista seleccionada</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onClear}
            disabled={items.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-900/30 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-900/45 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTrash />
            Vaciar
          </button>

          <button
            onClick={onPickRandom}
            disabled={items.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300/35 bg-[#3f2618] px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-[#5a3320] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaDiceFive />
            Sortear
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-zinc-700/60 bg-zinc-900/70 p-4 text-sm text-zinc-400">
          Aun no agregaste peliculas o series. Selecciona titulos en la cartelera para construir tu shortlist.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {items.map((item) => (
            <article
              key={item.id}
              className="relative overflow-hidden rounded-xl border border-zinc-700/70 bg-zinc-900/80"
            >
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title || item.name}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center text-xs text-zinc-500">
                  Sin poster
                </div>
              )}

              <div className="p-3">
                <h4 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-zinc-100">
                  {item.title || item.name}
                </h4>
              </div>

              <button
                onClick={() => onRemove(item.id)}
                title="Quitar de la lista"
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-600/70 bg-black/70 text-xs text-zinc-100 transition hover:border-rose-300/50 hover:text-rose-200"
              >
                <FaXmark />
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
