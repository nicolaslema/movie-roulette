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
    <div className="w-full mb-10 rounded-xl bg-gradient-to-br from-zinc-900/30 via-zinc-950/30 to-zinc-900/30 border border-zinc-700/40 shadow-lg px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 🧭 Columna izquierda: controles */}
        <div className="flex flex-col gap-6">
          {/* Tipo de contenido */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300 uppercase tracking-wide">
              Tipo:
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  state.isTV
                    ? 'bg-neutral-800/80 hover:bg-neutral-900/90 text-white border border-zinc-500/30'
                    : 'bg-neutral-900/80 opacity-60 cursor-not-allowed text-zinc-400'
                }`}
                onClick={() => state.handleTypeChange('movie')}
                disabled={!state.isTV}
              >
                <FaFilm className="text-red-400" />
                Películas
              </button>

              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  state.isTV
                    ? 'bg-gray-800/80 opacity-60 cursor-not-allowed text-zinc-400'
                    : 'bg-neutral-900/80 hover:bg-neutral-800/80 text-white border border-zinc-500/30'
                }`}
                onClick={() => state.handleTypeChange('tv')}
                disabled={state.isTV}
              >
                <FaTv className="text-blue-400" />
                Series
              </button>
            </div>
          </div>
                  {/* Search */}
          <div className="w-full">
            <SearchBar
              query={state.searchQuery}
              onChange={state.setSearchQuery}
              onSubmit={state.handleSearch}
            />
          </div>

          {/* Género */}
          {!state.searchQuery && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                <MdFilterList className="text-green-400" />
                Género:
              </div>
              <GenreSelector
                genres={state.genres}
                selectedGenre={state.selectedGenre}
                onChange={state.handleGenreChange}
              />
            </div>
          )}

          {/* Fecha */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300 uppercase tracking-wide">
              <MdFilterList className="text-yellow-400" />
              Fecha:
            </div>
            <div className="flex gap-4 flex-wrap items-end">
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
                className="bg-red-700/30 hover:bg-red-800/30 text-white text-sm px-6 py-3 rounded-md border border-red-500/30 transition flex items-center gap-2"
              >
                <BiReset />
                Reset fechas
              </button>
            </div>
          </div>

  
        </div>

        {/* 🎨 Columna derecha: espacio visual */}
        <div className="flex items-center justify-center min-h-[280px] border border-zinc-700/30 rounded-xl bg-gradient-to-br from-neutral-900/40 to-neutral-800/30 text-zinc-500 text-sm italic">
          {/* Aquí podés insertar shaders, animaciones, previews, etc. */}
         
        </div>
      </div>
    </div>
  );
}
