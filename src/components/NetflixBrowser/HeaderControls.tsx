import { FaFilm, FaTv } from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';
import { BiReset } from 'react-icons/bi';
import SearchBar from '../SearchBar/SearchBar';
import GenreSelector from '../GenreSelector/GenreSelector';
import DatePicker from '../DatePicker/DatePicker';
import type { ReturnTypeOfUseNetflixBrowserState } from '../../hooks/useNetflixBrowserState';

type Props = {
  state: ReturnTypeOfUseNetflixBrowserState;
};

export default function HeaderControls({ state }: Props) {
  return (
    <div className="relative z-[260] mt-10 rounded-3xl border border-zinc-700/50 bg-black/35 p-5 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.7)] sm:p-6">
      <div className="mb-5 flex flex-wrap gap-3">
        <button
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
            !state.isTV
              ? 'border border-amber-300/45 bg-[#432716] text-amber-100 shadow-md'
              : 'border border-zinc-600/70 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
          }`}
          onClick={() => state.handleTypeChange('movie')}
          disabled={!state.isTV}
        >
          <FaFilm />
          Peliculas
        </button>

        <button
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
            state.isTV
              ? 'border border-amber-300/45 bg-[#432716] text-amber-100 shadow-md'
              : 'border border-zinc-600/70 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
          }`}
          onClick={() => state.handleTypeChange('tv')}
          disabled={state.isTV}
        >
          <FaTv />
          Series
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-5">
          <SearchBar
            query={state.searchQuery}
            onChange={state.setSearchQuery}
            onSubmit={state.handleSearch}
          />

          {!state.searchQuery && (
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                <MdFilterList />
                Genero
              </p>
              <GenreSelector
                genres={state.genres}
                selectedGenre={state.selectedGenre}
                onChange={state.handleGenreChange}
              />
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            <MdFilterList />
            Ventana temporal
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <DatePicker
              label="Desde"
              value={state.releaseDateFrom}
              onChange={state.setReleaseDateFrom}
            />
            <DatePicker
              label="Hasta"
              value={state.releaseDateTo}
              onChange={state.setReleaseDateTo}
            />
            <button
              onClick={state.clearDateFilters}
              className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-950/35 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-900/50"
            >
              <BiReset />
              Limpiar fechas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
